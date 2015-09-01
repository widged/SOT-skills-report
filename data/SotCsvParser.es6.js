/* jshint esnext: true */

import fs from 'fs';

class CsvInputParser {

  static parseCsv(csv, exporter) {
    let lines = csv.split(/\r?\n/);
    let labels = lines.shift().split(',');
    lines.forEach(function(line, i) { 
      let [user_id, school, degree, study_year, final_year, ...skills] = line.split(',');
      exporter.addStudent({user_id, school, degree, study_year,final_year});
      skills.forEach(function(skilllevel) {
        if(skilllevel.length === 0) { return; }
        let p = skilllevel.split('/');
        let level = p.pop();
        let skill = p.join('/');
        exporter.addSkill({skill, level, user_id});
      });
    });
    return exporter.finalize();
  }
}

class JsonExporter {

  constructor(separator) {
    this.state = {students: [], skills: [] };
  }

  addStudent({user_id, school, degree, study_year,final_year}) { 
    let {students} = this.state;
    students.push({user_id, school, degree, study_year,final_year});
  }

  addSkill({skill, level, user_id}) { 
    let {skills} = this.state;
    skills.push({skill, level, user_id});
  }

  finalize() {
    let {students, skills} = this.state;
    return {
      students: JSON.stringify(students, null, 2), 
      skills: JSON.stringify(skills, null, 2),
      ext: 'json'
    };
  }
}

class ValueSeparatedExporter {

  constructor(separator, extension) {
    this.state = {separator: separator, extension: extension, students: [], skills: []};
  }

  addStudent({user_id, school, degree, study_year,final_year}) { 
    let {students, separator} = this.state;
    students.push([user_id, school, degree, study_year,final_year].join(separator));
  }

  addSkill({skill, level, user_id}) { 
    let {skills, separator} = this.state;
    skills.push([skill, level, user_id].join(separator));
  }

  finalize() {
    let {students, skills, extension, separator} = this.state;
    students.unshift(`user_id,school,degree,study_year,final_year`.split(',').join(separator));
    skills.unshift(`skill,level,user_id`.split(',').join(separator));

    return {
      students: students.join('\n'), 
      skills: skills.join('\n'),
      ext: extension
    };
  }
}

class CrudeTsvExporter extends ValueSeparatedExporter {
  constructor() {
    super('\t', 'tsv');
  }
}

class CrudeCsvExporter extends ValueSeparatedExporter {
  constructor() {
    super(',', 'json');
  }
}

export default class DataParser {
  static parse(ExporterFactory) {
    let csv = fs.readFileSync('raw/student_skills_for_vis_2015-08-31.csv', "utf8");
    let {students, skills, ext} = CsvInputParser.parseCsv(csv,  new ExporterFactory());
    // -- writing out students
    let studentsOut = `derived/students.${ext}`;
    fs.writeFileSync(studentsOut, students);
    console.log(`${studentsOut} saved` );
    // -- writing out skills
    let skillsOut = `derived/skills.${ext}`;
    fs.writeFileSync(skillsOut, skills);
    console.log(`${skillsOut} saved` );
  }
}
DataParser.EXPORT_FORMAT = {'CSV': CrudeCsvExporter, 'TSV': CrudeTsvExporter, 'JSON': JsonExporter };


