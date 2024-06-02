const SECRET = "koto2";
const path = require("path");
const express = require("express");
const session = require("express-session");
const bodyParser = require('body-parser');

const database = require("./src/services/database.js")
const isAuthenticated = require("./src/services/isAuthenticated");
const loginRouter = require("./src/routes/login_route.js");
const subsRouter = require("./src/routes/subs_route.js");
const profileRouter = require("./src/routes/profile_route.js");
const publicationsRouter = require("./src/routes/publications_route.js");
const createRoute = require("./src/routes/create_route.js")
const feedbackRouter = require("./src/routes/feedback_route.js")

const app = express();
const PORT = 3000;

app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'ejs');

app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());




app.use(
    session({
        secret: SECRET,
        resave: false,
        saveUninitialized: true,
    })
);

app.use("/faq", (req, res) => {
    res.render("./faq/faq.ejs")
})

app.use("/login", (req, res)=>{
    res.render("./login/login.ejs");
});

app.use("/user", loginRouter); 

app.use("/feedback", feedbackRouter);

app.use(isAuthenticated);

app.use("/subscriptions", subsRouter);

app.use("/profile", profileRouter);

app.use("/create", createRoute);

app.use("/publications", publicationsRouter);












app.use((req, res) => {
    res.status(404).render("page404/page.ejs");
});
  
app.listen(PORT, console.log(`Сервер запущен на порту ${PORT}`));






