/* jshint esnext: true */

import React             from 'react';
import Select            from 'react-select';

let {Component} = React;

function getSkill(skillName) {
    let skills = jsonp_skills.filter(({name}) => {  return name === skillName;});
    return (skills) ? skills[0] : undefined;
}

function pluckSkillIds(expertiseLevel) {
  return function(skill) {
    if(!skill || !skill.levels || !skill.levels[expertiseLevel]) { return; }
    return skill.levels[expertiseLevel].user_ids;      
  };
}

function listIntesection(acc, d) {
  acc = acc.filter((id) => { return Array.isArray(d) && d.indexOf(id) !== -1; });
  return acc;
}

export default class MultiSelectField extends Component {
 constructor (props) {
    super(props);
    let expertiseLevel = 'Paid';
    let skills = jsonp_skills.slice(0).filter(({levels}) => { 
      return levels.Paid && levels[expertiseLevel].user_ids  && levels[expertiseLevel].user_ids.length;
    });
    this.state =  { disabled: false, value: [], skills: skills, expertiseLevel };
    this.handlers = {handleChange: this.handleChange.bind(this)};
  }
  
  handleChange (value, values) {
    // logChange('New value:', value, 'Values:', values);
    var {skills, expertiseLevel} = this.state;
    let studentIds;
    let getSkillIds = pluckSkillIds(expertiseLevel);
    if(values && values.length) {
      var ids = values
        .map(({value}) => value)
        .map(getSkill)
        .map(getSkillIds)
        .reduce(listIntesection);

      studentIds = ids;
      skills = jsonp_skills.slice(0).filter((skill) => {
        let skill_ids = getSkillIds(skill);
        let intersect =  listIntesection(ids, skill_ids);
        return intersect && intersect.length;
      });
    } else {
      skills = jsonp_skills.slice(0);
    }

    let dispatchChange = this.props && this.props.handleChange;
    if(typeof dispatchChange === 'function') {
      dispatchChange({students: studentIds});
    }

    this.setState({ value: value, skills: skills });
  }

  render () {
    var ops = this.state.skills.map((d) => {
      return { label: d.name, value: d.name }
    }).sort(function(a, b) { return a.label < b.label ? -1 : a.label > b.label ? 1 : 0; });
    let {handleChange} = this.handlers;
    return (
      <div className="section">
        <Select multi={true} disabled={this.state.disabled} value={this.state.value} placeholder="Select one or more skills" options={ops} onChange={handleChange} />
        <label className="checkbox">
          <input type="checkbox" className="checkbox-control" defaultChecked="true" />
          <span className="checkbox-label">Paid</span>
        </label>

      </div>
    );
  }
}
MultiSelectField.propTypes = { label: React.PropTypes.string };