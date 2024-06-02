const path = require("path")
const multer  = require('multer');

uploadsDir = "public/uploads" 
uploadsDir = path.join(__dirname, "..", "..", "public", "uploads")
console.log("PATH: "+uploadsDir)

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) =>{
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
  
    if(file.mimetype === "image/png" || 
    file.mimetype === "image/jpg"|| 
    file.mimetype === "image/jpeg"){
        cb(null, true);
    }
    else{
        cb(new Error("Wrong file format. Use only png, jpg or jpeg"), false);
    }
}

module.exports = { storageConfig, fileFilter }

