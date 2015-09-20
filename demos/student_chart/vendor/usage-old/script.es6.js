/* jshint esnext: true */

import DemoDeployer from '../../../deploy/deploy/DemoDeployer.es6.js';
import Nester from '../../nest/Nester.es6.js';

class Groupings {

	static skillPopularity() {
		return new Nester()
						.key({label: (d) => { return d[2]; }})
						.key({label: (d) => { return d[1]; }, sortValues: (a, b) => {return b - a; }})
						.rollup(function(leaves) { return leaves.length; });
	}

	static skillsExpertiseLevels() {
		return new Nester()
						.key({label: (d) => { return d[1]; }})
						.key({label: (d) => { return d[2]; }, sortValues: (a, b) => {return b.length - a.length; }})
						.rollup(function(leaves) { return leaves.length; });
	}


	static paidExperience() {
		return new Nester()
						.key({label: (d) => { return d[2] === 'paid' ? 'paid' : 'unpaid'; }})
						.key({label: (d) => { 'unpaid'; }, sortValues: (a, b) => {return b.length - a.length; }})
						.rollup(function(leaves) { return leaves.length; });
	}

	static degrees() {
		var dict = [];
		function normalizeDegree(str) {
			str = str.replace(/\s+/g, ' ');
			str = str.replace(/BComm?/ig, 'BCom');
			str = str.replace(/Master's/ig, 'Master');
			str = str.replace(/diploma's/ig, 'Diploma');
			str = str.replace('\"', '');
			str = str.replace(/Information Technology/ig, 'I.T.');
			str = str.replace(/\bIT\b/g, 'I.T.');
			str = str.replace(/^.*?Bachelor of Creative Technologies/g, 'Bachelor of Creative Technologies');
			// str = str.toLowerCase()
			return str;
		}
		return new Nester()
						.key({label: (d) => { return normalizeDegree(d.degree.trim()); }, sortValues: (a, b) => {return b - a; }})
						.rollup(function(leaves) { return leaves.length; });
	}

	static paidOrUnpaid() {
		return new Nester()
						.key({label: (d) => { return d[1] === 'paid' ? 'paid' : 'unpaid'; }})
						.rollup(function(leaves) { return leaves.length; });
	}

	static skillAssociates() {
		return new Nester()
						.key({label: (d) => { return d[1]; }, sortValues: (a, b) => {return b - a; }})
	}

	static smurf() {
		return new Nester()
						.key({label: (d) => { return d[1]; }})
						.key({label: (d) => { return d[2]; }, sortValues: (a, b) => {return b.length - a.length; }})
						.rollup(function(leaves) { return leaves.map((d) => { return d[0]; }); });
	}

}


function pluralize(singular, plural) {
	return function(d) {
		return d == 1 ? singular : plural;
	};
}

function usage(demo) {

	const studentCsv = require('./student_skills_for_vis_2015-08-31.js');
	var DataParser = require('../DataParser.es6.js');

	let pluralizeStudent = pluralize('student', 'students');

	var {students, studentSkillLevel} = DataParser.parseCsv(studentCsv);

	(function() {
		let nester = Groupings.skillPopularity();
		let legend = "10 most common skills for each proficiency level";
		console.log(`---- ${legend} -----`);
		var list = nester.nest(studentSkillLevel);
		var z = list.map(({key, values}) => { 
			let skillStr = values.slice(0,10).map(({key, values}) => `${key}, ${values}`).join('; ');
			return {[key]: skillStr};
		});
		console.log(JSON.stringify(z, null, 2));

	}());

	(function() {
		let nester = Groupings.skillsExpertiseLevels();
		let legend = "The difference between what schools teach and what students are interested in";
		console.log(`---- ${legend} -----`);
		var list = nester.nest(studentSkillLevel);
		var z = list.map(({key, values}) => { 
			let skillStr = values.slice(0,10).map(({key, values}) => [key, values].join(', ')).join('; ');
			return {[key]: skillStr};
		});
		console.log(JSON.stringify(z, null, 2));
	}());

	

	(function() {
		// cleaning up to do, slightly different spellings, extra space, etc.
		let nester = Groupings.degrees();
		let legend = "Most common degrees";
		console.log(`---- ${legend} -----`);
		var list = nester.nest(students);
		var z = list.map(({key, values}) => { 
			return [key, values + ' ' + pluralizeStudent(values)].join(': ');
		});
		console.log(JSON.stringify(z, null, 2));
	}());

	(function() {
		return;
		let nester = Groupings.skillAssociates();
		let legend = "The difference between what schools teach and what students are interested in";
		console.log(`---- ${legend} -----`);
		var list = nester.nest(studentSkillLevel);
		var valuesnester = new Nester()
						.key({label: (d) => { return d[1]; }})
						.key({label: (d) => { return d[2]; }})
 						.rollup(function(leaves) { return leaves; });

		var z = list.map(({key, values}) => { 
			let skillStr = valuesnester.nest(values);
			console.log(`----- ${key} --------`)
			console.log(skillStr)
			return {[key]: skillStr}
		});
		// console.log(JSON.stringify(z, null, 2));
	}());	

// 		var legend = "number of students with paid experience";
// 		var legend = "student degrees";


//	console.log(JSON.stringify(Groupings.skillsExpertiseLevels(studentSkillLevel), null, 2));
//	console.log(JSON.stringify(Groupings.paidExperience(studentSkillLevel), null, 2));


	demo.end();
}



DemoDeployer.usage({ title: 'Skills Report'}, usage);


