import { EventEmitter } from "events";
import assign from "object-assign";
import { sort, filter } from "react-data-components/lib/utils";
// constants
import AppConstants from "../constants/AppConstants";
// dispatcher
import AppDispatcher from "../dispatcher/AppDispatcher";
// store
import { AppStore } from "./AppStore";
//custom
// import _CONFIG from "../../../../config";
import _COMMON from "../common";

_COMMON.storageInit("travel");
let o = _COMMON.storageLoad("travel") ? _COMMON.storageLoad("travel") : {
// let o = {
    bool: null,
    message: null,
    data: {
        all: [],
        filter: [],
        page: [],
        one: [],
        checkbox: []
    },
    config: {
        keys: ["id"],
        sortBy: {
            prop: "price",
            order: "ascending"
        },
        pageNum: 100,
        currentPage: 0,
        totalPages: 0,
        filterValue: {}
    }
};
o.config.filter = {
    search: {
        filter: (a, b) => {
            a = (a + "").toLowerCase().trim();
            b = (b + "").toLowerCase().trim();
            return b.indexOf(a) >= 0;
        }
    }
}

class TravelStore extends AppStore {
    getData(arg1, arg2) {
        let v;
        switch (arg1) {
            case "list":
                v = {
                    config: o.config,
                    data: o.data
                };
                break;
            case "select":
                v = o.data.all;
                break;
            default:
                v = {
                    bool: o.bool,
                    message: o.message,
                    data: o.data.one
                };
                if (arg2) {
                    v.bool = null;
                    v.message = null;
                }
        }
        return v;
    }
    getDataById(id) {
        if (!o.data.one.length || o.data.one[0].id != id) {
            o.data.one = [];
            for (var i = 0; i < o.data.all.length; i++) {
                if (o.data.all[i].id == id) {
                    o.data.one.push(o.data.all[i]);
                    break;
                }
            }
        }
        return o.data.one;
    }
}

let Store = new TravelStore();

AppDispatcher.register((payload) => {
    let action = payload.action;
    switch (action.actionType) {
        case AppConstants.TRAVEL_DATA_ALL:
            o.data.all = action.res.data;
            o.data.filter = sort(o.config.sortBy, o.data.all);
            for (var i in o.config.filterValue);
            if (i) {
                o.data.filter = filter(o.config.filter, o.config.filterValue, o.data.all);
            }

            //
            if (action.res.tagId) {
                let tmp = [];
                for (var i in o.data.filter) {
                    for (let j in o.data.filter[i].industry) {
                        if (o.data.filter[i].industry[j].id == action.res.tagId) {
                            tmp.push(o.data.filter[i]);
                            break;
                        }
                    }
                }
                o.data.filter = tmp;
            }

            if (o.data.checkbox.length) {
                let checkbox = [];
                for (var i = 0; i < o.data.all.length; i++) {
                    for (let j = 0; j < o.data.checkbox.length; j++) {
                        if (o.data.all[i].id == o.data.checkbox[j]) {
                            o.data.all[i].checked = true;
                            checkbox.push(o.data.all[i].id);
                            break;
                        }
                    }
                }
                if (checkbox.length) {
                    checkbox.sort();
                }
                o.data.checkbox = checkbox;
            }
            break;
        case AppConstants.TRAVEL_DATA_ONE:
            o.data.one = action.res.data;
            break;
        case AppConstants.TRAVEL_DATA_SORT:
            o.config.sortBy = action.sortBy;
            o.data.filter = sort(o.config.sortBy, o.data.filter);
            break;
        case AppConstants.TRAVEL_DATA_PAGE:
            o.config.currentPage = action.currentPage;
            break;
        case AppConstants.TRAVEL_DATA_FILTER:
            o.config.filterValue[action.name] = action.value;
            o.data.filter = filter(o.config.filter, o.config.filterValue, o.data.all);
            o.config.currentPage = 0;
            break;
        case AppConstants.TRAVEL_ADD:
        case AppConstants.TRAVEL_EDIT:
            o.bool = action.res.bool;
            o.message = action.res.message;
            if (action.res.data) {
                o.data.one = action.res.data;
            }
            break;
        case AppConstants.TRAVEL_CHECKBOX:
            if (action.id == "all") {
                for (var i = 0; i < o.data.all.length; i++) {
                    for (let j = 0; j < o.data.page.length; j++) {
                        if (o.data.all[i].id == o.data.page[j].id) {
                            if (action.className) {
                                o.data.all[i].checked = false;
                                o.data.checkbox.splice(o.data.checkbox.indexOf(o.data.all[i].id), 1);
                            } else {
                                o.data.all[i].checked = true;
                                o.data.checkbox.push(o.data.all[i].id);
                                o.data.checkbox.sort();
                            }
                            break;
                        }
                    }
                }
            } else {
                let id = parseInt(action.id);
                let index = o.data.checkbox.indexOf(id);
                if (index < 0) {
                    o.data.checkbox.push(id);
                    o.data.checkbox.sort();
                } else {
                    o.data.checkbox.splice(index, 1);
                }
                for (var i = 0; i < o.data.all.length; i++) {
                    if (o.data.all[i].id == id) {
                        o.data.all[i].checked = o.data.all[i].checked ? false : true;
                        break;
                    }
                }
            }
            break;
        default:
    }

    if (!action.actionType.match(/ONE|ADD|EDIT/)) {
        o.data.page = o.data.filter.slice(o.config.pageNum * o.config.currentPage, o.config.pageNum * o.config.currentPage + o.config.pageNum);
        o.config.totalPages = Math.ceil(o.data.filter.length / o.config.pageNum);
    }
    if (action.actionType.match(/TRAVEL/)) {
        _COMMON.storageSave("travel", o);
        Store.emitChange();
    }

    return true;
});

export default Store;
