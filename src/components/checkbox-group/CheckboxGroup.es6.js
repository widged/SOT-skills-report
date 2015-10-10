/* jshint esnext: true */

import React             from 'react';

let {Component} = React;

export default class CheckboxGroup extends Component {

 constructor (props) {
    super(props);
    this.state    = {value: undefined};
    this.handlers = {handleChange: this.handleChange.bind(this)};
  }

  handleChange (event) {
    let name = event.target.dataset.name;
    let value = event.target.checked;
    let {items} = this.props;
    items.forEach((d) => {
      if(d.name === name) { d.checked = (d.checked) ? undefined : true; }
    });
    let names = items
      .filter(({checked}) => { return checked === true; })
      .map(({name}) => name);
    let dispatchChange = this.props && this.props.onChange;
    if(typeof dispatchChange === 'function') {
      dispatchChange(names);
    }
  }

  render () {
    var {items} = this.props;
    var checkboxRenderer = this.checkboxRenderer;
    const {handleChange} = this.handlers;
    return (
      <checkbox-group onChange={handleChange}>
        <label className="checkbox">
        {items.map(checkboxRenderer)}
        </label>
      </checkbox-group>
    );
  }

  checkboxRenderer({name, checked}, i) {
    return (
      <item key={'check_' + i}>
        <input type="checkbox" className="checkbox-control" defaultChecked={checked} data-name={name} />
        <span className="checkbox-label">{name}</span>
      </item>
    );
  }

}

// defaultChecked
/*
              <div>
              </div>

*/