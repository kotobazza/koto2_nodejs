const path = require("path");
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const multer  = require('multer');

const database = require(path.join(__dirname, "..", "services", "database.js"));

const {storageConfig, fileFilter} = require(path.join(__dirname,"..", "services", 'multer.js'));
router.use(multer({storage:storageConfig, fileFilter: fileFilter}).single("publication_image"));

const reasons = [
    "",
    "Добрые слова и пожелания", 
    "Идеи по развитию проекта",
    "Возникли проблемы",
    "Bug report"
]

router.get("/", (req, res)=>{
    console.log("feedback?get")
    res.render("feedback/feedback.ejs", {
        data:reasons
    });
})

router.post("/", async (req, res) => {
    console.log("feedpack?post")
    let user_id = 0;
    if(req.session.user_id){
        user_id = req.session.user_id
    }
    
    
    const feedback_theme = req.body.feedback_theme
    const feedback_comment = req.body.feedback_comment
    const feedback_email = req.body.feedback_email
    const feedback_reason = reasons[req.body.feedback_reason]
    let feedback_rate = req.body.feedback_rate

    if(!feedback_rate){
        feedback_rate = 0
    }

    console.log(user_id, feedback_theme, feedback_comment, feedback_email, feedback_reason, feedback_rate)

    const result = await database.addFeedbackReport(user_id, feedback_theme, feedback_comment, feedback_email, feedback_reason, feedback_rate)
    res.status(200).json({
        "status":"success",
        "message":"Вы отправили новый репорт",
        "theme":feedback_theme
    })

})




module.exports = router