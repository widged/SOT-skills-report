/* jshint esnext: true */

import React             from 'react';

let {Component} = React;

export default class ExperienceLevelSelect extends Component {
  checkboxRenderer({name, checked}) {
    return (
      <item>
        <input type="checkbox" className="checkbox-control" defaultChecked={checked} />
        <span className="checkbox-label">{name}</span>
      </item>
    );
  }
  render () {
    var {levels} = this.props;
    var checkboxRenderer = this.checkboxRenderer;
    return (
      <div className="section">
        <label className="checkbox">
        {levels.map(checkboxRenderer)}
        </label>
      </div>
    );
  }
}

// defaultChecked
/*
              <div>
              </div>

*/