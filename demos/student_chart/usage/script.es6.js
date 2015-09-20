/* jshint esnext: true */

import {Inject} from '../Modules';

import React from 'react';
let {Component} = React;

var html = `
<script type="text/javascript" src="../vendor/d3.v3.min.js"></script>
<div class="page">
    <h1>Summer of Tech Students</h1>
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
`;

document.getElementById('app').innerHTML = html;

Inject.css({file: '../css/style.css', parent: module});
Inject.js([
	'../vendor/d3/d3.v3.min.js'
], function() {
   //  d3.csv("data/sciencedata.csv", drawChart);
   d3.tsv("data/sot.tsv", drawChart);

});

function drawChart(csv) {

    function getLookupKeys(csv, keyToLookup, keyFilterFn, keySortFn) {
        // columns that we are interested in
        var keys = Object.keys(csv[0])
            .map((k) => {
                let {key, type, title} = keyToLookup(k);
                let column = {key, type, title};
                return column;
            })
            .filter(keyFilterFn);

        // add list of unique values to each column
        for (var r = 0, nr = csv.length; r < nr; r++) {
            let item = csv[r];
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
        csv,
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
        .plot(csv)
        .group_by();

}    
