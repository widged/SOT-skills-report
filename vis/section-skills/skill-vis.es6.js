/* jshint esnext: true */

import React from 'react';

let {Component} = React;

class SkillList extends Component {
  render() {
    var {list} = this.props;
    return (
      <skills><ul>
      {(list || []).map(((item) => { 
        return <li><SkillItem item={item}/></li>
      }))}
      </ul></skills>
    );
  }
}

class SkillItem extends Component {
  constructor(props) {
    super(props);
    function handleClick(e) { 
      this.setState({selected: !this.state.selected}); 
    }
    this.state = {selected: false, handleClick: handleClick.bind(this)};

  }
  render() {
    var {item} = this.props;
    var {handleClick} = this.state;
    var {name, type, primary, secondary, selected, students} = item;
    var studentsQty = (selected && primary) ? primary.length : (secondary) ? secondary.users.split(' ').length.toString() : '    ';
    return(<skill className={'type-'+type + (selected ? ' selected' : '') + (secondary ? ' secondary' : '')} onClick={handleClick}>{name}<qty>{studentsQty}</qty></skill>);
  }
}


function skillsByCategory(skills) {
  var dict = [], categories = [];
  (skills || []).forEach(function ({name, type, category, levels}) {
    var idx = dict.indexOf(category);
    if (idx === -1) {
      idx = dict.length;
      dict.push(category);
      categories[idx] = { name: category, skills: [] };
    }
    categories[idx].skills.push({name, type, category, levels});
  });
  categories.forEach((d) => {
    let order = 'skill;tool'.split(';')
    d.skills.sort((a, b) => {  })
    d.skills.sort((a, b) => { 
      var diff = (order.indexOf(a.type) - order.indexOf(b.type)); 
      if(diff !== 0) return diff;
      return a.name < b.name ? -1 : a.name > b.name ? +1 : 0;
    });
  });
  let order = 'Web / Programming;Design;BA / Digital Marketing;Engineering Skills;Systems / Ops / DBA'.split(';');
  categories.sort((a, b) => { return order.indexOf(a.name) - order.indexOf(b.name) })
  return categories;
}


export default class SkillVis extends Component {
  constructor(props) {
    super(props);
    let {secondarySkills, handlePrimaryChange} = this.props;
    let level = 'Paid';
    function getSecondary(skill, level) {
      var sskill = (secondarySkills || []).filter((d) => { return d.name === skill; })[0];
      var slevel = (sskill || {levels: []}).levels.filter((d) => { return d.name === level; })[0];
      return (slevel || {}).skills;
    }
    function handleClick(e) { 
      var skill = e.target.innerText;
      var secSkills = getSecondary(skill, level);
      var secList = (secSkills || []).map(({name}) => { return name; });
      var list = this.state.list;
      var nlist = (list || []).map(({name, skills}) => {
        var nskills = skills.map(({name, type, category, levels}) => {
          var selected = (name === skill) ? true : false;
          var primary = (levels[level] || {user_ids: []}).user_ids;
          if(selected) { handlePrimaryChange(primary); }
          var idx = secList.indexOf(name);
          var secondary = ( idx !== -1) ? secSkills[idx] : undefined;
          return {name, type, category, levels, selected, primary, secondary};
        });
        return {name, skills: nskills};
      });
      this.setState({list: nlist}); 
    }
    let {primarySkills} = this.props;
    let categorySkills = skillsByCategory(primarySkills);
    this.state = {list: categorySkills, handleClick: handleClick.bind(this)};

  }
  render() {
    var {list, handleClick} = this.state;
    return (
      <categories onClick={handleClick}>{(list || []).map(({name, skills}) => { 
        return(
          <div>
            <h1>{name}</h1>
            <SkillList list={skills}/>
            </div>
        );
      })}</categories>
    );
  }
}


