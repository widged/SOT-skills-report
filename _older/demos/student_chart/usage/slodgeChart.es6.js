/* jshint esnext: true */

import React from 'react';
let {Component} = React;

export default class StudentChart {

    static getAchievementColor(value) {
        let color = '#FF00CC';
        if (value <= -2) {
          color = '#ff0000';
        } else if (value <= -1) {
          color = '#ff9900';
        } else if (value <= 0) {
          color = '#ffff00';
        } else if (value < 2) {
          color = '#00FF00';
        }
        return color;
    }

    static getGradeColor(value) {
        var colors = {
          '*': '#FF00CC',
          'Z': '#FF00CC',
          "A": '#00FF00',
          "B": '#00FF00',
          "C": '#FFFF00',
          "D": '#FF0000',
          "E": '#FF0000',
          "F": '#FF0000',
          "G": '#FF0000',
          "U": '#7F0000',
          default: '#4F4F4F',
        };
        return colors[value] || colors.default;
    }

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
            "Achievement": StudentChart.getAchievementColor,
            "Grade": StudentChart.getGradeColor,
            default: StudentChart.getDefaultColor(distinctValues)
        };
        return colorFns[type] || colorFns.default;
    }

    static keyFilterFn({key, type, title}) { 
        return key.match(/^(Lookup|Grade|Achievement)/); 
    }

    static keySortFn({key, type, title}) { 
        function sortNumericAsc(a, b) { return Number(a) - Number(b); }
        return (key === 'Achievement:Achievement') ? sortNumericAsc : undefined; 
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
            let {type, title} = lookupMap[keyName] || {title: ''};
            let {fillColor} = StudentChart.circleStyle;
            let colorFn = type ? StudentChart.getColorFn(type, distinctValues) : function(d) { return fillColor; };
            function colorFormat(d, i) { return {name: d, color: colorFn(d)}; }
            colorLegend.setState({title: title, colorList: type ? distinctValues.map(colorFormat) : null});
            return colorFn;
        }

        React.render(
            React.createElement( SelectBy,  {lookups, title: 'Color Students by:', onChange: function(d) { chart.color_by(d, whenColorValues); }}),
            document.getElementById('color-by')
        );

        React.render(
            React.createElement( SelectBy,  {lookups, title: 'Group Students by:', onChange: function(d) { chart.group_by(d); }}),
            document.getElementById('group-by')
        );

        React.render(
            React.createElement(FilterList, {groups: lookups, onChange: function(d) { chart.use_filters(d); }}),
            document.getElementById('filters')
        );        
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
        return {title: obj['Title:Name'], list: list};
    }

}
StudentChart.circleStyle = {defaultStrokeColor: '#404040', selectedStrokeColor: "red", fillColor: '#cfcfcf', radius: 5};
