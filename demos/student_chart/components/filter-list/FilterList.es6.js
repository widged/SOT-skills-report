/* jshint esnext: true */

import React from 'react';
let {Component} = React;

export default class CheckList extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let {key, title, list} = this.props;
        return (
            <div data-target={{key}}>
            <h3>{{title}}</h3>
            {(list || []).map((d) => {
                return ( 
                    <div><input type="checkbox" checked="checked" value={d}/> {d}</div> 
                );
            })}
            </div>
        );
    }
}

export default class FilterList extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let {groups} = this.props;
        return (
            <div>
            <div id='clear_filters'><a href='#'>(clear)</a></div>
            <h2>Filters:</h2>
            <div>
            {groups.map(({key, title, uniqueValues}) => {
                return ( <CheckList key={key} title={title} list={uniqueValues} />);
            })}
            </div>

            </div>
        );
    }
}

/*

function GetDiscreteFilters () {
    var filters = [];
    $('.filter_block').each(function (index, element) {
        var target = $(this).attr('data-target');
        var removeValues = {};
        $(this).find('input:not(:checked)').each(function (innerIndex, innerElement) {
            removeValues[$(this).val()] = true;
        });
        var toAdd = {
            target: target,
            removeValues: removeValues
        };
        filters.push(toAdd);
    });
    return filters;
};
function ResetFilters () {
    var filters = {
        discrete: GetDiscreteFilters(),
        numeric: [] // numeric not done yet!
    };
    dispatchChange(filters)
};
*/