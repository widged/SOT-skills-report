import React from 'react';
import {Inject} from '../../Modules';

let {Component} = React;

export default class CustomTooltip extends Component {
    constructor(props) {
        super(props);
        this.state = {visible: false};
        
    }
    render() {
    	let {list, xy, title, visible} = this.state;
    	let {cx, cy} = xy || {x: 0, y: 0};
        return (
        	<item-tooltip className={visible ? '' : 'hidden'} style={{left: cx + 20 , top: cy + 10 }}>
	            <h3>{title}</h3>
                <ul>
	            {(list || []).map(({title, value}) => {
	            	return (
	            		<li><span className="name">{title}:</span><span className="value">{value}</span></li>
	            	);
	            })}
	            </ul>
            </item-tooltip>
        );
    }
}
