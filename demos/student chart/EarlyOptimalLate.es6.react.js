/* jshint esnext: true */

import React from 'react';
import {Inject} from './Modules';

console.log(Inject)

export default class EarlyOptimalLate extends React.Component {
    constructor() {
        super();
        Inject.css({file: '../style/early-optimal-late.css', parent: module});
    }

    render() {
        const {early, optimal, late} = this.props;
        return (
            <early-optimal-late>
                <li className="early">{early}</li> 
                <li className="optimal">{optimal}</li> 
                <li className="late">{late}</li> 
            </early-optimal-late>
        );
    }    
}