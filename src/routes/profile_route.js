const path = require("path");
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const database = require(path.join(__dirname, "..", "services", "database.js"));



router.get("/", async (req, res)=>{
    console.log("/profile")
    let owner_id = req.query.id;
    const user_id = req.session.user_id;
    if(!owner_id){
        owner_id = user_id;
    }
    const isUserExists = await database.checkIsUserExists(owner_id)
    if(!isUserExists){
        res.render("page404/page.ejs");
        return;
    }
    const owner_login = await database.getUserLogin(owner_id);
    const user_login = req.session.user_login;

    const categories = ["", "Стиль жизни", "Веселье", "Работа", "Нытье"]

    var allPublications = await database.getAllPublications(owner_id);
    if(user_id != owner_id){
        allPublications = await database.getAllPublicationsFromOtherUser(user_id, owner_id)
    }

    res.render("profile/profile.ejs", {
        data:allPublications, 
        user_login:user_login,
        user_id:user_id,
        owner_login:owner_login,
        owner_id:owner_id,
        categories:categories
    })
    


    
})



module.exports = router