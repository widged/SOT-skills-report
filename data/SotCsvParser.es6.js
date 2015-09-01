/* jshint esnext: true */

import fs from 'fs';
import LinesExporter from './LinesExporter.es6.js';

class CsvInputParser {

  static parseCsv(csv, exporter) {
    let lines = csv.split(/\r?\n/);
    let labels = lines.shift().split(',');
    let students = [], skills = [], skillStudents = {};
    let studentFields = 'user_id,school,degree,study_year,final_year'.split(',');
    let skillFields   = 'skill,level,count,user_ids'.split(',');
    lines.forEach(function(line, i) { 
      let [user_id, school, degree, study_year, final_year, ...studentSkills] = line.split(',');
      students.push(exporter.line([user_id, school, degree, study_year,final_year], studentFields));
      studentSkills.forEach(function(skilllevel) {
        if(skilllevel.length === 0) { return; }
        if(!skillStudents.hasOwnProperty(skilllevel)) {
          skillStudents[skilllevel] = [];
        }
        skillStudents[skilllevel].push(user_id);
      });
    });

    for (let skilllevel in skillStudents) {
        let p = skilllevel.split('/');
        let level = p.pop();
        let skill = p.join('/');
        let userids = skillStudents[skilllevel];
        skills.push(exporter.line([skill, level, userids.length, userids.join(';')], skillFields));
    }

    students = exporter.finalize(students, studentFields);
    skills = exporter.finalize(skills, skillFields);
    return {students, skills};
  }
}



export default class DataParser {
  static parse(ExporterFactory) {
    let csv = fs.readFileSync('raw/student_skills_for_vis_2015-08-31.csv', "utf8");
    let {students, skills} = CsvInputParser.parseCsv(csv,  new ExporterFactory());
    // -- writing out students
    let studentsOut = `derived/students.${students.ext}`;
    fs.writeFileSync(studentsOut, students.content);
    console.log(`[saved] ${studentsOut}` );
    // -- writing out skills
    let skillsOut = `derived/skills.${skills.ext}`;
    fs.writeFileSync(skillsOut, skills.content);
    console.log(`[saved] ${skillsOut}` );
  }
}
DataParser.EXPORT_FORMAT = {'CSV': LinesExporter.CrudeCsvExporter, 'TSV': LinesExporter.CrudeTsvExporter, 'JSON': LinesExporter.JsonExporter };


