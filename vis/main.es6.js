/* jshint esnext: true */

import React from 'react';
import {Inject} from './imports';
import SkillVis from './section-skills/skill-vis.es6.js';
import StudentVis from './section-students/student-chart.es6.js';

let {Component} = React;

export default function main() {

  var html = `<header>
    <div>
      <h1> <img src="../dist/css/sot_new3.png"></h1>
      <h2>Job entrants - Paid Skills</h2>
    </div>
      
  </header>
  <article>
    <section>
      <div class="explanation">List of skills. Click on a tag to select a value. Next to the selected tag is the number of students with <em>paid</em> experience for that skill. Next to other tags are the number of students that have <em>paid</em> experience with both that skill and the selected skill. </div>    
      <div id="skills-vis"></div>    
    </section>
    <section style="height: 800px;">
      <div class="explanation">List of students. Select a field to color by or to group by.</div>    
      <br/>
      <div id="students-vis"></div>    
    </section>
    <section>
      <div class="explanation">List of secondary skills.</div>    
      <br/>
      <div id="skills-secondary-vis"></div>    
    </section>
  </article>
<!--
  <footer>
    Made in the context of data for goods challenges. Authors (alphabetical order).
  </footer>
-->
  `;
  document.getElementById('app').innerHTML = html;

  Inject.css({file: '../dist/css/skill-vis.css', parent: module});
  Inject.css({file: '../dist/css/sot-branding.css', parent: module});
  Inject.css({file: '../dist/css/student-chart.css', parent: module});
  Inject.css({file: '../dist/css/skill-bubbles.css', parent: module});

  Inject.js([
    '../dist/data/secondary.jsonp',
    '../dist/data/skills.jsonp',
    '../dist/data/skills_bubbles.jsonp',
    '../section-secondary/script.js',
    './../vendor/d3/d3.v3.min.js',
    './../dist/data/sot.jsonp'
  ], function() {

    var tsv = jsonp_sot.split(/\n/);
    var first = tsv.shift();
    var heads = 'user_id, school, level, field, degree, degree_details, study_year,final_year'.split(/\t/);
    var items = tsv.map((line) => { 
        var [user_id, school, level, field, degree, degree_details, study_year,final_year] = line.split('\t');
        return {user_id, school, level, field, degree, degree_details, study_year,final_year};
    });

    React.render(
      React.createElement(SkillVis, {primarySkills: jsonp_skills, secondarySkills: jsonp_secondary, handlePrimaryChange}), 
      document.getElementById('skills-vis')
    );

    var students = React.render(
      React.createElement(StudentVis, {list: items}), 
      document.getElementById('students-vis')
    );

    function handlePrimaryChange(primary) {
      students.setState({filterStudents: primary});
    }

    var secondarySkills = React.render(
      React.createElement('skill-bubbles', {}), 
      document.getElementById('skills-secondary-vis')
    );

    draw_skills_bubbles();

  });
  
}
