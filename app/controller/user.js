import jwt from "jsonwebtoken";
import orm from "orm";

import config from "../../config/base";
import ApiController from "./api";

export default class extends ApiController {
    constructor() {
        super();

        this.index = this.index.bind(this);
        this.view = this.view.bind(this);
        this.login = this.login.bind(this);
    }
    index(req, res, next) {
        req.models.User.find((err, data) => {
            res.json(this.data(err, data));
        });
    }
    view(req, res, next) {
        req.models.User.get(req.params.id, (err, data) => {
            res.json(this.data(err, [data]));
        });
    }
    create(req, res, next) {
        res.send("create");
    }
    update(req, res, next) {
        res.send("update");
    }
    delete(req, res, next) {
        res.send("delete");
    }
    login(req, res, next) {
        req.models.User.find({ username: req.body.username }, (err, data) => {
            let r = false;

            if (!data.length) {
                r = {
                    success: false,
                    message: "Authenticate failed. User not found."
                };
            } else {
                data = [{
                    token: jwt.sign(data[0], config.secret, {
                        expiresIn: 60 * 60 * 24
                    })
                }];
            }
            res.json(this.data(err, data, r));
        });
    }
}
