/* jshint esnext: true */

import React             from 'react';
import MultiSelectField  from './components/multiselect-field/MultiSelectField.es6.js';
import CheckboxGroup     from './components/checkbox-group/CheckboxGroup.es6.js';
import StudentVis        from './section-students/student-chart.es6.js';
import SkillBubbles      from './section-secondary/SkillBubbles.es6.js';

let {Component} = React;

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
            <h1><img src="../dist/css/sot_new3.png"/></h1>
            <h2>Interns with Paid Work Experience</h2>
          </div>
        </header>
        <article>
          <section>
            <MultiSelectField names={complementarySkills} onChange={handleSkillsChange} placeholder="Please select one or more skills. The students with that skill will be highlighted."/>
            <CheckboxGroup items={levels} onChange={handleExperienceChange}/>
          </section>
          <section>
            <div id="students-vis">
              <StudentVis list={students} filterStudents={filterStudents} />
            </div>
          </section>
          <section>
            <div className="explanation">The students matching your criteria also have these skills</div>    
            <br/>
            <div id="skills-secondary-vis">
              <SkillBubbles list={bubbleSkills} />
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

  /*
  <section>
    <div className="explanation">List of skills. Click on a tag to select a value. Next to the selected tag is the number of students with <em>paid</em> experience for that skill. Next to other tags are the number of students that have <em>paid</em> experience with both that skill and the selected skill. </div>    
    <div id="skills-vis">
      <SkillTags complementarySkills={jsonp_skills} secondarySkills={jsonp_secondary} handlePrimaryChange={handleSkillsChange}/>
    </div>
  </section>
*/
