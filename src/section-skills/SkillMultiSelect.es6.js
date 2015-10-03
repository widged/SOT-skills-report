/* jshint esnext: true */

import React             from 'react';
import Select            from 'react-select';

let {Component} = React;

export default class MultiSelectField extends Component {
 constructor (props) {
    super(props);
    this.state =  { value: undefined };
    this.handlers = {handleChange: this.handleChange.bind(this)};
  }
  
  handleChange (value, values) {
    // logChange('New value:', value, 'Values:', values);
    let dispatchChange = this.props && this.props.handleChange;
    if(typeof dispatchChange === 'function') {
      let names = values.map(({value}) => value);
      dispatchChange(names);
    }
    this.setState({ value: value});
  }

  render () {
    const {handleChange} = this.handlers;
    const {names} = this.props;
    const ops = names.map((name) => {
      return { label: name, value: name };
    }).sort(function(a, b) { return a.label < b.label ? -1 : a.label > b.label ? 1 : 0; });
    return (
      <div className="section">
        <Select multi={true} value={this.state.value} placeholder="Please select one or more skills. The students with that skill will be highlighted." options={ops} onChange={handleChange} />
      </div>
    );
  }
}
MultiSelectField.propTypes = { label: React.PropTypes.string };