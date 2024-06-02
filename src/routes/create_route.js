const path = require("path");
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const multer  = require('multer');

const database = require(path.join(__dirname, "..", "services", "database.js"));

const {storageConfig, fileFilter} = require(path.join(__dirname,"..", "services", 'multer.js'));
router.use(multer({storage:storageConfig, fileFilter: fileFilter}).single("publication_image"));

router.get("/", (req, res)=>{
    console.log("create?get")
    res.render("create/create.ejs");
})

router.post("/", async (req, res) => {
    console.log("create?post")
    const {publication_title, publication_text, publication_category} = req.body
    
    console.log(publication_category)

    let got_image = false;
    
    let publication_image = "";
    if(req.file){
        publication_image = req.file.filename
        got_image = true;
    }


    const user_id = req.session.user_id
    const user_login = req.session.user_login

    const publication_id = await database.addPublication(user_id, publication_title, publication_text, publication_category, publication_image)
    
    res.status(200).json({
        "status":"success",
        "message":"Создана новая публикация",
        "publication_title":publication_title,
        "got_image":got_image
    })
})




module.exports = router