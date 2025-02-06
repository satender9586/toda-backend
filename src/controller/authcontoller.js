const { bcryptPassword, planPassword } = require("../services/function.js");
const User = require("../models/userRegister.js");
const { nodemailerfun } = require("../config/Node_Mailer.js");
const { otpGeneratefun,
  otpExpireTimeGenerate,
} = require("../services/function.js");
const { uploadOnCloudinary } = require("../utils/Cloudinary.js")
const Jwt = require("jsonwebtoken");




const userRegister = async (req, res) => {
  const { userName, email, password } = req.body;
  try {
    if (!userName) {
      return res
        .status(400)
        .json({ success: false, message: "userName is missing" });
    }
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "email is missing" });
    }
    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: "password is missing" });
    }
    const isUserExists = await User.findOne({ email: email });

    if (isUserExists) {
      return res
        .status(400)
        .json({ success: false, message: "user already exists", user: email });
    }
    const otp = otpGeneratefun();
    const gmail = email;
    const otptime = otpExpireTimeGenerate(); // storing expire time in minute
    const subject = "otp for user registration ";
    await nodemailerfun({ gmail, subject, otp });

    const hashPassword = await bcryptPassword(password);
    const user = new User({
      userName,
      email,
      password: hashPassword,
      otp,
      otptime,
    });
    await user.save();
    return res
      .status(201)
      .json({ success: true, message: "user registered successfully", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "internal server error" });
  }
};


const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email) {
      return res
        .status(404)
        .json({ success: false, message: "email is missing!" });
    }
    if (!password) {
      return res
        .status(404)
        .json({ success: false, message: "password is missing!" });
    }

    const isUserExists = await User.findOne({ email }).lean();

    if (!isUserExists) {
      return res
        .status(404)
        .json({ success: false, message: "user doesn't exist" });
    }

    const isPasswordCorrect = await planPassword(password, isUserExists.password);

    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    const token = Jwt.sign(
      {
        _id: isUserExists._id,
        email: isUserExists.email,
      },
      process.env.TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      userName: isUserExists.userName,
      _id: isUserExists._id,
      accessToken: token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "internal server error" });
  }
};


const resendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required!",
      });
    }

    const isUserExists = await User.findOne({ email });

    if (!isUserExists) {
      return res.status(404).json({
        success: false,
        message: "Email does not exist!",
      });
    }

    if (isUserExists.isVerify) {
      return res.status(400).json({
        success: false,
        message: "Email already verified!",
      });
    }

    const otp = otpGeneratefun();
    const gmail = email;
    const otptime = otpExpireTimeGenerate();

    isUserExists.otp = otp;
    isUserExists.otptime = otptime;

    const subject = "OTP for User Registration";
    console.log(
      "Function calling:",
      await nodemailerfun({ gmail, subject, otp })
    );

    await isUserExists.save();

    return res.status(200).json({
      success: true,
      message: "OTP has been sent successfully!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


const verifyEmailOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is missing!",
      });
    }

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "OTP is missing!",
      });
    }

    const isUserExists = await User.findOne({ email });
    if (!isUserExists) {
      return res.status(404).json({
        success: false,
        message: "Email does not exist",
      });
    }

    const currentMinute = otpExpireTimeGenerate();
    const dbExpiresAtMinute = isUserExists.otptime + 3;

    if (currentMinute <= dbExpiresAtMinute) {
      if (isUserExists.otp === otp) {
        isUserExists.isVerify = true;
        isUserExists.otp = 0;
        isUserExists.otptime = 0;

        await isUserExists.save();
        return res.status(200).json({
          success: true,
          message: "Email OTP verified successfully",
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Incorrect OTP",
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is missing!" });
    }

    const isUserExists = await User.findOne({ email });
    if (!isUserExists) {
      return res
        .status(404)
        .json({ success: false, message: "User does not exist" });
    }

    const otp = otpGeneratefun();
    const otpExpirationTime = otpExpireTimeGenerate();

    isUserExists.otp = otp;
    isUserExists.otptime = otpExpirationTime;
    await isUserExists.save();

    const subject = "OTP for Forgot Password";
    nodemailerfun({ gmail: email, subject, otp })
      .then((emailSent) => {
        console.log("Email sent successfully", emailSent);
      })
      .catch((emailError) => {
        console.error("Email sending failed:", emailError);
      });

    return res.status(200).json({
      success: true,
      message:
        "OTP sent successfully for password reset. Please check your email.",
      otp,
    });
  } catch (error) {
    console.error("Error in forgetPassword:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};


const updatePassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP, and new password are required!",
      });
    }

    const isUserExists = await User.findOne({ email });
    if (!isUserExists) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    const currentMinute = otpExpireTimeGenerate();
    const dbExpiresAtMinute = isUserExists.otptime + 3;
    const hashPassword = await bcryptPassword(newPassword);

    if (currentMinute <= dbExpiresAtMinute) {
      if (isUserExists.otp === otp) {
        isUserExists.password = hashPassword;
        isUserExists.otp = 0;
        isUserExists.otptime = 0;

        await isUserExists.save();

        return res.status(200).json({
          success: true,
          message: "Password updated successfully!",
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Incorrect OTP",
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }
  } catch (error) {
    console.error("Error in updatePassword:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};



const uploadProfile = async (req, res) => {
  const file = req.file
  const { _id } = req.body;
  try {

    if (!file) {
      return res.status(404).json({ success: false, message: "File is missing!" })
    }

    if (!_id) {
      return res.status(404).json({ success: false, message: "_id is missing!" })
    }

    const CloudinaryUploadUrl = await uploadOnCloudinary(file.path)

    if (!CloudinaryUploadUrl) {
      return res.status(400).json({ success: false, message: "something is woring with Cloudinary" })
    }

    const isUserExists = await User.findByIdAndUpdate(_id, { profileImage: CloudinaryUploadUrl, updatedAt: Date.now() }, { new: true }).lean()

    if (!isUserExists) {
      return res.status(404).json({ success: false, message: "User does not existing!" })
    }

    return res.status(200).json({
      success: true,
      message: "File Upload Successfully",
      CloudinaryUploadUrl
    })

  } catch (error) {
    console.error("Error in fileupload:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
}

const getUserDetails = async (req, res) => {
 
  const {id} = req.params;


  try {

    if (!id) {
      return res.status(404).json({
        success: false,
        message: "user id is missing!"
      })
    }

    const isUserExists = await User.findOne({ _id:id })
    if (!isUserExists) {
      return res.status(404).json({
        success: false,
        message: "user is not exists"
      })
    }

    await res.status(200).json({
      success: true,
      message: "user retrive successfullt ",
      isUserExists
    })

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "internal server error" });
  }

}




module.exports = {
  userRegister,
  loginUser,
  verifyEmailOtp,
  resendOtp,
  forgetPassword,
  updatePassword,
  uploadProfile,
  getUserDetails
};
