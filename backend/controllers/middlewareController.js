const jwt = require("jsonwebtoken");

const middlewareController = {
    verifyToken: function (req, res, next) {
        let token = req.headers.token;
        if (token) {
            let accessToken = token.split(" ")[1];
            jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
                if (err) {
                    return res.status(403).json("Token is not valid");
                }
                req.user = user;
                next();
            });
        } else {
            return res.status(401).json("You are not allowed to access this");
        }
    },

    verifyToken_delete: function (req, res, next) {
        middlewareController.verifyToken(req, res, () => {
            if (req.user.id == req.params.id || req.user.admin) {
                next();
            } else {
                return res
                    .status(401)
                    .json("You are not allowed to delete other");
            }
        });
    },
};

module.exports = middlewareController;
