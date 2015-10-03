/* jshint esnext: true */

var assert = require('assert');

import SummerOfTech from '../SummerOfTech.es6.js';
import students     from '../../../../dist/data-from-tools/students.js';
import categories   from '../../../../dist/data-from-tools/students.js';

describe('skills', function() {
	let summerOfTech;
	beforeEach(function() {
		summerOfTech = new SummerOfTech();
	});

	describe('listSkills', function() {

	    it('lists the skills at the active experience levels', function() {
			const rawSkills = [
			  {
			    "name": "Android",
			    "levels": {
			      "Paid": { "user_ids": "190 1403" }
			    }
			  },
			  {
			    "name": "Computer Architecture",
			    "levels": {
			      "Academic": { "user_ids": "190 908" }
			    }
			  }];

			summerOfTech
			  	.rawSkills(rawSkills)
			  	.activeExperienceLevels([SummerOfTech.experienceLevels.Paid]);

			var list = summerOfTech.listSkills(['Android','Agile']);
			var actual = list.map(({name}) => name);
	        assert.deepEqual(actual, [ 'Android' ]);
	    });
	});


	describe('listStudentsWithSkills', function() {
	    it('lists the students that have all the specified skills at prespecified expertise levels', function() {
			const rawSkills = [
			  {
			    "name": "Android",
			    "levels": {
			      "Paid": { "user_ids": "190 1403" }
			    }
			  },
			  {
			    "name": "Computer Architecture",
			    "levels": {
			      "Paid": { "user_ids": "190 908" }
			    }
			  }];

			summerOfTech
			  	.rawSkills(rawSkills)
			  	.activeExperienceLevels([SummerOfTech.experienceLevels.Paid]);

			var list = summerOfTech.listStudentsWithSkills(['Android','Computer Architecture']);
	        assert.deepEqual(list, ['190']);
	    });
	});

	describe('listSkillsOfStudents', function() {

		beforeEach(function() {
			const rawSkills = [
			  {
			    "name": "Android",
			    "levels": {
			      "Paid": { "user_ids": "190 1403" }
			    }
			  },
			  {
			    "name": "Computer Architecture",
			    "levels": {
			      "Paid": { "user_ids": "190 908" }
			    }
			  },
			  {
			    "name": "Javascript",
			    "levels": {
			      "Paid": { "user_ids": "365" }
			    }
			  }			  
			  ];

			summerOfTech
				  	.rawSkills(rawSkills)
				  	.activeExperienceLevels([SummerOfTech.experienceLevels.Paid]);
		});
		
	    it('lists the skills that the specified students have', function() {
			var list = summerOfTech.listSkillsOfStudents(['190','908','1043']);
			var actual = list.map(({name})  =>  name);
	        assert.deepEqual(actual, [ 'Android', 'Computer Architecture' ]);
	    });

	    it('lists all skills when students are undefined', function() {
			var list = summerOfTech.listSkillsOfStudents();
			var actual = list.map(({name})  =>  name);
	        assert.deepEqual(actual, [ 'Android', 'Computer Architecture', 'Javascript' ]);
	    });

	    it('lists no skills when an empty student list is given', function() {
			var list = summerOfTech.listSkillsOfStudents([]);
			var actual = list.map(({name})  =>  name);
	        assert.deepEqual(actual, []);
	    });
	});

	describe('listComplementarySkills', function() {

		beforeEach(function() {
			const rawSkills = [
				{
					"name": "Android",
					"levels": {
					  "Paid": { "user_ids": "190 1403" }
					}
				},
				{
					"name": "Computer Architecture",
					"levels": {
					  "Paid": { "user_ids": "190 908" }
					}
				},
				{
					"name": "Javascript",
					"levels": {
					  "Paid": { "user_ids": "365" }
					}
				}			  
			];

			summerOfTech
			  	.rawSkills(rawSkills)
			  	.activeExperienceLevels([SummerOfTech.experienceLevels.Paid]);
		});

	    it('lists the skills that co-occur with a list of primary skills', function() {
			var list = summerOfTech.listComplementarySkills(['Android']);
			var actual = list.map(({name})  =>  name);
	        assert.deepEqual(actual, ['Computer Architecture']);
	    });

	});

});
