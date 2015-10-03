/* jshint esnext: true */

var assert = require('assert');

import SummerOfTech from '../SummerOfTech.es6.js';

describe('SummerOfTech class', function() {
	let summerOfTech;
	beforeEach(function() {
		summerOfTech = new SummerOfTech();
	});

    describe('Students file', function() {

        it('converts from tsv', function() {
            const tsvStudents  = require('../../../../dist/data-from-tools/students.js');
            const rawStudents = SummerOfTech.studentsFromTsv(tsvStudents);
            assert.equal(rawStudents.length, 677);
        });

        it('items have the expected format', function() {
            const tsvStudents  = require('../../../../dist/data-from-tools/students.js');
            const rawStudents = SummerOfTech.studentsFromTsv(tsvStudents);
            var expected = { user_id: '190',
              school: 'Victoria University of Wellington',
              level: 'B',
              field: 'Eng',
              degree: 'BE',
              degree_details: 'BE',
              final_year: "TRUE",
              study_year: "5"
            };
            assert.deepEqual(rawStudents[0], expected);
        });


        it('loads the students from tsv format', function() {
            const tsvStudents  = require('../../../../dist/data-from-tools/students.js');
            const rawStudents = SummerOfTech.studentsFromTsv(tsvStudents);
    		summerOfTech.rawStudents(rawStudents);
    		const students = summerOfTech.rawStudents();
            assert.equal(students.length, 677);
        });


    });

    describe('Students file', function() {

        it('loads the skill with students from a json format', function() {
        	const rawSkills = require('../../../../dist/data-from-tools/skills.js');
    		summerOfTech.rawSkills(rawSkills);
    		const skills = summerOfTech.rawSkills();
            assert.equal(skills.names.dict.length, 107);
        });

    });

});
