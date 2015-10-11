/* jshint esnext: true */

import React             from 'react';
import SummerOfTech      from './lib/summer-of-tech/SummerOfTech.es6.js';
import StudentSkillsExplorer from './StudentSkillsExplorer.es6.js';

let {Component} = React;

export default function main() {

	const tsvStudents  = require('../dist/data-from-tools/students.js');
	const rawStudents = SummerOfTech.studentsFromTsv(tsvStudents);
	const rawSkills = require('../dist/data-from-tools/skills.js');


	let summerOfTech = new SummerOfTech();
	summerOfTech
		.rawSkills(rawSkills)
	  	.rawStudents(rawStudents)
	  	.activeExperienceLevels([SummerOfTech.experienceLevels.Paid]);

	React.render(
		React.createElement(StudentSkillsExplorer,{store: summerOfTech}), 
		document.getElementById('app')
	);

}
