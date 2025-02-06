const bcrypt = require("bcrypt")

const otpGeneratefun = ()=>{
    let otp = ''
    const digit = "1234567890"

    for (let i = 0; i <= 5; i++) {
        const rendomdigit = Math.floor(Math.random() * digit.length)
        otp += rendomdigit;
    }
    return otp;
}


const otpExpireTimeGenerate = ()=>{
    const time = new Date().getMinutes()*60
    return time;
}



const bcryptPassword = async function(password){
    try {
        return await bcrypt.hash(password,10)
    } catch (error) {
        console.log(error)
        return { success: false, error: error.message }; 
    }
}



const planPassword =async function( password, old) {
   try {
     const match = await bcrypt.compare(password, old);
    return match
   } catch (error) {
     console.log(error)
     return { success: false, error: error.message }; 
   }

  
}
module.exports = {otpGeneratefun,bcryptPassword,planPassword, otpExpireTimeGenerate}