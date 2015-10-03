#!/usr/bin/env babel-node

/* jshint esnext: true */

import {getSkills, skillsByStudent} from './derived-utils.es6.js';
import fs from 'fs';

var skills   = getSkills();
var students = skillsByStudent(skills.list);

var levels = [ 'Academic', 'Interested', 'Paid', 'Practical'];
var secondary = skills.list.map((d) => {
		var seconds = Object.keys(d.levels).map((l) => {
			var {name, user_ids} = d.levels[l];
			var udict = [], ulist = [];
			(user_ids || []).forEach(function(u) {
				var uidx = students.dict.indexOf(u);
				students.list[uidx].levels[l].forEach((ss) => {
					if(ss === d.name) { return; }
					var idx = udict.indexOf(ss);
					if(idx === -1) { idx = udict.length; udict.push(ss); ulist.push({name: ss, users: []}); }
					ulist[idx].users.push(u);
				});
			});
			ulist = ulist.map(({name, users}) => { return {name, users: users.join(' ') }; });
			return {name, skills: ulist};
		});
		return {name: d.name, levels: seconds};
});

fs.writeFileSync('secondary/students.jsonp', 'var jsonp_students = ' + JSON.stringify(students.list, null, 2));
fs.writeFileSync('secondary/skills.jsonp', 'var jsonp_skills = ' + JSON.stringify(skills.list, null, 2));
fs.writeFileSync('secondary/secondary.jsonp', 'var jsonp_secondary = ' + JSON.stringify(secondary, null, 2));
