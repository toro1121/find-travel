import express from "express";
import jwt from "jsonwebtoken";
import path from "path";

import config from "../config/base";
import Controller from "../app/controller";

let routes = express.Router();

routes.all("/*", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-COntrol-Allow-Headers", "X-Requested-With");
    next();
});
routes.get("/", (req, res, next) => {
    res.sendFile(path.join(__dirname, "public/*.html"));
});

import Test from "../app/controller/test";
routes.get("/test", Test.index);

// api
routes.get("/api", Controller.api.index);
routes.all("/api/*", (req, res, next) => {
    if (req.url.match(/\/api\/user\/login/)) {
        return next();
    }

    // check token
    let headers = req.headers;
    let token = headers.authorization.split(" ")[1];

    if (token) {
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                return res.json({
                    success: false,
                    message: "Failed to authenticate token.",
                    data: []
                });
            } else {
                req.decoded = decoded;
                next()
            }
        })
    } else {
        return res.status(403).json({
            success: false,
            message: "No token provided.",
            data: []
        })
    }
});
routes.route("/api/user")
    .get(Controller.user.index)
    .post(Controller.user.create);
routes.route("/api/user/:id")
    .get(Controller.user.view)
    .put(Controller.user.update)
    .delete(Controller.user.delete);
routes.post("/api/user/login", Controller.user.login);

export default routes;
