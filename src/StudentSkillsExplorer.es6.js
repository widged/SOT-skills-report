/* jshint esnext: true */

import React             from 'react';
import SkillMultiSelect  from './section-skills/SkillMultiSelect.es6.js';
import ExperienceLevelSelect  from './section-skills/ExperienceLevelSelect.es6.js';
import StudentVis        from './section-students/student-chart.es6.js';
import SkillTags         from './section-skills/SkillTags.es6.js';

let {Component} = React;

class SkillBubbles {

  componentDidMount() {
    var rootNode = document.querySelector('skill-bubbles');
    rootNode.innerHTML = '';
    let rawBubbles = this.props.list;
    draw_skills_bubbles(rawBubbles, rootNode);
  }
  render() {
    return ( <skill-bubbles/> );
  }

  shouldComponentUpdate( nextProps, nextState) {
      if(nextProps.hasOwnProperty('list')) {
        var rootNode = document.querySelector('skill-bubbles');
        rootNode.innerHTML = '';
        let rawBubbles = nextProps.list;
        draw_skills_bubbles(rawBubbles, rootNode);
      }
      return false;
  }

}

export default class SummerOfTechApp extends Component {

  constructor(props) {
    super(props);
    const {store} = this.props;
    this.state = {
      complementarySkills: store.listSkillNames(),
      bubbleSkills: store.nestByCategory(),
      levels: store.listExperienceLevels(),
      students: store.listActiveStudents(),
      filterStudents: undefined,
    };
    this.handlers = {
      handleSkillsChange: this.handleSkillsChange.bind(this), 
      handleExperienceChange: this.handleExperienceChange.bind(this)
    };
  }

  componentWillMount() {
    const {store} = this.props;
  } 

  handleSkillsChange(names) {
    const {store} = this.props;
    const complementarySkills = store.listComplementarySkills(names);
    this.setState({
      complementarySkills: complementarySkills, 
      filterStudents: store.listStudentsWithSkills(names), 
      bubbleSkills: store.nestByCategory(complementarySkills)
    });
  }

  handleExperienceChange(names) {
      /*
      handleComplementary(skills);
      // let skills = Sot.listSkillsAtExpertise(jsonp_skills, expertiseLevel);
      studentVis.setState({filterStudents: students});
      */
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
            <SkillMultiSelect names={complementarySkills} handleChange={handleSkillsChange}/>
            <ExperienceLevelSelect levels={levels}  handleChange={handleExperienceChange}/>
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
