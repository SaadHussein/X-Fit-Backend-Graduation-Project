function checkedLoggedIn(req, res, next) {
    const isLoggedIn = req.isAuthenticated() && req.user;
    if (!isLoggedIn) {
        return res.redirect('http://localhost:3000/failer');
    }
    next();
}

module.exports = checkedLoggedIn;