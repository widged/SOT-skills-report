#!/usr/bin/env babel-node

/* jshint esnext: true */

import DataParser from './SotCsvParser.es6.js';
import LinesExporter from './LinesExporter.es6.js';
import fs from 'fs';

var fmt = process.argv[2];


let EXPORT_FORMAT = {
	'csv': LinesExporter.CrudeCsvExporter, 
	'tsv': LinesExporter.CrudeTsvExporter, 
	'json': LinesExporter.JsonExporter 
};

var ExporterFactory = EXPORT_FORMAT[fmt] || EXPORT_FORMAT.tsv;

let csv = fs.readFileSync('raw/student_skills_for_vis_2015-08-31.csv', "utf8");
let {students, skills} = DataParser.parseCsv(csv,  new ExporterFactory());
// -- writing out students
let studentsOut = `derived/students.${students.ext}`;
fs.writeFileSync(studentsOut, students.content);
console.log(`[saved] ${studentsOut}` );
// -- writing out skills
let skillsOut = `derived/skills.${skills.ext}`;
fs.writeFileSync(skillsOut, skills.content);
console.log(`[saved] ${skillsOut}` );
