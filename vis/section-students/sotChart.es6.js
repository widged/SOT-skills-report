/* jshint esnext: true */

import React from 'react';
let {Component} = React;

export default class StudentChart {

    static getFieldColor(value) {
/*
        var colors = {
          'HSc/Sc'    : 'SomeColorCloseToBlue',
          'Com'       : 'red1',
          'Com/BSc'   : 'red2',
          'Com/Sc'    : 'red3',
          'A'         : 'somewhatGreen1',
          'A/Sc'      : 'somewhatGreen2', 
          'Mus'       : 'greenishButDifferent' 
          'Des'       : 'typicallyGreen1'    
          'Des/A'     : 'typicallyGreen2'    
          'Des/Com'   : 'green/Red'  // not obvious how to present overlap
          'IT'        : 'darkGray1'
          'Tech'      : 'darkGray2'
          'CompSc'    : 'darkGray3'
          'CompSc/Des': 'darkGray4'
          'Eng'       : 'Blue1'
          'Eng/Com'   : 'Blue/Red'
          'Eng/Sc'    : 'Blue/Purple' // not obvious how to present overlap
          'Sc'        : 'Purple'
          'Sc/Com'    : 'Purple'
          'Sc/Law'    : 'Purple'
          'MathSc'    : 'SomeColorCloseToBlue'
        };
        return colors[value] || colors.default;
        */
    }

    static getLevelColor(value) {
        var colors = {
          'Dip'    : '#FF00CC',
          'GDip'   : '#FF00CC',
          "B"      : '#00FF00',
          "B(Hons)": '#00FF00',
          "PGDip"  : '#FFFF00',
          "M"      : '#FF0000',
          "PhD"    : '#FF0000',
          default  : '#4F4F4F'
        };
        return colors[value] || colors.default;
    }

    // Area. Black - code, green - design, blue - engineering, yellow - BA, red - Ops

    static getDefaultColor(valueList) {
        let colors = ["#0000D9", "#FF00FF", "#FF0033", "#FFCC66", "#66CC33", "#33FFCC", "#00A0AA", "#FFCCFF", "#FF9933", "#99FF99", "#00BB00", "#CCFFCC", "#333333", "#CCCCCC", "#99CCCC", "#FF0000"];
        var colorMap = {};
        (valueList || []).forEach((d, i) => {
          colorMap[d] = colors[i % colors.length];
        });
        return function(value) {
          return colorMap[value];
        };
    }

    static getColorFn(type, distinctValues) {
        var colorFns = {
            // "level": StudentChart.getLevelColor,
            // "field": StudentChart.getFieldColor,
            default: StudentChart.getDefaultColor(distinctValues)
        };
        return colorFns[type] || colorFns.default;
    }

    static keyFilterFn({key, type, title}) { 
        return key.match(/^(school|level|field|degree|study_year|final_year)/); 
    }

    static keySortFn(keyName) { 
        function sortNumericAsc(a, b) { return Number(a) - Number(b); }
        function sortLevel(a, b) { 
          var order = "Dip,GDip,B,B(Hons),PGDip,M,PhD,N/A".split(',');
          return order.indexOf(a) - order.indexOf(b); 
        }
        function sortField(a, b) {
          var order = "Com,Com/BSc,Com/Sc,A,A/Sc,Mus,Des,Des/A,Des/Com,IT,Tech,CompSc,CompSc/Des,Eng,Eng/Com,Eng/Sc,Sc,Sc/HSc,Sc/Com,Sc/Law,MathSc".split(',');
          return order.indexOf(a) - order.indexOf(b); 
        }
        var map = {level: sortLevel, field: sortField};
        return map[keyName]; 
    }

    static keyToLookup(keyName) {
        var p = (keyName || '').split(':');
        if(p.length === 1) { p[1] = keyName; }
        return { key: keyName, type: p[0], title: p[1] };
    }


    static addControls({lookups, lookupMap, chart, colorLegend}) {
        var SelectBy = require('../components/select-group/SelectBy.es6.js');
        var FilterList = require('../components/filter-list/FilterList.es6.js');

        function whenColorValues(keyName, distinctValues) {

            let {key, type, title} = lookupMap[keyName] || {title: ''};
            let {fillColor} = StudentChart.circleStyle;
            let colorFn = type ? StudentChart.getColorFn(type, distinctValues) : function(d) { return fillColor; };
            function colorFormat(d, i) { return {name: d, color: colorFn(d)}; }
            distinctValues.sort(StudentChart.keySortFn(key));
            colorLegend.setState({title: title, colorList: type ? distinctValues.map(colorFormat) : null});
            return colorFn;
        }

        React.render(
            React.createElement( SelectBy,  {lookups, title: 'Color by: ', onChange: function(d) { chart.color_by(d, whenColorValues); }}),
            document.getElementById('color-by')
        );

        React.render(
            React.createElement( SelectBy,  {lookups, title: 'Group by: ', onChange: function(d) { chart.group_by(d); }}),
            document.getElementById('group-by')
        );

/*
        React.render(
            React.createElement(FilterList, {groups: lookups, onChange: function(d) { chart.use_filters(d); }}),
            document.getElementById('filters')
        );        
*/
    }    

    static itemDump(obj, lookupMap) {
        if(!obj) {return; }
        var list = [];
        for (var key in obj) {
          var value = obj[key];
          var {title} = lookupMap[key] || {};
          if(title) {
             list.push({title, value});
          } 
        }
        return {title: obj['user_id'], list: list};
    }

}
StudentChart.circleStyle = {defaultStrokeColor: '#404040', selectedStrokeColor: "#DF1E21", fillColor: '#cfcfcf', radius: 7};
