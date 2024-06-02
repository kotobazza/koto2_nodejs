function isAuthenticated(req, res, next) {
    if (req.session.user_id) {
        return next();
    } else {
        res.redirect('/login');
    }
}

module.exports = [isAuthenticated]