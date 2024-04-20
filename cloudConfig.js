const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({ //connecting to cloud storage
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.CLOUD_API_KEY,
    api_secret : process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({ //storage
    cloudinary: cloudinary,
    params: {
      folder: 'VagabondVista_DEV',
      allowerdFormats : ["png","jpg","jpeg"],
    },
});

module.exports = {
    cloudinary,
    storage,
}