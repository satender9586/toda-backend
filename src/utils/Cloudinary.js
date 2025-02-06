const cloudinary = require("cloudinary").v2
const fs = require("fs")
const path = require('path');
const dotenv = require("dotenv")
dotenv.config()



 // Configuration
 cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUDE_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});




const uploadOnCloudinary = async (localFilePath) => {
    console.log("localFilePath",localFilePath)
    try {
    
      const result = await cloudinary.uploader.upload(localFilePath,{resource_type:'auto'});
  
      
      const filePathToDelete = path.join(__dirname, '../../public/temp/', localFilePath);
      if (fs.existsSync(filePathToDelete)) {
          fs.unlinkSync(filePathToDelete);
      } else {
        console.log('File not found  unlink:', filePathToDelete);
      }
  
      return result.url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      throw new Error("Cloudinary upload failed");
    }
  };
  
module.exports = {uploadOnCloudinary}