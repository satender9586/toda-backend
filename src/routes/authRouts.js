const express = require("express")
const {userRegister, loginUser,verifyEmailOtp,resendOtp,uploadProfile,getUserDetails,forgetPassword,updatePassword}= require("../controller/authcontoller.js")
const storage = require("../middleware/multer.js")
const router = express.Router();





router.post("/register",userRegister)
router.post("/login",loginUser)
router.post("/otpVerify",verifyEmailOtp)
router.post("/otpresend",resendOtp)
router.post("/forgetpassword",forgetPassword)
router.post("/updatepassord",updatePassword)
router.get("/userinfo/:id",getUserDetails)
router.put("/upload-profile",storage.single("file") ,uploadProfile)

module.exports = router