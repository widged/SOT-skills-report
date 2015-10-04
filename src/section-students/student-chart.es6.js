/* jshint esnext: true */

import {Inject} from './imports';

import React from 'react';
let {Component} = React;

export default class StudentVis extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
          <div className="page">
            <div id="visualisation">
                <div id="vis-controls">
                    <div id='color-by'></div>
                    <div id='group-by'></div>
                    <div id='filters'></div>
                </div>
                <div id="vis-display">
                    <div id='vis'></div>
                    <div id='itemTooltip'></div>            
                </div>
                <div id="vis-legend"></div>
            </div>
        </div> 
        );
    }

    renderD3(tsv) {
        function getLookupKeys(tsv, keyToLookup, keyFilterFn, keySortFn) {
            // columns that we are interested in
            var keys = Object.keys(tsv[0])
                .map((k) => {
                    let {key, type, title} = keyToLookup(k);
                    let column = {key, type, title};
                    return column;
                })
                .filter(keyFilterFn);

            // add list of unique values to each column
            for (var r = 0, nr = tsv.length; r < nr; r++) {
                let item = tsv[r];
                keys.forEach((k) => {
                    if(!k.uniqueValues) { k.uniqueValues = [];}
                    let set = k.uniqueValues;
                    let value = item[k.key];
                    if(set.indexOf(value) === -1) { 
                        set.push(value); 
                    }
                });
            }
            let keyMap = {};
            keys.forEach((k) => {
                k.uniqueValues.sort(keySortFn(k));
                keyMap[k.key] = k;
            });
            return {keys: keys, keyMap: keyMap};
        }

        // -- Loading the chart config
        let StudentChart = require('./sotChart.es6.js');

        // -- Getting the Lookup keys
        let {keys, keyMap} = getLookupKeys(
            tsv,
            StudentChart.keyToLookup,
            StudentChart.keyFilterFn,
            StudentChart.keySortFn
        );
        let {lookups, lookupMap} = {lookups: keys, lookupMap: keyMap};

        // -- Mounting the visualisation add-ons
        var ItemTooltip = require('../components/item-tooltip/ItemTooltip.es6.js');
        var ColorLegend = require('../components/color-legend/ColorLegend.es6.js');

        let tooltip =  React.render(
            React.createElement(ItemTooltip, {title: "my_tooltip", width: 240}), 
            document.getElementById('itemTooltip')
        );

        let colorLegend  = React.render(
            React.createElement(ColorLegend), 
            document.getElementById('vis-legend')
        );
        
        // -- Mounting the visualisation
        var BubbleChart = require('../components/bubble-clusters-chart/BubbleClustersChart.es6.js');
        let chart = new BubbleChart();
        StudentChart.addControls({lookups, lookupMap, chart, colorLegend});
        chart.mountIn(document.getElementById("vis"))
            .onItemSelection(function(item, xy) {
                let {title, list} = StudentChart.itemDump(item, lookupMap) || {title: null, list: null};
                tooltip.setState({visible: list && list.length, xy, title, list});
            })
            .keySortFn(StudentChart.keySortFn)
            .circleStyle(StudentChart.circleStyle)
            .plot(tsv)
            .groupBy(); 


        return chart;
    }

    componentDidMount() {
        let filteredStudents = this.props.filterStudents;
        var tsv = this.props.list;
        var chart = this.renderD3(tsv);
        this.setState({chart: chart});
        // This needs to be delayed. 
        // Student filtering will cancel out any current animation.
        window.setTimeout(function() {
           chart.filterStudents(filteredStudents); 
       }, 2000);
    }

    shouldComponentUpdate( nextProps, nextState) {
        if(nextProps.hasOwnProperty('filterStudents')) {
            if(this.state.chart) {
                this.state.chart.filterStudents(nextProps.filterStudents)
            }
        }
        return false;
    }


}
