const path = require("path");
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const multer = require('multer');

const database = require(path.join(__dirname, "..", "services", "database.js"));

const { storageConfig, fileFilter } = require(path.join(__dirname, "..", "services", 'multer.js'));
router.use(multer({ storage: storageConfig, fileFilter: fileFilter }).single("publication_image"));

router.get("/", async (req, res) => {
    console.log("publications/")
    const user_id = req.session.user_id;
    const user_login = req.session.user_login;

    const categories = ["", "Стиль жизни", "Веселье", "Работа", "Нытье"]

    const allSubscribedPublications = await database.getAllSubscribedPublications(user_id);
    res.render("publications/publications.ejs", {
        data: allSubscribedPublications,
        user_login: user_login,
        user_id: user_id,
        categories: categories
    })
})


router.post("/delete", async (req, res) => {
    console.log("publucations/delete")
    const { pending_to_delete } = req.body;

    const user_id = req.session.user_id;
    const isUserExists = await database.checkIsUserExists(user_id)
    if (!isUserExists) {
        res.status(200).json({
            "status": "error",
            "message": "Несуществующий пользователь"
        })
        return
    }


    const isPublicationExists = await database.checkIsPublicationExists(pending_to_delete)
    if (!isPublicationExists) {
        res.status(200).json({
            "status": "error",
            "message": "Этой публикации не существует"
        })
        return
    }

    const publication = await database.getPublication(pending_to_delete)

    await database.deleteAllLikesFromPublication(pending_to_delete)

    const deleted = await database.deletePublication(pending_to_delete)
    res.status(200).json({
        "status": "success",
        "message": "Публикация удалена",
        "publication_title": publication.title
    })



})

router.post("/edit", async (req, res) => {
    console.log("pulications/edit")

    let publication_image = ""
    let got_image = false
    if (req.file) {
        publication_image = req.file.filename
        got_image = true;
    }
    else {
        console.log("no image")
    }

    let { publication_id, publication_title, publication_text } = req.body

    if (!publication_id) {
        res.status(200).json({
            "status": "error",
            "message": "Ошибка в запросе"
        })
    }

    const old_publication = await database.getPublication(publication_id)

    publication_title = publication_title || old_publication[0].title
    publication_text = publication_text || old_publication[0].text
    publication_image = publication_image || old_publication[0].upload_file


    const updated = await database.updatePublication(publication_id, publication_title, publication_text, publication_image)

    res.status(200).json({
        "status": "success",
        "message": "Публикация успешно обновлена",
        "old_publication_title": old_publication[0].title,
        "old_publication_text": old_publication[0].text,
        "old_publication_image": old_publication[0].upload_file,
        "title": publication_title,
        "text": publication_text,
        "image": publication_image,
        "publication_id": publication_id
    })


})



router.post("/like", async (req, res) => {
    console.log("/like")
    const { like_it } = req.body
    const user_id = req.session.user_id

    const isPublicationExists = await database.checkIsPublicationExists(like_it);
    if(!isPublicationExists){
        res.status(200).json({
            "status":"error",
            "message":"Публикация не существует",
        })
        return
    }
    const publication = await database.getPublication(like_it)

    const isPublicationLikedBy = await database.checkIsPublicationLikedBy(like_it, user_id)
    if(isPublicationLikedBy){
        res.status(200).json({
            "status":"error",
            "message":"Эта публикация уже лайкнута",
            "publication_title":publication[0].title
        })
        return
    }

    await database.addLike(like_it, user_id)
    const likes = await database.getLikes(like_it)
    res.status(200).json({
        "status":"success",
        "message":"Вы лайкнули публикацию",
        "publication_title":publication[0].title,
        "likes_counter":likes
    })

})





router.post("/unlike", async (req, res) => {
    console.log("/unlike")
    const { unlike_it } = req.body
    const user_id = req.session.user_id

    const isPublicationExists = await database.checkIsPublicationExists(unlike_it);
    if(!isPublicationExists){
        res.status(200).json({
            "status":"error",
            "message":"Публикация не существует",
        })
        return
    }
    const publication = await database.getPublication(unlike_it)

    const isPublicationLikedBy = await database.checkIsPublicationLikedBy(unlike_it, user_id)
    if(!isPublicationLikedBy){
        res.status(200).json({
            "status":"error",
            "message":"Эта публикация еще не лайкнута",
            "publication_title":publication[0].title
        })
        return
    }

    await database.deleteLike(unlike_it, user_id)
    const likes = await database.getLikes(unlike_it)
    res.status(200).json({
        "status":"success",
        "message":"Вы сняли лайк",
        "publication_title":publication[0].title,
        "likes_counter":likes
    })
})




module.exports = router