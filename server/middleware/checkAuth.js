exports.isLoggedIn = function (req, res, next) {
    if (req.user) {
        next();
    } else {
        return res.status(401).render('404', { errHeading: 'Access Denied' });
    }
};
