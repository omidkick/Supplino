const createError = require("http-errors");
const JWT = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { UserModel } = require("../app/models/user");
const mongoose = require("mongoose");
const moment = require("moment-jalali");
const crypto = require("crypto");

function secretKeyGenerator() {
  return crypto.randomBytes(32).toString("hex").toUpperCase();
}

function generateRandomNumber(length) {
  if (length === 5) {
    return Math.floor(10000 + Math.random() * 90000);
  }
  if (length === 6) {
    return Math.floor(100000 + Math.random() * 900000);
  }
}

function toPersianDigits(n) {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return n.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)]);
}

async function setAccessToken(res, user) {
  const cookieOptions = {
    maxAge: 1000 * 60 * 60 * 24 * 1, // would expire after 1 days
    httpOnly: true, // The cookie only accessible by the web server
    signed: true, // Indicates if the cookie should be signed
    sameSite: "Lax",
    secure: process.env.NODE_ENV === "development" ? false : true,
    domain: process.env.DOMAIN,
    // domain:
    //   process.env.NODE_ENV === "development" ? "localhost" : ".fronthooks.ir",
  };
  res.cookie(
    "accessToken",
    await generateToken(user, "1d", process.env.ACCESS_TOKEN_SECRET_KEY),
    cookieOptions
  );
}

async function setRefreshToken(res, user) {
  const cookieOptions = {
    maxAge: 1000 * 60 * 60 * 24 * 365, // would expire after 1 year
    httpOnly: true, // The cookie only accessible by the web server
    signed: true, // Indicates if the cookie should be signed
    sameSite: "Lax",
    secure: process.env.NODE_ENV === "development" ? false : true,
    domain: process.env.DOMAIN,
    // domain:
    //   process.env.NODE_ENV === "development" ? "localhost" : ".fronthooks.ir",
  };
  res.cookie(
    "refreshToken",
    await generateToken(user, "1y", process.env.REFRESH_TOKEN_SECRET_KEY),
    cookieOptions
  );
}

function generateToken(user, expiresIn, secret) {
  return new Promise((resolve, reject) => {
    const payload = {
      _id: user._id,
    };

    const options = {
      expiresIn,
    };

    JWT.sign(
      payload,
      secret || process.env.TOKEN_SECRET_KEY,
      options,
      (err, token) => {
        if (err) reject(createError.InternalServerError("خطای سروری"));
        resolve(token);
      }
    );
  });
}
function verifyRefreshToken(req) {
  const refreshToken = req.signedCookies["refreshToken"];
  if (!refreshToken) {
    throw createError.Unauthorized("لطفا وارد حساب کاربری خود شوید.");
  }
  const token = cookieParser.signedCookie(
    refreshToken,
    process.env.COOKIE_PARSER_SECRET_KEY
  );
  return new Promise((resolve, reject) => {
    JWT.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET_KEY,
      async (err, payload) => {
        try {
          if (err)
            reject(createError.Unauthorized("لطفا حساب کاربری خود شوید"));
          const { _id } = payload;
          const user = await UserModel.findById(_id, {
            password: 0,
            otp: 0,
            resetLink: 0,
          });
          if (!user) reject(createError.Unauthorized("حساب کاربری یافت نشد"));
          return resolve(_id);
        } catch (error) {
          reject(createError.Unauthorized("حساب کاربری یافت نشد"));
        }
      }
    );
  });
}

async function getUserCartDetail(userId) {
  const cartDetail = await UserModel.aggregate([
    {
      $match: { _id: userId },
    },
    {
      $project: { cart: 1, name: 1 },
    },
    {
      $lookup: {
        from: "products",
        localField: "cart.products.productId",
        foreignField: "_id",
        as: "productDetail",
      },
    },
    {
      $lookup: {
        from: "coupons",
        localField: "cart.coupon",
        foreignField: "_id",
        as: "coupon",
      },
    },
    {
      $project: {
        name: 1,
        coupon: { $arrayElemAt: ["$coupon", 0] },
        cart: 1,
        productDetail: {
          _id: 1,
          slug: 1,
          title: 1,
          icon: 1,
          discount: 1,
          price: 1,
          offPrice: 1,
          imageLink: 1,
        },
      },
    },
    {
      $addFields: {
        productDetail: {
          $function: {
            body: function (productDetail, products) {
              return productDetail.map(function (product) {
                const quantity = products.find(
                  (item) => item.productId.valueOf() == product._id.valueOf()
                ).quantity;
                return {
                  ...product,
                  quantity,
                };
              });
            },
            args: ["$productDetail", "$cart.products"],
            lang: "js",
          },
        },
      },
    },
    {
      $addFields: {
        discountDetail: {
          $function: {
            body: function discountDetail(productDetail, coupon) {
              if (!coupon) {
                return {
                  newProductDetail: productDetail,
                  coupon: null,
                };
              }

              const isExpiredCoupon =
                coupon.expireDate &&
                new Date(coupon.expireDate).getTime() < Date.now();
              const isReachedLimit = coupon.usageCount >= coupon.usageLimit;

              if (!coupon.isActive || isReachedLimit || isExpiredCoupon) {
                return {
                  newProductDetail: productDetail,
                  coupon: null,
                };
              }

              const newProductDetail = productDetail.map((product) => {
                const isProductInCoupon = coupon.productIds.find((id) =>
                  id.equals(product._id)
                );

                if (isProductInCoupon) {
                  // Use the already discounted price if available, otherwise use original price
                  const currentPrice = product.offPrice || product.price;

                  if (
                    coupon.type === "fixedProduct" ||
                    coupon.type === "fixed"
                  ) {
                    if (currentPrice < coupon.amount) {
                      // Don't go below 0
                      return {
                        ...product,
                        offPrice: 0,
                      };
                    }
                    return {
                      ...product,
                      offPrice: currentPrice - coupon.amount,
                    };
                  }
                  if (
                    coupon.type === "percent" ||
                    coupon.type === "percentage"
                  ) {
                    const discountedPrice = parseInt(
                      currentPrice * (1 - coupon.amount / 100)
                    );
                    return {
                      ...product,
                      offPrice: discountedPrice > 0 ? discountedPrice : 0,
                    };
                  }
                }
                return product;
              });

              return {
                newProductDetail,
                coupon: { code: coupon.code, _id: coupon._id },
              };
            },
            args: ["$productDetail", "$coupon"],
            lang: "js",
          },
        },
      },
    },
    {
      $addFields: {
        payDetail: {
          $function: {
            body: function (discountDetail, userName, originalProductDetail) {
              // Use discountDetail products if available, otherwise use original
              const productDetail =
                discountDetail?.newProductDetail || originalProductDetail;

              const totalPrice = productDetail.reduce((total, product) => {
                return total + parseInt(product.offPrice * product.quantity);
              }, 0);

              const totalGrossPrice = productDetail.reduce((total, product) => {
                return total + parseInt(product.price * product.quantity);
              }, 0);

              const totalOffAmount = productDetail.reduce((total, product) => {
                return (
                  total +
                  parseInt(
                    (product.price - product.offPrice) * product.quantity
                  )
                );
              }, 0);

              const orderItems = [];
              productDetail.map((product) => {
                orderItems.push({
                  price: product.offPrice,
                  product: product._id,
                });
              });

              const productIds = productDetail.map((product) =>
                product._id.valueOf()
              );

              const description = `${productDetail
                .map((p) => p.title)
                .join(" - ")} | ${userName}`;

              return {
                totalOffAmount,
                totalPrice,
                totalGrossPrice,
                orderItems,
                productIds,
                description,
              };
            },
            args: ["$discountDetail", "$name", "$productDetail"],
            lang: "js",
          },
        },
      },
    },
    {
      $set: {
        productDetail: {
          $cond: {
            if: { $ne: ["$discountDetail", null] },
            then: "$discountDetail.newProductDetail",
            else: "$productDetail",
          },
        },
        coupon: {
          $cond: {
            if: { $ne: ["$discountDetail", null] },
            then: "$discountDetail.coupon",
            else: null,
          },
        },
      },
    },
    {
      $project: {
        cart: 0,
        name: 0,
        discountDetail: 0,
      },
    },
  ]);
  return copyObject(cartDetail);
}
function copyObject(object) {
  return JSON.parse(JSON.stringify(object));
}
function deleteInvalidPropertyInObject(data = {}, blackListFields = []) {
  // let nullishData = ["", " ", "0", 0, null, undefined];
  let nullishData = ["", " ", null, undefined];
  Object.keys(data).forEach((key) => {
    if (blackListFields.includes(key)) delete data[key];
    if (typeof data[key] == "string") data[key] = data[key].trim();
    if (Array.isArray(data[key]) && data[key].length > 0)
      data[key] = data[key].map((item) => item.trim());
    if (Array.isArray(data[key]) && data[key].length == 0) delete data[key];
    if (nullishData.includes(data[key])) delete data[key];
  });
}
async function checkProductExist(id) {
  const { ProductModel } = require("../app/models/product");
  if (!mongoose.isValidObjectId(id))
    throw createError.BadRequest("شناسه محصول ارسال شده صحیح نمیباشد");
  const product = await ProductModel.findById(id);
  if (!product) throw createError.NotFound("محصولی یافت نشد");
  return product;
}

function invoiceNumberGenerator() {
  return (
    moment().format("jYYYYjMMjDDHHmmssSSS") +
    String(process.hrtime()[1]).padStart(9, 0)
  );
}

module.exports = {
  generateRandomNumber,
  toPersianDigits,
  setAccessToken,
  setRefreshToken,
  verifyRefreshToken,
  getUserCartDetail,
  copyObject,
  deleteInvalidPropertyInObject,
  checkProductExist,
  invoiceNumberGenerator,
  secretKeyGenerator,
};
