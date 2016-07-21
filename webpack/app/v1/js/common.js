import ReactDOM from "react-dom";
//dispatcher
import AppDispatcher from "./dispatcher/AppDispatcher";

class common {
    stateMerge(e) {
        let field = $(e.target).attr("id");
        let merge = {};
        merge[field] = e.target.value;
        return merge;
    }
    getInputData(data) {
        let tmp = {};
        for (var key in data) {
            let x = data[key].tagName ? data[key] : ReactDOM.findDOMNode(data[key]);
            let len = $(x).find("input, select").length;

            if (len > 1) {
                tmp[key] = [];
                $(x).find("input, select").each((i, e) => {
                    tmp[key].push(e.type.match(/checkbox/) ? e.checked : e.value.trim());
                });
            } else {
                x = x.tagName.match(/INPUT|SELECT|TEXTAREA/) ? x : $(x).find("input, select")[0];
                if (x.tagName.match(/INPUT|SELECT|TEXTAREA/)) {
                    tmp[key] = x.type.match(/checkbox/) ? x.checked : x.value.trim();
                }
            }
        }
        return tmp;
    }
    storageInit(type) {
        // FIXME: 更新時需要清理sessionStorage
        if (!window.sessionStorage[type]) {
            window.sessionStorage.setItem(type, JSON.stringify({}));
        }
    }
    storageLoad(type) {
        for (var i in JSON.parse(window.sessionStorage[type]));
        return i ? JSON.parse(window.sessionStorage[type]) : false;
    }
    storageSave(type, data) {
        window.sessionStorage.setItem(type, JSON.stringify(data));
    }
}

export default new common();
