#!/usr/bin/env babel-node

/* jshint esnext: true */

import DataParser from './SotCsvParser.es6.js';
import LinesExporter from './LinesExporter.es6.js';
import fs from 'fs';

var fmt = process.argv[2];

let csv = fs.readFileSync('raw/student_skills_for_vis_2015-08-31.csv', "utf8");
let {students, skills} = DataParser.parseCsv(csv);

var exporter = LinesExporter.getExporter(fmt);

// -- writing out students
let studentFields = 'user_id,school,degree,study_year,final_year'.split(',');
students = students.map((d) => {  return exporter.line(d, studentFields);  });
students = exporter.wrap(students, studentFields);

let studentsOut = `derived/students.${students.ext}`;
fs.writeFileSync(studentsOut, students.content);
console.log(`[saved] ${studentsOut}` );

// -- writing out skills
let categoriesJson = fs.readFileSync('derived/categories-flat.json', "utf8");
let categories = JSON.parse(categoriesJson);
var categoryMap = categories.reduce((acc, {skill, type, category}) => {
	acc[skill] = {skill, type, category};
	return acc;
}, {});


skills = skills.map(([skill,level,count,user_ids]) => { 
	let {category, type} = categoryMap.hasOwnProperty(skill) && categoryMap[skill] ;
	return [category, type, skill,level,count,user_ids];
});

//    skills.sort(function(a, b) {  return a[2]-b[2];  }); // sort by count
skills.sort(function(a, b) {  // sort by expertise and then skill category, skill name, skill type
  var ax = [a[3],a[0],a[2],a[1]].join('#'), bx = [b[3],b[0],b[2],b[1]].join('#');
  return ( ax < bx) ? -1 : (ax > bx) ? +1 : 0;  
});



let skillFields   = 'category,type,skill,level,count,user_ids'.split(',');
let lines = exporter.dump(skills, skillFields);

let skillsOut = `derived/skills.${lines.ext}`;
fs.writeFileSync(skillsOut, lines.content);
console.log(`[saved] ${skillsOut}` );


  