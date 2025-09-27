const createHttpError = require("http-errors");
const Controller = require("../controller");
const {
  getUserCartDetail,
  invoiceNumberGenerator,
  secretKeyGenerator,
} = require("../../../../utils/functions");
const { PaymentModel } = require("../../../models/payment");
const { UserModel } = require("../../../models/user");
const { CouponModel } = require("../../../models/coupon");
const moment = require("moment-jalali");
const { ProductModel } = require("../../../models/product");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const { transformPayment } = require("../../../../utils/transformPayment");

// Define status mapping for clarity
const ORDER_STATUS = {
  PROCESSING: 1,
  DELIVERED_TO_POST_OFFICE: 2,
  DELIVERED_TO_USER: 3,
};

class PaymentController extends Controller {
  // create payment
  async createPayment(req, res) {
    const user = req.user;
    if (!user.cart?.products || user.cart?.products.length === 0)
      throw createHttpError.BadRequest("سبد خرید شما خالی میباشد");

    const cart = (await getUserCartDetail(user._id))?.[0];
    if (!cart?.payDetail)
      throw createHttpError.BadRequest("مشخصات پرداخت یافت نشد");

    const amount = parseInt(cart?.payDetail?.totalPrice);
    const description = cart?.payDetail?.description;

    // Get product details with cover images
    const productDetails = await ProductModel.find({
      _id: { $in: cart?.payDetail?.productIds },
    }).select("coverImage title");

    // Create payment with ALL required fields including orderStatus
    const payment = await PaymentModel.create({
      invoiceNumber: invoiceNumberGenerator(),
      paymentDate: moment().format("jYYYYjMMjDDHHmmss"),
      amount,
      user: user._id,
      description,
      authority: secretKeyGenerator(),
      status: "COMPLETED",
      orderStatus: ORDER_STATUS.PROCESSING,
      isPaid: true,
      cart: {
        ...cart,
        productDetails: productDetails.map((product) => ({
          _id: product._id,
          title: product.title,
          coverImage: product.coverImage,
        })),
      },
    });

    // add products to the user's Products array
    await UserModel.updateOne(
      { _id: user._id },
      {
        $set: {
          Products: [...(cart?.payDetail?.productIds || []), ...user.Products],
          cart: {
            products: [],
          },
        },
      }
    );

    // decrease products inStock :
    await ProductModel.updateMany(
      { _id: { $in: cart?.payDetail?.productIds } },
      {
        $inc: { countInStock: -1, saleCount: 1 },
      }
    );

    // update Coupon
    if (cart?.coupon)
      await CouponModel.updateOne(
        { _id: cart?.coupon?._id },
        {
          $inc: { usageCount: 1 },
        }
      );

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "سفارش شما با موفقیت ثبت شد",
        paymentId: payment._id,
        invoiceNumber: payment.invoiceNumber,
        amount: payment.amount,
        redirectUrl: `/payment-success/${payment._id}`,
      },
    });
  }
  // get all payments by admin
async getListOfPayments(req, res) {
  // Extract query parameters with defaults
  const { sort = "latest", page = 1, limit = 10 } = req.query;
  
  // Parse pagination parameters
  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  // Build sort query based on sort parameter
  const sortQuery = {};
  switch (sort) {
    case "latest":
      sortQuery.createdAt = -1;
      break;
    case "earliest":
      sortQuery.createdAt = 1;
      break;
    case "amount-high":
      sortQuery.amount = -1;
      break;
    case "amount-low":
      sortQuery.amount = 1;
      break;
    case "invoice":
      sortQuery.invoiceNumber = 1;
      break;
    default:
      sortQuery.createdAt = -1; // Default to latest
  }

  // Get total count for pagination
  const totalCount = await PaymentModel.countDocuments({});

  // Fetch payments with pagination and sorting
  const payments = await PaymentModel.find({})
    .populate([
      {
        path: "user",
        model: "User",
        select: {
          name: 1,
          email: 1,
          phoneNumber: 1,
          avatar: 1,
        },
      },
      {
        path: "cart.products.productId",
        model: "Product",
        select: {
          title: 1,
          slug: 1,
          price: 1,
          coverImage: 1,
          thumbnails: 1,
          discount: 1,
          offPrice: 1,
        },
      },
    ])
    .sort(sortQuery)
    .limit(limitNumber)
    .skip(skip);

  // Transform all payments using the helper function
  const transformedPayments = payments.map((payment) =>
    transformPayment(payment)
  );

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / limitNumber);

  return res.status(HttpStatus.OK).json({
    statusCode: HttpStatus.OK,
    data: {
      payments: transformedPayments,
      pagination: {
        totalCount,
        totalPages,
        currentPage: pageNumber,
        itemsPerPage: limitNumber,
        hasNextPage: pageNumber < totalPages,
        hasPrevPage: pageNumber > 1,
      },
      sort,
      filters: {
        sort,
        page: pageNumber,
        limit: limitNumber,
      },
    },
  });
}
  // get one payment by admin
  async getOnePayment(req, res) {
    const { id } = req.params;
    const payment = await PaymentModel.findById(id).populate([
      {
        path: "user",
        model: "User",
        select: {
          name: 1,
          email: 1,
          phoneNumber: 1,
          avatar: 1,
        },
      },
      {
        path: "cart.products.productId",
        model: "Product",
        select: {
          title: 1,
          slug: 1,
          price: 1,
          coverImage: 1,
          thumbnails: 1,
          discount: 1,
          offPrice: 1,
        },
      },
    ]);

    if (!payment) {
      throw createHttpError.NotFound("سفارشی با این مشخصات پیدا نشد");
    }

    // Transform the single payment using the helper function
    const transformedPayment = transformPayment(payment);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        payment: transformedPayment,
      },
    });
  }
  // update orderStatus by admin
  async updateOrderStatus(req, res) {
    const { id } = req.params;
    const { orderStatus } = req.body;

    // Validate the numeric status
    const validStatuses = [1, 2, 3]; // 1=PROCESSING, 2=DELIVERED_TO_POST_OFFICE, 3=DELIVERED_TO_USER

    if (!validStatuses.includes(orderStatus)) {
      throw createHttpError.BadRequest("وضعیت سفارش نامعتبر است");
    }

    const payment = await PaymentModel.findByIdAndUpdate(
      id,
      { orderStatus },
      { new: true }
    );

    if (!payment) {
      throw createHttpError.NotFound("سفارشی با این مشخصات پیدا نشد");
    }

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "وضعیت سفارش با موفقیت به روز شد",
        payment: transformPayment(payment),
      },
    });
  }
  // get payment's details by user
  async getUserPaymentDetail(req, res) {
    const { id } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    try {
      // Build query based on user role
      let query = { _id: id };

      // Regular users can only see their own payments
      // Admins can see any payment (no user filter)
      if (userRole !== "ADMIN") {
        query.user = userId;
      }

      // Check if the payment exists and user has access
      const payment = await PaymentModel.findOne(query).populate([
        {
          path: "user",
          model: "User",
          select: {
            name: 1,
            email: 1,
            phoneNumber: 1,
            avatar: 1,
          },
        },
        {
          path: "cart.products.productId",
          model: "Product",
          select: {
            title: 1,
            slug: 1,
            price: 1,
            coverImage: 1,
            thumbnails: 1,
            discount: 1,
            offPrice: 1,
          },
        },
      ]);

      if (!payment) {
        throw createHttpError.NotFound(
          userRole !== "ADMIN"
            ? "سفارشی با این مشخصات پیدا نشد یا شما دسترسی ندارید"
            : "سفارشی با این مشخصات پیدا نشد"
        );
      }

      // Transform the payment using the helper function
      const transformedPayment = transformPayment(payment);

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: {
          payment: transformedPayment,
        },
      });
    } catch (error) {
      // Handle specific errors if needed
      if (error.name === "CastError") {
        throw createHttpError.BadRequest("شناسه پرداخت نامعتبر است");
      }
      throw error;
    }
  }
  // Get user's payments
  async getUserPayments(req, res) {
    const userId = req.user._id;

    const payments = await PaymentModel.find({ user: userId }).populate([
      {
        path: "user",
        model: "User",
        select: {
          name: 1,
          email: 1,
          phoneNumber: 1,
          avatar: 1,
        },
      },
      {
        path: "cart.products.productId",
        model: "Product",
        select: {
          title: 1,
          slug: 1,
          price: 1,
          coverImage: 1,
          thumbnails: 1,
          discount: 1,
          offPrice: 1,
        },
      },
    ]);

    // Transform payments
    const transformedPayments = payments.map((payment) =>
      transformPayment(payment)
    );

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        payments: transformedPayments,
      },
    });
  }
}

module.exports = {
  PaymentController: new PaymentController(),
  ORDER_STATUS,
};
