/* jshint esnext: true */

var assert = require('assert');

import SummerOfTech from '../SummerOfTech.es6.js';
import students     from '../../../../dist/data-from-tools/students.js';
import categories   from '../../../../dist/data-from-tools/students.js';

const rawStudents  = require('../../../../dist/data-from-tools/students.js');
const rawSkills = require('../../../../dist/data-from-tools/skills.js');

describe('SummerOfTech class', function() {
	let summerOfTech;
	beforeEach(function() {
		summerOfTech = new SummerOfTech();
		summerOfTech
		  	.rawStudents(rawStudents)
		  	.rawSkills(rawSkills)
		  	.activeExperienceLevels([SummerOfTech.experienceLevels.Paid]);
	});

    it('does something', function() {
        // assert.fail();
    });


});
