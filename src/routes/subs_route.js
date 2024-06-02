const path = require("path");
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const database = require(path.join(__dirname, "..", "services", "database.js"));




router.get("/", async (req, res)=>{
    console.log("subscriptions/")

    const user_id = req.session.user_id;
    const results = await database.getAllSubscriptions(user_id);
    

    res.render("subscriptions/subscriptions.ejs", {data: results, user_id:user_id});
})

router.get("/subscribed", async(req, res)=>{
    console.log(req.body)
    



})

router.post("/subscribe", async(req, res)=>{
    console.log("/subscribe")
    const {subscribe_to} = req.body;
    const user_id = req.session.user_id;

    const isSubscribedExitst = await database.checkIsUserExists(subscribe_to)
    if(!isSubscribedExitst){
        res.status(200).json({
            "status":"error",
            "message":"Пользователь для слежения не существует"
        })
        return
    }

    const isSubscribed = await database.checkIsSubscribedTo(user_id, subscribe_to)
    if(isSubscribed){
        res.status(200).json({
            "status":"error",
            "message":"Вы уже подписаны на этого пользователя"
        })
        return
    }

    const subscriptionId = await database.addSubscription(user_id, subscribe_to)
    const subscribeLogin = await database.getUserLogin(subscribe_to)
    res.status(200).json({
        "status":"success",
        "message":"Вы успешно подписаны на пользователя",
        "login":subscribeLogin
    })
})




router.post("/unsubscribe", async(req, res)=>{
    console.log("/unsubscribe")
    const {unsubscribe_from} = req.body;
    const user_id = req.session.user_id;

    const isSubscribedExitst = await database.checkIsUserExists(unsubscribe_from)
    if(!isSubscribedExitst){
        res.status(200).json({
            "status":"error",
            "message":"Пользователь для отмены подписки не существует"
        })
        return
    }

    const isSubscribed = await database.checkIsSubscribedTo(user_id, unsubscribe_from)
    if(!isSubscribed){
        res.status(200).json({
            "status":"error",
            "message":"Вы еще не подписаны на этого пользователя"
        })
        return
    }
    const unsubscribed = await database.deleteSubscription(user_id, unsubscribe_from)
    const subscribedLogin = await database.getUserLogin(unsubscribe_from)
    res.status(200).json({
        "status":"success",
        "message":"Вы успешно отписаны от пользователя",
        "login":subscribedLogin
    })
})


module.exports = router;