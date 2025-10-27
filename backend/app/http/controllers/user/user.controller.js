const Controller = require("../controller");
const {
  generateRandomNumber,
  toPersianDigits,
  setAccessToken,
  setRefreshToken,
  verifyRefreshToken,
  getUserCartDetail,
} = require("../../../../utils/functions");
const createError = require("http-errors");
const { UserModel } = require("../../../models/user");
const Kavenegar = require("kavenegar");
const CODE_EXPIRES = 90 * 1000; //90 seconds in miliseconds
const { StatusCodes: HttpStatus } = require("http-status-codes");
const path = require("path");
const { ROLES } = require("../../../../utils/constants");
const {
  checkOtpSchema,
  completeProfileSchema,
  updateProfileSchema,
} = require("../../validators/user/user.schema");
const { PaymentModel } = require("../../../models/payment");

class userAuthController extends Controller {
  constructor() {
    super();
    this.code = 0;
    this.phoneNumber = null;
  }
  // In user.controller.js - fix the IS_TESTING_MODE_OTP check
  async getOtp(req, res) {
    let { phoneNumber } = req.body;

    if (!phoneNumber)
      throw createError.BadRequest("شماره موبایل معتبر را وارد کنید");

    phoneNumber = phoneNumber.trim();
    this.phoneNumber = phoneNumber;
    this.code = generateRandomNumber(6);

    const result = await this.saveUser(phoneNumber);
    if (!result) throw createError.Unauthorized("ورود شما انجام نشد.");

    // ✅ Strict check for testing mode
    const isTestingMode =
      String(process.env.IS_TESTING_MODE_OTP).toLowerCase() === "true";

    if (isTestingMode) {
      // console.log("OTP Testing Mode: no message sent to Kavenegar");
      return res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        data: {
          message: `کد تائید (تستی): ${this.code}`,
          expiresIn: CODE_EXPIRES,
          phoneNumber,
        },
      });
    }

    // ✅ Only call real API in non-testing mode
    this.sendOTP(phoneNumber, res);
  }

  async checkOtp(req, res) {
    await checkOtpSchema.validateAsync(req.body);
    const { otp: code, phoneNumber } = req.body;

    const user = await UserModel.findOne(
      { phoneNumber },
      { password: 0, refreshToken: 0, accessToken: 0 }
    );
    // .populate([
    //   {
    //     path: "Products",
    //     model: "Product",
    //     select: {
    //       title: 1,
    //       slug: 1,
    //       price: 1,
    //       icon: 1,
    //     },
    //     populate: [
    //       {
    //         // deeper
    //         path: "seller",
    //         model: "Seller",
    //         select: { name: 1, icon: 1 },
    //       },
    //     ],
    //   },
    // ]);

    if (!user) throw createError.NotFound("کاربری با این مشخصات یافت نشد");

    if (user.otp.code != code)
      throw createError.BadRequest("کد ارسال شده صحیح نمیباشد");

    if (new Date(`${user.otp.expiresIn}`).getTime() < Date.now())
      throw createError.BadRequest("کد اعتبار سنجی منقضی شده است");

    user.isVerifiedPhoneNumber = true;
    await user.save();

    // await setAuthCookie(res, user); // set httpOnly cookie
    await setAccessToken(res, user);
    await setRefreshToken(res, user);
    let WELLCOME_MESSAGE = `کد تایید شد، به ساپلینو خوش آمدید`;
    if (!user.isActive)
      WELLCOME_MESSAGE = `کد تایید شد، لطفا اطلاعات خود را تکمیل کنید`;

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: WELLCOME_MESSAGE,
        user,
      },
    });
  }

  async saveUser(phoneNumber) {
    const otp = {
      code: this.code,
      expiresIn: Date.now() + CODE_EXPIRES,
    };

    const user = await this.checkUserExist(phoneNumber);
    if (user) return await this.updateUser(phoneNumber, { otp });

    return await UserModel.create({
      phoneNumber,
      otp,
      role: ROLES.USER,
    });
  }
  async checkUserExist(phoneNumber) {
    const user = await UserModel.findOne({ phoneNumber });
    return user;
  }
  async updateUser(phoneNumber, objectData = {}) {
    Object.keys(objectData).forEach((key) => {
      if (["", " ", 0, null, undefined, "0", NaN].includes(objectData[key]))
        delete objectData[key];
    });
    const updatedResult = await UserModel.updateOne(
      { phoneNumber },
      { $set: objectData }
    );
    return !!updatedResult.modifiedCount;
  }

  sendOTP(phoneNumber, res) {
    // Check if API key exists
    if (!process.env.KAVENEGAR_API_KEY) {
      console.error("KAVENEGAR_API_KEY is not configured");
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "سرویس ارسال پیامک پیکربندی نشده است",
      });
    }

    const kaveNegarApi = Kavenegar.KavenegarApi({
      apikey: process.env.KAVENEGAR_API_KEY,
    });

    kaveNegarApi.VerifyLookup(
      {
        receptor: phoneNumber,
        token: this.code,
        template: "registerVerify",
      },
      (response, status) => {
        // console.log("kavenegar message status", status);
        // console.log("kavenegar response", response);

        if (response && status === 200) {
          return res.status(HttpStatus.OK).send({
            statusCode: HttpStatus.OK,
            data: {
              message: `کد تائید برای شماره موبایل ${toPersianDigits(
                phoneNumber
              )} ارسال گردید`,
              expiresIn: CODE_EXPIRES,
              phoneNumber,
            },
          });
        }

        // More detailed error handling
        console.error("Kavenegar API Error:", { status, response });
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: "خطا در ارسال کد اعتبارسنجی",
          details: response || "Unknown error",
        });
      }
    );
  }
  async completeProfile(req, res) {
    await completeProfileSchema.validateAsync(req.body);
    const { user } = req;
    const { name, email } = req.body;

    if (!user.isVerifiedPhoneNumber)
      throw createError.Forbidden("شماره موبایل خود را تایید کنید.");

    const duplicateUser = await UserModel.findOne({ email });

    if (duplicateUser)
      throw createError.BadRequest(
        "کاربری با این ایمیل قبلا ثبت نام کرده است."
      );

    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: user._id },
      { $set: { name, email, isActive: true } },
      { new: true }
    );
    // await setAuthCookie(res, updatedUser);
    await setAccessToken(res, updatedUser);
    await setRefreshToken(res, updatedUser);

    return res.status(HttpStatus.OK).send({
      statusCode: HttpStatus.OK,
      data: {
        message: "اطلاعات شما با موفقیت تکمیل شد",
        user: updatedUser,
      },
    });
  }
  async updateProfile(req, res) {
    const { _id: userId } = req.user;
    await updateProfileSchema.validateAsync(req.body);
    const { name, email, biography, phoneNumber } = req.body;

    const updateResult = await UserModel.updateOne(
      { _id: userId },
      {
        $set: { name, email, biography, phoneNumber },
      }
    );
    if (!updateResult.modifiedCount === 0)
      throw createError.BadRequest("اطلاعات ویرایش نشد");
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "اطلاعات با موفقیت آپدیت شد",
      },
    });
  }
  async refreshToken(req, res) {
    const userId = await verifyRefreshToken(req);
    const user = await UserModel.findById(userId);
    await setAccessToken(res, user);
    await setRefreshToken(res, user);
    return res.status(HttpStatus.OK).json({
      StatusCode: HttpStatus.OK,
      data: {
        user,
      },
    });
  }
  async getUserProfile(req, res) {
    const { _id: userId } = req.user;
    const user = await UserModel.findById(userId, { otp: 0 });
    const cart = (await getUserCartDetail(userId))?.[0];
    const payments = await PaymentModel.find({ user: userId });

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        user,
        payments,
        cart,
      },
    });
  }
  logout(req, res) {
    const cookieOptions = {
      maxAge: 1,
      expires: Date.now(),
      httpOnly: true,
      signed: true,
      sameSite: "Lax",
      secure: true,
      path: "/",
      domain: process.env.DOMAIN,
    };
    res.cookie("accessToken", null, cookieOptions);
    res.cookie("refreshToken", null, cookieOptions);

    return res.status(HttpStatus.OK).json({
      StatusCode: HttpStatus.OK,
      roles: null,
      auth: false,
    });
  }
  async updateAvatar(req, res) {
    const { _id: userId } = req.user;
    const { fileUploadPath, filename } = req.body; // Or adjust if using multer or similar

    if (!fileUploadPath || !filename)
      throw createError.BadRequest("اطلاعات فایل ارسال نشده است");

    // Construct file path, fix slashes for URLs
    const fileAddress = path.join(fileUploadPath, filename);
    const avatarAddress = fileAddress.replace(/\\/g, "/");

    const updateResult = await UserModel.updateOne(
      { _id: userId },
      { $set: { avatar: avatarAddress } }
    );

    if (!updateResult.modifiedCount)
      throw createError.BadRequest("عکس پروفایل آپلود نشد");

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "عکس پروفایل با موفقیت آپلود شد",
        avatar: avatarAddress,
      },
    });
  }
}

module.exports = {
  UserAuthController: new userAuthController(),
};
