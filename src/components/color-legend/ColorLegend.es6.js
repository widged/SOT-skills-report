/* jshint esnext: true */

import React from 'react';
let {Component} = React;

export default class ColorLegend extends Component {
    constructor(props) {
        super(props);
        this.state = {title: '', colorList: []};
    }
    render() {
        let {title, colorList} = this.state;
        if(!colorList) { 
            return (<div></div>); 
        } else {
            return (
                <color-legend>
                    <h3>{title}</h3>
                    <ul>
                    {(colorList || []).map(({name, color}) => {return (
                        <li><span className="square" style={{background:color}}></span> {name}</li>
                    )})}
                    </ul>
                </color-legend>
            );
        }
    }
}