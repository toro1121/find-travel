import React from "react";

export default class extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let option = this.props.option;
        let isArray = Array.isArray(option);

        let options = [];
        if (isArray) {
            options = option.map((value, key) => {
                return (<option key={key}>{value}</option>);
            });
        } else {
            for (var key in option) {
                options.push(
                    <optgroup label={key} key={key}>
                    { option[key].map((v, k) => {
                        return ( <option key={k}>{v}</option> );
                    }) }
                    </optgroup>
                );
            }
        }

        return (
            <div className="form-group">
                <label>{ this.props.label }</label>
                <select className="form-control">
                    <option value="0">- 請選擇 -</option>
                    {options}
                </select>
            </div>
        );
    }
}
