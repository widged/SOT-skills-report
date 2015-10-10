/* jshint esnext: true */

import React             from 'react';
import MultiSelectField  from './components/multiselect-field/MultiSelectField.es6.js';
import CheckboxGroup     from './components/checkbox-group/CheckboxGroup.es6.js';
import StudentVis        from './components/student-vis/StudentVis.es6.js';
import SkillBubbles      from './components/skill-bubbles/SkillBubbles.es6.js';

let {Component} = React;

class SummaryData extends Component {
  render() {
    const {students, skills} = this.props;
    const studentCount = students.length;
    const skillCount   = skills.length;
    return (
      <summary-data>
      <div><count>{studentCount}</count><h1>Students</h1></div> <div><count>{skillCount}</count><h1>Skills</h1></div>
      </summary-data>
    );
  }
} 

export default class SummerOfTechApp extends Component {

  constructor(props) {
    super(props);
    const {store} = this.props;
    let names;
    const complementarySkills = store.listComplementarySkills(names);
    this.state = {
      primarySkills : names,
      levels        : store.listExperienceLevels(),
      students      : store.listActiveStudents(),
      complementarySkills: complementarySkills, 
      filterStudents: store.listStudentsWithSkills(names), 
      bubbleSkills: store.nestByCategory(complementarySkills)
    };
    this.handlers = {
      handleSkillsChange: this.handleSkillsChange.bind(this), 
      handleExperienceChange: this.handleExperienceChange.bind(this)
    };
  }

  handleSkillsChange(names) {
    this.setState({ primarySkills: names });
    this.whenPrimaryChange(names);
  }

  handleExperienceChange(levels) {
    const {store} = this.props;
    const names = this.state.primarySkills;
    store.activeExperienceLevels(levels);
    this.whenPrimaryChange(names);
  }

  whenPrimaryChange(names) {
    const {store} = this.props;
    console.log('[whenPrimaryChange]', names);
    const complementarySkills = store.listComplementarySkills(names);
    this.setState({
      primarySkills: names,
      complementarySkills: complementarySkills, 
      filterStudents: store.listStudentsWithSkills(names), 
      bubbleSkills: store.nestByCategory(complementarySkills)
    });
  }

  render() {
    const {store} = this.props;
    const {complementarySkills, students, filterStudents, levels, bubbleSkills} = this.state;
    let {handleSkillsChange, handleExperienceChange} = this.handlers;
    return (
      <div>
        <header>
          <div>
            <h1><div id="sot_banner"></div></h1>
            <h2>Interns with Paid Work Experience</h2>
          </div>
        </header>
        <page>
          <aside>
            <article>
            Your next employee is somewhere in here. Use the filters to find them!
            </article>
            <article>
              <MultiSelectField names={complementarySkills} onChange={handleSkillsChange} placeholder="Type up to 3 skills"/>
              <CheckboxGroup items={levels} onChange={handleExperienceChange}/>
            </article>
            <article>
              <div id='group-by'></div>
            </article>
            <article>
              <div id='color-by'></div>
            </article>
          </aside>
          <section>
            <div id="big-numbers">
              <SummaryData students={filterStudents} skills={complementarySkills} />
            </div>
            <article>
              <div id="students-vis">
                <StudentVis list={students} filterStudents={filterStudents} />
              </div>
            </article>
            <article>
              <div className="explanation">The students matching your criteria also have these skills</div>    
              <br/>
              <div id="skills-secondary-vis">
                <SkillBubbles list={bubbleSkills} />
              </div>
            </article>
          </section>
        </page>
        <footer>
          Made in the context of data for goods challenges. Authors (alphabetical order).
        </footer>
        </div>
      );
    }
  }

  /*
  <article>
    <div className="explanation">List of skills. Click on a tag to select a value. Next to the selected tag is the number of students with <em>paid</em> experience for that skill. Next to other tags are the number of students that have <em>paid</em> experience with both that skill and the selected skill. </div>    
    <div id="skills-vis">
      <SkillTags complementarySkills={jsonp_skills} secondarySkills={jsonp_secondary} handlePrimaryChange={handleSkillsChange}/>
    </div>
  </article>
*/
