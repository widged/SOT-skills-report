/* jshint esnext: true */

import React     from 'react';
import {Inject}  from './imports';
import SkillVis  from './section-skills/skill-vis.es6.js';
import StudentVis from './section-students/student-chart.es6.js';
import Select from 'react-select';


let {Component} = React;

export default function main() {

  Inject.css({file: '../dist/css/skill-vis.css', parent: module});
  Inject.css({file: '../dist/css/sot-branding.css', parent: module});
  Inject.css({file: '../dist/css/student-chart.css', parent: module});
  Inject.css({file: '../dist/css/skill-bubbles.css', parent: module});
  Inject.css({file: '../../node_modules/react-select/dist/default.css', parent: module});

  Inject.js([
    '../dist/data/secondary.jsonp',
    '../dist/data/skills.jsonp',
    '../dist/data/skills_bubbles.jsonp',
    '../dist/data/sot.jsonp',
    '../section-secondary/script.js',
    './../vendor/d3/d3.v3.min.js',
  ], function() {

    var tsv = jsonp_sot.split(/\n/);
    var first = tsv.shift();
    var heads = 'user_id, school, level, field, degree, degree_details, study_year,final_year'.split(/\t/);
    var items = tsv.map((line) => { 
        var [user_id, school, level, field, degree, degree_details, study_year,final_year] = line.split('\t');
        return {user_id, school, level, field, degree, degree_details, study_year,final_year};
    });

    let studentVis;
    
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

    class MultiSelectField extends Component {
       constructor (props) {
          super(props);
          let expertiseLevel = 'Paid';
          let skills = jsonp_skills.slice(0).filter(({levels}) => { 
            return levels.Paid && levels[expertiseLevel].user_ids  && levels[expertiseLevel].user_ids.length;
          });
          this.state =  { disabled: false, value: [], skills: skills, expertiseLevel };
          this.handlers = {handleSelectChange: this.handleSelectChange.bind(this)};
        }
        
        handleSelectChange (value, values) {
          // logChange('New value:', value, 'Values:', values);
          var {skills, expertiseLevel} = this.state;
          let getSkillIds = pluckSkillIds(expertiseLevel);
          if(values && values.length) {
            var ids = values
              .map(({value}) => value)
              .map(getSkill)
              .map(getSkillIds)
              .reduce(listIntesection);
            studentVis.setState({filterStudents: ids});

            skills = jsonp_skills.slice(0).filter((skill) => {
              let skill_ids = getSkillIds(skill);
              let intersect =  listIntesection(ids, skill_ids);
              return intersect && intersect.length;
            });
            console.log(skills)
          } else {
            studentVis.setState({filterStudents: undefined});
            skills = jsonp_skills.slice(0);
          }

          this.setState({ value: value, skills: skills });
        }

        render () {
          var ops = this.state.skills.map((d) => {
            return { label: d.name, value: d.name }
          }).sort(function(a, b) { return a.label < b.label ? -1 : a.label > b.label ? 1 : 0; });
          let {handleSelectChange} = this.handlers;
          return (
            <div className="section">
              <Select multi={true} disabled={this.state.disabled} value={this.state.value} placeholder="Select one or more skills" options={ops} onChange={handleSelectChange} />
              <label className="checkbox">
                <input type="checkbox" className="checkbox-control" checked="true" />
                <span className="checkbox-label">Paid</span>
              </label>

            </div>
          );
        }
    }
    MultiSelectField.propTypes = { label: React.PropTypes.string };

    class SotApp extends Component {
      render() {
        return (
        <div>
          <header>
            <div>
              <h1><img src="../dist/css/sot_new3.png"/></h1>
              <h2>Job entrants - Paid Skills</h2>
            </div>
          </header>
          <article>
            <section>
              <div class="explanation">Select a skill </div>    
              <br/>
              <MultiSelectField label="Multiselect"/>
            </section>
            <section style={{height: 800}}>
              <div class="explanation">List of students. Select a field to color by or to group by.</div>    
              <br/>
              <div id="students-vis"/>
            </section>
            <section>
              <div class="explanation">List of secondary skills.</div>    
              <br/>
              <div id="skills-secondary-vis">
                <skill-bubbles/> 
              </div>
            </section>
            <section>
              <div class="explanation">List of skills. Click on a tag to select a value. Next to the selected tag is the number of students with <em>paid</em> experience for that skill. Next to other tags are the number of students that have <em>paid</em> experience with both that skill and the selected skill. </div>    
              <div id="skills-vis">
                <SkillVis primarySkills={jsonp_skills} secondarySkills={jsonp_secondary} handlePrimaryChange={handlePrimaryChange}/>
              </div>
            </section>
          </article>
          <footer>
            Made in the context of data for goods challenges. Authors (alphabetical order).
          </footer>
          </div>
        );
      }
    }

    React.render(
      React.createElement(SotApp), 
      document.getElementById('app')
    );

   studentVis = React.render(
      React.createElement(StudentVis, {list: items}), 
      document.getElementById('students-vis')
    );

    function handlePrimaryChange(studentList) {
      console.log(studentList)
      studentVis.setState({filterStudents: studentList});
    }

    draw_skills_bubbles(jsonp_bubbles);

  });
}
