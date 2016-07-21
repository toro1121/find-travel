import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";
// import favicon from "serve-favicon";
import logger from "morgan";
import orm from "orm";
import path from "path";
import util from "util";

import config from "./config";
import Model from "./app/model";

let app = express();
app.set("port", config.base.port);
// view engine setup
// app.set("views", path.join(__dirname, "app/views"));
// app.set("view engine", "jade");
// app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

let db = config.base.db.default;
app.use(orm.express(util.format("mysql://%s:%s@%s/%s", db.user, db.password, db.host, db.database), {
    define: (db, models, next) => {
        models.User = Model.user(db);
        next();
    }
}));

app.use("/", config.routes);

app.use((err, req, res, next) => {
    console.log(err);
    // let err = new Error("Not Found");
    // err.status = 404;
    // next(err);
    next();
});
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    // res.render("error", {
    //     message: err.message,
    //     error: {}
    // });
    return next();
});

// server
var debug = require("debug")("lowest-price:server");
var http = require("http");

let server = http
    .createServer(app)
    .listen(config.base.port, config.base.host, (err, res) => {
        if (err) {
            console.log(err);
        }
        console.log("Listening as " + util.format("http://%s:%d", config.base.host, config.base.port));
    })
    .on("error", (error) => {
        if (error.syscall !== "listen") {
            throw error;
        }

        let bind = typeof config.base.port === "string" ? "Pipe " + port : "Port " + config.base.port;
        // handle specific listen errors with friendly messages
        switch (error.code) {
            case "EACCES":
                console.error(bind + " requires elevated privileges");
                process.exit(1);
                break;
            case "EADDRINUSE":
                console.error(bind + " is already in use");
                process.exit(1);
                break;
            default:
                throw error;
        }
    })
    .on("listening", () => {
        var addr = server.address();
        var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
        debug("Listening on " + bind);
    });
