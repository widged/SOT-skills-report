/* jshint esnext: true */

import SummerOfTechEvent from './SummerOfTechEvent.es6.js';
import EventEmitter2 from 'eventemitter2';

class FN {
  static pluck(prop) {
    return function(item) {
      if(!item.hasOwnProperty(prop)) { return; }
      return item[prop];      
    };
  }

  static intersectLists(acc, d) {
    if(!Array.isArray(acc)) { return d; }
    acc = acc.filter((id) => { return Array.isArray(d) && d.indexOf(id) !== -1; });
    return acc;
  }
}


class Utils {
  static listUsersAtActiveLevels(levels, activeLevels) {
    var user_ids = [];
    activeLevels.forEach(function(level) {
      if (levels && levels.hasOwnProperty(level) && (levels[level].length > 0)) { 
        const ids = (levels[level] || '').split(/\s+/);
        ids.forEach((id) => { if(user_ids.indexOf(id) === -1) {
            user_ids.push(id);
        }});
      } 
    });
    return user_ids;
  }
}

export default class SummerOfTech {

  // ###########################
  // Constructor
  // ###########################
  /**
    Let's store all state data in a state variable the way react does it.
    ES6 destructuring makes it straightforward to distinguish what values come from the state
    and what values are scoped to the function. let {a,b,c} = this.state, d, e;
  */
  constructor() {
    this.events = SummerOfTechEvent;
    this.state  = {
      rawSkills: undefined, 
      rawStudents: undefined, 
      activeLevels: ['Paid']
    };
    this.emitter = new EventEmitter2.EventEmitter2();
  }

  // ###########################
  // Accessors
  // ###########################
  /**
    All accessors return this for fluent interface. The syntax for this is directly inspired from conventions found in jquery or d3js. 
    If no arguments are passed, then the current value, from the state, is returned. If an argument is provided, 
    then the state is set to the value provided. 
    To learn more about chainable/fluent interfaces:
      http://adripofjavascript.com/blog/drips/creating-chainable-interfaces-in-javascript.html
      https://en.wikipedia.org/wiki/Fluent_interface
  */
  rawSkills(_) {
    if(!arguments.length) { return this.state.rawSkills; }
    this.state.rawSkills = _;
    return this;
  }

  rawStudents(_) {
    if(!arguments.length) { return this.state.rawStudents; }
    this.state.rawStudents = _;
    return this;
  }

  activeExperienceLevels(_) {
    if(!arguments.length) { return this.state.activeLevels; }
    this.state.activeLevels = _;
    return this;
  }

  // ###########################
  // Interactivity
  // ###########################

  addEventListener(type, fn) {
    this.emitter.on(type, fn);
  }


  // ###########################
  // Other Public methods
  // ###########################

  listActiveStudents() {
    return this.state.rawStudents;
  }

  listExperienceLevels() {
    const {activeLevels} = this.state;
    return Object.keys(SummerOfTech.experienceLevels).map((k, i) => { 
      return {
        name:    k, 
        checked: (activeLevels.indexOf(k) !== -1) ? true : undefined
      };
    });
  }


  listSkills(names) {
    const {rawSkills, activeLevels} = this.state;
    const skills = rawSkills.names.dict;
    const students = rawSkills.students;

    // We are good if any of the levels has user_ids attached to it
    if(names === undefined) { names = skills; }
    return names
      .map((name) => { 
        let idx = skills.indexOf(name);
        let levels = students[idx].levels; 
        const user_ids = Utils.listUsersAtActiveLevels(levels, activeLevels);
        if(!user_ids || !user_ids.length) {
          // console.log('[levels missing]', name);
        }
        return {name, user_ids};
      })
      .filter(({user_ids}) => { 
        return user_ids && user_ids.length; 
      }); 
  }

  listSkillNames(names) {
     return this.listSkills(names).map(({name}) => name); 
  }  

  listStudentsWithSkills(names) {
    return this.listSkills(names)
          .map(FN.pluck('user_ids'))
          .reduce(FN.intersectLists, null);
  }

  listSkillsOfStudents(ids) {
    const {rawSkills, activeLevels} = this.state;
    const skills      = rawSkills.names.dict;
    const skillLevels = rawSkills.students;
    // return all skills if ids is undefined
    if(!Array.isArray(ids)) { return skills; }
    // return an empty list if ids is an empty array
    if(!ids.length) { return []; }

    let studentSkills = skills.filter((name) => { 
      let idx = skills.indexOf(name);
      let levels = skillLevels[idx].levels;
      const user_ids = Utils.listUsersAtActiveLevels(levels, activeLevels);
      for (let id of ids) {
        if(user_ids.indexOf(id) !== -1)  { return true; }
      }
      return false;
    });
    return studentSkills;
  }

  listComplementarySkills(names) {
    let ids = this.listStudentsWithSkills(names);
    let skills = this.listSkillsOfStudents(ids).filter((name) => {
      return names.indexOf(name) === -1;
    });
    return skills;
  }

  nestByCategory(names) {
    const {rawSkills} = this.state;
    const skills      = rawSkills.names.dict;
    const types       = rawSkills.types;
    const categories  = rawSkills.categories;
    const students    = rawSkills.students;

    if(names === undefined || names === null) { 
      names = skills; 
    }

    let list = names.map((name) => {
      let idx = skills.indexOf(name);
      if(idx === -1) { 
        return {name, type: 'n/a', category: 'n/a', levels: 'n/a'};
      } else {
        let type     = types.list.split(' ')[idx];
        let category = categories.list.split(' ')[idx];
        let levels = students[idx].levels;
        return {name, type, category, levels};
      }
    });

    let children = list.reduce((acc, {name, type, category, levels}) => {
      let bubbleLevels = Object.keys(levels).map((k) => {
        let size = (levels[k] || '').split(' ').length;
        return {size, name: k};
      });
      acc[category].children.push({name, type, children: bubbleLevels});
      return acc;
    }, categories.dict.map((name) => { return {name: name, children: []}; }));
    return {name: "skills", children: children};
  }


  // ###########################
  // Public Static methods
  // ###########################

  static studentsFromTsv(_) {
    if(typeof _ !== 'string') {
      throw new Error('[studentsFromTsv] expecting a string');
    }
    var tsv = _.split(/\n/);
    var first = tsv.shift();
    var heads = 'user_id, school, level, field, degree, degree_details, study_year,final_year'.split(/\t/);
    return tsv.map((line) => { 
        var [user_id, school, level, field, degree, degree_details, study_year,final_year] = line.split('\t');
        return {user_id, school, level, field, degree, degree_details, study_year,final_year};
    });
  }

}

SummerOfTech.experienceLevels = {
  'Paid'      : 'Paid',
  'Practical' : 'Practical',
  'Academic'  : 'Academic',
  'Interested': 'Interested'
};
SummerOfTech.experienceOrder = [
  SummerOfTech.experienceLevels.Paid,
  SummerOfTech.experienceLevels.Practical,
  SummerOfTech.experienceLevels.Academic,
  SummerOfTech.experienceLevels.Interested
];


