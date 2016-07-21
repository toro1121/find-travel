import React from "react";
// vendor
import "../../vendor/jquery.parallax.min";

export default class extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        $(() => {
            $(".parallax").parallax();
        });
    }
    render() {
        return (
        	<div className="parallax">
	            <div className="parallax__layer parallax__layer--1 layer" data-depth="0.10"></div>
	            <div className="parallax__layer parallax__layer--2 layer" data-depth="0.30"></div>
	            <div className="parallax__layer parallax__layer--3 layer" data-depth="0.50"></div>
	        </div>
    	);
    }
}
