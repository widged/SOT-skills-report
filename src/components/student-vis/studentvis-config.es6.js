/* jshint esnext: true */

import React from 'react';
let {Component} = React;

export default class StudentChart {

    static getFieldColor(value) {
        var colors = {
          'HSc/Sc'    : '#5B9CE5',
          'Com'       : '#FF6A00',
          'Com/BSc'   : '#FF2C00',
          'Com/Sc'    : '#B63300',
          'A'         : '#6CD681',
          'A/Sc'      : '#26C66F', 
          'Mus'       : '#13B5B7', 
          'Des'       : '#489400',    
          'Des/A'     : '#1A6300',    
          'Des/Com'   : '#94AB3E',  // not obvious how to present overlap
          'IT'        : '#6B7C7D',
          'Tech'      : '#D4815D',
          'CompSc'    : '#B5A77F',
          'CompSc/Des': '#E0D3AB',
          'Eng'       : '#908CD1',
          'Eng/Com'   : '#774E94',
          'Eng/Sc'    : '#460078', // not obvious how to present overlap
          'Sc'        : '#9AEBFC',
          'Sc/Com'    : '#44B8E1',
          'Sc/Law'    : '#3178AE',
          'MathSc'    : '#163456'
        };
        return colors[value] || colors.default;
    }

    static getLevelColor(value) {
        var colors = {
          'Dip'    : '#C4DEFF',
          'GDip'   : '#5B9CE5',
          'B'      : '#EFAAF7',
          'B(Hons)': '#CC8A98',
          'PGDip'  : '#26B0F8',
          'M'      : '#189B7F',
          'PhD'    : '#CC4AE2',
          default  : '#4F4F4F'
        };
        return colors[value] || colors.default;
    }

static getYearColor(value) {
        var colors = {
          '5'     : '#563A5E',
          '4'     : '#883F7F',
          '3'     : '#A6639E',
          '2'     : '#95C7BA',
          '1'     : '#536273',
          default : '#4F4F4F'
        };
        return colors[value] || colors.default;
    }    

    static getFinalColor(value) {
        var colors = {
          'FALSE'  : '#B63300',
          'TRUE'   : '#6FACA2',
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
            "level": StudentChart.getLevelColor,
            "field": StudentChart.getFieldColor,
            "study_year": StudentChart.getYearColor,
            "final_year": StudentChart.getFinalColor,
            default: StudentChart.getDefaultColor(distinctValues)
        };
        return colorFns[type] || colorFns.default;
    }

    static keyFilterFn({key, type, title}) { 
        return key.match(/^(level|field|study_year|final_year)$/); 
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
        var SelectBy = require('../select-group/SelectBy.es6.js');
        var FilterList = require('../filter-list/FilterList.es6.js');

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
            React.createElement( SelectBy,  {lookups, title: 'Color by: ', onChange: function(d) { chart.colorBy(d, whenColorValues); }}),
            document.getElementById('color-by')
        );

        React.render(
            React.createElement( SelectBy,  {lookups, title: 'Group by: ', onChange: function(d) { chart.groupBy(d); }}),
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
          var {title} = {title: key} || {};
          if(title && key !== 'user_id') {
             list.push({title, value});
          } 
        }
        return {title: obj['user_id'], list: list};
    }

}
StudentChart.circleStyle = {defaultStrokeColor: '#404040', selectedStrokeColor: "#DF1E21", fillColor: '#cfcfcf', radius: 7};
