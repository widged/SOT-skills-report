"use strict";

pipe(function (pass, res) {
  return [function (_) {
    loadTextFile("http://widged.github.io/SOT-skills-report/tools/data-raw/student_skills_for_vis_2015-08-31.csv", pass);
  }, function (_) {
    res.student_csv = _;pass();
  }, function (_) {
    loadTextFile("http://widged.github.io/SOT-skills-report/tools/data-raw/Summer%20of%20Tech%20Skills%20Categories.html", pass);
  }, function (_) {
    res.html_categories = _;pass();
  }, function (_) {
    loadTextFile("http://widged.github.io/SOT-skills-report/tools/data-raw/students_patch.csv", pass);
  }, function (_) {
    res.student_patch = _;pass();
  }];
}).then(function (res) {
  handleFiles(res);
});

function handleFiles(_ref) {
  var html_categories = _ref.html_categories;
  var student_csv = _ref.student_csv;
  var student_patch = _ref.student_patch;

  document.querySelector('#categories-raw').value = html_categories;
  document.querySelector('#students-raw').value = student_csv;
  var btn = document.querySelector('button#convert');
  btn.addEventListener('click', function () {
    var html_categories = document.querySelector('#categories-raw').value;
    var student_csv = document.querySelector('#students-raw').value;

    var _convertRaw = convertRaw(html_categories, student_csv, student_patch);

    var skills = _convertRaw.skills;
    var students = _convertRaw.students;

    document.querySelector('#skills-vis').value = 'export default ' + JSON.stringify(skills, null, 2) + ';';
    document.querySelector('#students-vis').value = 'export default `' + students + '`;';
  });
}

function convertRaw(html_categories, student_csv, students_patch) {
  var _parseCsv = parseCsv(student_csv);

  var students = _parseCsv.students;
  var skills = _parseCsv.skills;

  var skillLevels = skills.slice(0);skills = null;
  students = patchStudents(students, students_patch);
  skills = convertSkillHtml(html_categories);
  skills = alignLevels(skills, skillLevels);
  return { skills: skills, students: students };
}

function alignLevels(skills, skillLevels) {
  var dict = skills.names.dict;
  var students = dict.map(function (d) {
    return { levels: {} };
  });
  skillLevels.forEach(function (_ref2) {
    var name = _ref2[0];
    var level = _ref2[1];
    var count = _ref2[2];
    var user_ids = _ref2[3];

    var idx = dict.indexOf(name);
    if (idx === -1) {
      idx = dict.length;
      dict.push(name);
      students[idx] = { levels: {} };
      console.log('[ADDED]', name);
    }
    students[idx].levels[level] = user_ids;
  });
  skills.students = students;
  return skills;
}

function convertSkillHtml(skillHtml) {
  var div = document.createElement('div');
  div.innerHTML = skillHtml;
  var lis = div.querySelectorAll('li');
  var skills = Array.prototype.slice.call(lis).map(function (d) {
    var skill = d.innerText.replace(/\s*\(\d+\)/, '');
    var type = d.parentNode.previousSibling.previousSibling.innerText;
    if (type.match(/^tool/i)) {
      type = 'tool';
    }
    if (type.match(/^skill/i)) {
      type = 'skill';
    }
    var category = d.parentNode.parentNode.parentNode.querySelector('td').innerText;
    return { skill: skill, type: type, category: category };
  });
  var categories = skills.map(function (_ref3) {
    var category = _ref3.category;
    return category;
  });
  var types = skills.map(function (_ref4) {
    var type = _ref4.type;
    return type;
  });
  skills = skills.map(function (_ref5) {
    var skill = _ref5.skill;
    return skill;
  });
  return { names: { dict: skills }, types: compactList(types), categories: compactList(categories) };
  ;
}

function compactList(list) {
  var dict = [];
  list = list.map(function (d) {
    var idx = dict.indexOf(d);
    if (idx === -1) {
      idx = dict.length;dict.push(d);
    }
    return idx;
  });
  return { dict: dict, list: list.join(' ') };
}

function patchStudents(students, students_patch) {
  students = students.map(function (d) {
    var user_id = d[0];
    var school = d[1];
    var degree = d[2];
    var study_year = d[3];
    var final_year = d[4];

    var degree_details = degree;
    var _ref6 = {};
    var level = _ref6.level;
    var field = _ref6.field;

    var m = students_patch.match(new RegExp("^(" + user_id + "\\s+.*?)$", "m"));
    if (m && m[0]) {
      var _m$0$split = m[0].split('\t');

      var level_patch = _m$0$split[2];
      var field_patch = _m$0$split[3];
      var degree_patch = _m$0$split[4];

      level = level_patch;
      field = field_patch;
      degree = degree_patch;
    }
    return [user_id, school, level, field, degree, degree_details, study_year, final_year].join("\t");
  });

  students.unshift("user_id,school,level,field,degree  degree_details,study_year,final_year".split(',').join("\t"));
  return students.join('\n');
}

function parseCsv(csv, exporter) {
  var lines = csv.split(/\r?\n/);
  var labels = lines.shift().split(',');
  var students = [],
      skills = [],
      skillStudents = {};
  lines.forEach(function (line, i) {
    var _line$split = line.split(',');

    var user_id = _line$split[0];
    var school = _line$split[1];
    var degree = _line$split[2];
    var study_year = _line$split[3];
    var final_year = _line$split[4];

    var studentSkills = _line$split.slice(5);

    students.push([user_id, school, degree, study_year, final_year]);
    studentSkills.forEach(function (skilllevel) {
      if (skilllevel.length === 0) {
        return;
      }
      if (!skillStudents.hasOwnProperty(skilllevel)) {
        skillStudents[skilllevel] = [];
      }
      skillStudents[skilllevel].push(user_id);
    });
  });

  for (var skilllevel in skillStudents) {
    var p = skilllevel.split('/');
    var level = p.pop();
    var skill = p.join('/');
    var userids = skillStudents[skilllevel];
    skills.push([skill, level, userids.length, userids.join(' ')]);
  }
  return { students: students, skills: skills };
}

function loadTextFile(file, asyncReturn) {
  var request = new XMLHttpRequest();
  request.onload = function () {
    asyncReturn(this.responseText);
  };
  request.open("get", file, true);
  request.send();
}

function pipe(listFn) {
  var currentIdx = 0,
      fns,
      res = {};
  var next = function next() {
    if (++currentIdx < fns.length) {
      var fn = fns[currentIdx];
      fn.apply(null, arguments);
    }
  };
  function then(lastFn) {
    fns = listFn(next, res);
    fns.push(function () {
      lastFn(res);
    });
    currentIdx = -1;
    next();
  };
  return { then: then };
};