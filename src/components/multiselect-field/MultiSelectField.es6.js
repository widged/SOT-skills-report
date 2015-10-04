/* jshint esnext: true */

import React             from 'react';
import Select            from 'react-select';

let {Component} = React;

export default class MultiSelectField extends Component {
 constructor (props) {
    super(props);
    this.state    = {value: undefined};
    this.handlers = {handleChange: this.handleChange.bind(this)};
  }
  
  handleChange (value, values) {
    let dispatchChange = this.props && this.props.onChange;
    if(typeof dispatchChange === 'function') {
      let names = values.map(({value}) => value);
      dispatchChange(names);
    }
    this.setState({ value: value});
  }

  render () {
    const {handleChange} = this.handlers;
    const {names, placeholder} = this.props;
    const ops = (names || []).map((name) => {
      return { label: name, value: name };
    }).sort(function(a, b) { return a.label < b.label ? -1 : a.label > b.label ? 1 : 0; });
    return (
      <multiselect-field>
        <Select multi value={this.state.value} placeholder={placeholder} options={ops} onChange={handleChange}/>
      </multiselect-field>
    );
  }
}
MultiSelectField.propTypes = { label: React.PropTypes.string };