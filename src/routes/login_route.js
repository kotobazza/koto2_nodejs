const path = require("path");
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const database = require(path.join(__dirname, "..", "services", "database.js"));


router.post('/signup', async (req, res) => {
    console.log("/signup")
    const {login, password, confirm} = req.body;

    if(!(login && password && confirm)){
        res.status(200).json({
            "status":"error",
            "message":"Сервер получил неполные данные"
        });
        return;
    }

    if(password != confirm){
        res.status(200).json({
            "status":"error",
            "message":"Подтверждение не совпдаает с паролем"
        });
        return
    }

    const dataPairExists = await database.checkIsLoginPasswordPairExists(login, password);
    if(dataPairExists){
        res.status(200).json({
            "status":"error",
            "message":"Пользователь уже существует"
        });
        return
    }

    const user_id = await database.addUser(login, password);
    if (!user_id){
        console.log("something wrong with db")
        res.status(400).json("Error in database")
        return
    }
    req.session.user_id = user_id;
    req.session.user_login = login;

    

    req.session.save(err => {
        if(err){
            console.log("session set error")
            res.status(200).json({
                "status":"error",
                "message":"Ошибка с сессией"
            })
        }
        else{
            res.status(200).json({
                "status":"success",
                "message":"Пользователь вошел в систему"
            }) 

        }
        
    })
});




router.post('/signin', async (req, res) => {
    console.log("/signin")
    const {login, password} = req.body;
    
    if(!(login && password)){
        res.status(200).json({
            "status":"error",
            "message":"Сервер получил неполные данные"
        });
        
        return
    }

    const dataPairExists = await database.checkIsLoginPasswordPairExists(login, password);
    if(!dataPairExists){
        res.status(200).json({
            "status":"error",
            "message":"Пользователь не найден"
        });
        return
        
    }

    const user_id = await database.getUserId(login, password);

    if (!user_id){
        console.log("something wrong with db")
        res.status(400).json("Error in database")
        return
    }


    req.session.user_id = user_id;
    req.session.user_login = login;


    req.session.save(err => {
        if(err){
            console.log("session set error")
            res.status(200).json({
                "status":"error",
                "message":"Ошибка с сессией"
            })
            
        }
        else{
            res.status(200).json({
                "status":"success",
                "message":"Пользователь вошел в систему"
            }) 
            

        }
        
    })



});


router.get("/session_status", (req, res)=>{
    console.log("/session_status")
    res.status(200).send("Session status: " + req.session.user_id + " " + req.session.user_login);
})

router.get("/signout", async (req, res) => {
    console.log("User signed out")
    req.session.destroy(err =>{
        if(err){
            res.status(200).json({
                "status":"errror",
                "message":"can't destroy session"
            })
        }
        else{
            res.redirect("/");
        }
    });
    
})


router.post("/delete", async (req, res)=>{

})




module.exports = router;