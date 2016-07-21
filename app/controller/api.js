import assign from "object-assign";

export default class {
    index(req, res, next) {
        return res.send({
            version: "0.1.0"
        });
    }
    data(err, data, res) {
        res = res ? assign({}, {
            success: false,
            message: null,
            data: []
        }, res) : {
            success: false,
            message: null,
            data: []
        };

        if (!err) {
            res.success = true;
            res.data = data;
        }

        return res;
    }
}
