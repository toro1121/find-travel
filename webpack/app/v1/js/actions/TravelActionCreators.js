import assign from "object-assign";
// constants
import AppConstants from "../constants/AppConstants";
// action
import AppActionCreators from "./AppActionCreators";

export default class extends AppActionCreators {
    findTravel(data) {
        this.ajax({
            url: "/test",
            data: data,
        }, AppConstants.TRAVEL_DATA_ALL);
    }
};
