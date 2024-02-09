function checkedLoggedIn(req, res, next) {
    const isLoggedIn = req.isAuthenticated() && req.user;
    if (!isLoggedIn) {
        // return res.redirect('http://localhost:3000/failer');
        return res.redirect('https://x-fit-backend-graduation-project.vercel.app/failer');
    }
    next();
}

module.exports = checkedLoggedIn;