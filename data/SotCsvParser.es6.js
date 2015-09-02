/* jshint esnext: true */


export default class CsvInputParser {

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
        skills.push([skill, level, userids.length, userids.join(';')]);
    }
//    skills.sort(function(a, b) {  return a[2]-b[2];  }); // sort by count
    skills.sort(function(a, b) {  // sort by expertise and then skill name
      var ax = [a[1],a[0]].join('#'), bx = [b[1],b[0]].join('#');
      return ( ax < bx) ? -1 : (ax > bx) ? +1 : 0;  
    });

    skills = skills.map((d) => {  return exporter.line(d, skillFields);  });

    students = exporter.finalize(students, studentFields);
    skills = exporter.finalize(skills, skillFields);
    return {students, skills};
  }
}

