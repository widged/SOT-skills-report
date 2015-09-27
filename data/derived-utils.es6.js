#!/usr/bin/env babel-node

/* jshint esnext: true */

import fs from 'fs';

function getSkills() {

	var sep = '\t';

	var dict = [], list = [];
	var skills = getNodes('derived/skills.tsv', sep, function([category, type, skill, level, count, user_ids], map) {
		var idx = dict.indexOf(skill);
		if(idx === -1) { idx = dict.length; dict.push(skill); list.push({name: skill, type, category, levels: {}}); }
		var item = list[idx];
		var users = user_ids.split(/\s+/);
		item.levels[level] = {name: level, user_ids: users };
	}); 

	function getNodes(file, sep, lineFn) {
		var content = fs.readFileSync(file, 'utf8');
		var lines  = content.split('\n');
		var first = lines.shift();
		var cols = first.split(sep);
		return lines.reduce((acc, d) => {
			var o;
			if(typeof lineFn === 'function') { o = lineFn(d.split(sep)); }
			if(o !== undefined) { acc.push(o); }
			return acc;
		}, []);
	}

	return {dict, list};
}

function skillsByStudent(skills) {
	var levels = [ 'Academic', 'Interested', 'Paid', 'Practical'];
	var dict = [], list = [];
	skills.forEach((d) => {
		Object.keys(d.levels).forEach((l) => {
			var level = d.levels[l] || {};
			(level.user_ids || []).forEach(function(u) {
				var idx = dict.indexOf(u);
				 if(idx === -1) { idx = dict.length; dict.push(u); list.push({user_id: u, levels: {}}); }
				 var item = list[idx];
				 if(!item.levels.hasOwnProperty(l)) { item.levels[l] = []; }
				 item.levels[l].push(d.name);
			});
		})
	});
	return {dict, list};
}

export default {getSkills, skillsByStudent};