/* jshint esnext: true */


export default class CsvInputParser {

  static parseCsv(csv, exporter) {
    let lines = csv.split(/\r?\n/);
    let labels = lines.shift().split(',');
    let students = [], skills = [], skillStudents = {};
    lines.forEach(function(line, i) { 
      let [user_id, school, degree, study_year, final_year, ...studentSkills] = line.split(',');
      students.push([user_id, school, degree, study_year,final_year]);
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
        skills.push([skill, level, userids.length, userids.join(' ')]);
    }
    return {students, skills};
  }
}

  