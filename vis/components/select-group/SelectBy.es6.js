/* jshint esnext: true */

import React from 'react';
let {Component} = React;

export default class SelectBy extends Component {
    constructor(props) {
        super(props);
        let {onChange} = props;
        var optionChange = function(event) {
            onChange(event.target.value);
        }
        this.state = {optionChange: optionChange};
    }

    render() {
        var {lookups, title} = this.props;
        var {optionChange} = this.state;
        return (
            <select-group>
                <span className="title">{title}</span>
                <select onChange={optionChange}>
                    <option value=''></option>
                    {lookups.map(({key, title}) => { return (
                        <option value={key}>{title}</option>
                    ); })}
                </select>
            </select-group>
        );
    }
}