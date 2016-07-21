import React from "react";
import ReactDOM from "react-dom";
import {
    Router,
    Route,
    Redirect,
    IndexRoute,
    hashHistory
}
from "react-router";
// config
import _COMMON from "./common";
import _DATA from "../../../../config/data";
// action
import TravelActionCreators from "./actions/TravelActionCreators";
let TravelAction = new TravelActionCreators({ type1: "travel" });
// store
import TravelStore from "./stores/TravelStore";
// component
import Select from "./components/element/Select";
import { Table } from "./components/element/DataTable";
import Datepicker from "./components/element/Datepicker";
import Modal from "./components/element/Modal";
import Parallax from "./components/Parallax";
// vendor
import "bootstrap/dist/css/bootstrap.min";
import "font-awesome/css/font-awesome.min";

import "../sass/main.scss";

class App extends React.Component {
    constructor(props) {
        super(props);

        let o = TravelStore.getData("list");
        o.config.columns = [{
            title: "旅行社",
            prop: "company",
        }, {
            title: "出發日",
            prop: "date",
            render: (val, row) => (<div className="text-align-center">{row.date}</div>)
        }, {
            title: "名稱",
            prop: "name",
            render: (val, row) => (<a href={row.link} target="_blank">{row.name}</a>)
        }, {
            title: "天數",
            prop: "day",
            render: (val, row) => (<div className="text-align-center">{row.day}</div>)
        }, {
            title: "價錢",
            prop: "price",
            render: (val, row) => (<div className="color-red">{row.price}</div>)
        }];
        o.config.button = {
            control: ["add", "del"],
            table: []
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClick = this.handleClick.bind(this);

        this.state = o;
    }
    componentWillMount() {
        TravelStore.addChangeListener(this.handleChange);
    }
    componentWillUnmount() {
        TravelStore.removeChangeListener(this.handleChange);
    }
    render() {
        return (
            <div className="wrapper">
                <Modal />
                <div className="loading">
                    <div className="loading__img"></div>
                </div>
                <Parallax />
                <header>
                    <h1><span className="color-yellow">Go</span> Travel !</h1>
                </header>
                <div className="main">
                    <div className="form">
                        <form onSubmit={this.handleSubmit}>
                            <div className="row">
                                <div className="col-sm-12">
                                    <Select label="出發地點" option={_DATA.city} ref="city" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12">
                                    <Select label="旅遊地區" option={_DATA.area} ref="area" />
                                </div>
                            </div>
                            <div className="row">
                                <Datepicker ref="date" />
                            </div>
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="form-group">
                                        <button className="btn btn-lg btn-primary btn-block">點擊我，開始搜尋!</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="list">
                        <Table
                            state={this.state}
                            handleClick={this.handleClick}
                            handleSort={TravelAction.sort}
                            handleChangePage={TravelAction.page}
                            handleSearch={TravelAction.filter}
                        />
                    </div>
                </div>
                <footer>© 2016 Leo Lee. All Rights Reserved.</footer>
            </div>
        );
    }
    handleChange(e) {
        $(".loading").hide();
        this.setState(TravelStore.getData("list"));
    }
    handleSubmit(e) {
        e.preventDefault();

        let data = _COMMON.getInputData(this.refs);

        if (data.area == "0" || data.city == "0" || data.date[0] == "" || data.date[1] == "") {
            TravelAction.modal({
                display: true,
                message: "欄位未全部選擇。",
                button: ["ok"]
            });
        } else {
            $(".loading").show();
            TravelAction.findTravel(data);
        }
    }
    handleClick(e) {}
}

ReactDOM.render((
    <Router history={hashHistory}>
        <Route path="/" component={App}>
        </Route>
    </Router>
), $("#container")[0]);
