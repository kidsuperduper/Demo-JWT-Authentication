const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

let refreshTokens = [];

const userController = {
    register: async (req, res) => {
        try {
            const { email, password, admin } = req.body;

            if (!email || !password) {
                return res.status(400).json("Email or password is empty");
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPwd = await bcrypt.hash(password, salt);

            const emailExist = await User.findOne({ email });
            if (emailExist) {
                return res.status(400).json(`Email ${email} already exists`);
            }

            const user = await User.create({
                email,
                password: hashedPwd,
                admin,
            });
            res.status(200).json(user);
        } catch (err) {
            res.status(500).json({ err });
        }
    },

    generateAccessToken: (user) => {
        return jwt.sign(
            {
                id: user.id,
                admin: user.admin,
            },
            process.env.JWT_ACCESS_KEY,
            { expiresIn: "20s" }
        );
    },

    generateRefreshToken: (user) => {
        return jwt.sign(
            {
                id: user.id,
                admin: user.admin,
            },
            process.env.JWT_REFRESH_KEY,
            { expiresIn: "30d" }
        );
    },

    login: async (req, res) => {
        try {
            const user = await User.findOne({ email: req.body.email });

            if (!user) {
                return res
                    .status(404)
                    .json(`Email ${req.body.email} does not exist`);
            }

            const validPassword = await bcrypt.compare(
                req.body.password,
                user.password
            );

            if (!validPassword) {
                return res.status(404).json(`Password wrong`);
            }

            if ((user, validPassword)) {
                const accessToken = userController.generateAccessToken(user);
                const refreshToken = userController.generateRefreshToken(user);

                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: "/",
                    sameSite: "strict",
                });

                refreshTokens.push(refreshToken);

                const { password, ...others } = user._doc;
                res.status(200).json({ ...others, accessToken });
            }
        } catch (err) {
            res.status(500).json({ err });
        }
    },

    getAllUsers: async (req, res) => {
        try {
            const users = await User.find();
            res.status(200).json(users);
        } catch (err) {
            res.status(500).json({ err });
        }
    },

    deleteUser: async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                return res
                    .status(404)
                    .json(`Not found user with id: ${req.params.id}`);
            }
            res.status(200).json("Delete successfully");
        } catch (err) {
            res.status(500).json(err);
        }
    },

    requestRefeshToken: async (req, res) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken)
                return res.status(403).json("You are not authenticated");

            if (!refreshTokens.includes(refreshToken))
                return res.status(403).json("Refresh token is not valid");

            jwt.verify(
                refreshToken,
                process.env.JWT_REFRESH_KEY,
                (err, user) => {
                    if (err) {
                        return res.status(403).json("Token is not valid");
                    }

                    refreshTokens = refreshTokens.filter(
                        (token) => token !== refreshToken
                    );

                    const newAccessToken =
                        userController.generateAccessToken(user);
                    const newRefeshToken =
                        userController.generateRefreshToken(user);

                    res.cookie("refreshToken", newRefeshToken, {
                        httpOnly: true,
                        secure: false,
                        path: "/",
                        sameSite: "strict",
                    });

                    refreshTokens.push(newRefeshToken);

                    res.status(200).json({ accessToken: newAccessToken });
                }
            );
        } catch (err) {
            res.status(500).json({ err });
        }
    },

    logout: async (req, res) => {
        try {
            res.clearCookie("refreshToken");
            refreshTokens = refreshTokens.filter(
                (token) => token !== req.cookies.refreshToken
            );
            res.status(200).json("Logged out successfully");
        } catch (err) {
            res.status(500).json({ err });
        }
    },
};

module.exports = userController;
