"use strict";


skillComponent(function(d) {
  document.querySelector('#selection list').innerText = d.sort().join(', ');
});

function skillComponent(dispatchChange) {

  var skills = skillsByCategory();
  var order = ["BA / Digital Marketing", "Design", "Web / Programming", "Engineering Skills", "Systems / Ops / DBA"];

  var categories = d3.select("#skills")
      .selectAll("div")
      .data(skills);
  categories.enter()
    .append("div")
    .attr("class", function (d, i) { return "category category-" + i; });
  categories.exit().remove();

  var titles = categories.selectAll("h1").data(
    function (d) { return [d]; }, 
    function (d, i) { return i; }
  );
  titles
    .enter()
    .append("h1").text(function (d, i) { return d.category;  });
  titles.exit().remove();

  var uls = categories.selectAll("ul").data(
    function (d) { return [d]; }, 
    function (d, i) { return i; }
  );
  uls.enter()
    .append("ul");
  uls.exit().remove();

  var lis = uls
    .selectAll('li').data(
      function (d) { return d.skills; }, 
      function (d, i) { return d.skill; } 
    );
  lis.enter()
    .append("li")
    .text(function (d, i) { return d.skill;  })
    .attr('class', function (d, i) { return 'skill type-' + d.type;  })
    .classed('selected', function(d) { return d._selected; })
    .on('mousedown', function(d) { 
      d._selected = !d._selected; // toggle
      lis.classed('selected', function(d) { return d._selected; });
      var selected = [];
      lis.filter(function(e) { 
        if(e._selected) { selected.push(e.skill); }
      });
      dispatchChange(selected);
    });
  lis.exit().remove();


  function skillsByCategory() {
    var skills = getCategories();
    var dict = [], categories = [];
    skills.forEach(function (d) {
      var key = d.category;
      var idx = dict.indexOf(key);
      if (idx === -1) {
        idx = dict.length;
        dict.push(key);
        categories[idx] = { category: key, skills: [] };
      }
      categories[idx].skills.push(d);
    });
    return categories;
  }

  function getCategories() {
    return [{
      "skill": "AI",
      "type": "skill",
      "category": "Web / Programming"
    }, {
      "skill": "Android",
      "type": "skill",
      "category": "Web / Programming"
    }, {
      "skill": "Computer Architecture",
      "type": "skill",
      "category": "Web / Programming"
    }, {
      "skill": "Distributed Programming",
      "type": "skill",
      "category": "Web / Programming"
    }, {
      "skill": "Front-end Web Frameworks",
      "type": "skill",
      "category": "Web / Programming"
    }, {
      "skill": "iOS / iPhone",
      "type": "skill",
      "category": "Web / Programming"
    }, {
      "skill": "Linux / Unix",
      "type": "skill",
      "category": "Web / Programming"
    }, {
      "skill": "Network Programming",
      "type": "skill",
      "category": "Web / Programming"
    }, {
      "skill": "Nodejs",
      "type": "skill",
      "category": "Web / Programming"
    }, {
      "skill": "Responsive Web Development",
      "type": "skill",
      "category": "Web / Programming"
    }, {
      "skill": "SQL",
      "type": "skill",
      "category": "Web / Programming"
    }, {
      "skill": "Testing",
      "type": "skill",
      "category": "Web / Programming"
    }, {
      "skill": "Web Development",
      "type": "skill",
      "category": "Web / Programming"
    }, {
      "skill": "Windows Universal Apps",
      "type": "skill",
      "category": "Web / Programming"
    }, {
      "skill": "Actionscript / Flash",
      "type": "tool",
      "category": "Web / Programming"
    }, {
      "skill": "C/C++",
      "type": "tool",
      "category": "Web / Programming"
    }, {
      "skill": "CSS",
      "type": "tool",
      "category": "Web / Programming"
    }, {
      "skill": "Docker",
      "type": "tool",
      "category": "Web / Programming"
    }, {
      "skill": "git",
      "type": "tool",
      "category": "Web / Programming"
    }, {
      "skill": "HTML",
      "type": "tool",
      "category": "Web / Programming"
    }, {
      "skill": "Java",
      "type": "tool",
      "category": "Web / Programming"
    }, {
      "skill": "Javascript",
      "type": "tool",
      "category": "Web / Programming"
    }, {
      "skill": "MySQL",
      "type": "tool",
      "category": "Web / Programming"
    }, {
      "skill": ".NET (C# and VB.net)",
      "type": "tool",
      "category": "Web / Programming"
    }, {
      "skill": "Objective C / Swift",
      "type": "tool",
      "category": "Web / Programming"
    }, {
      "skill": "Oracle",
      "type": "tool",
      "category": "Web / Programming"
    }, {
      "skill": "Perl",
      "type": "tool",
      "category": "Web / Programming"
    }, {
      "skill": "PHP",
      "type": "tool",
      "category": "Web / Programming"
    }, {
      "skill": "Postgres",
      "type": "tool",
      "category": "Web / Programming"
    }, {
      "skill": "Puppet",
      "type": "tool",
      "category": "Web / Programming"
    }, {
      "skill": "Python",
      "type": "tool",
      "category": "Web / Programming"
    }, {
      "skill": "R",
      "type": "tool",
      "category": "Web / Programming"
    }, {
      "skill": "Ruby on Rails",
      "type": "tool",
      "category": "Web / Programming"
    }, {
      "skill": "SQL Server",
      "type": "tool",
      "category": "Web / Programming"
    }, {
      "skill": "Vagrant",
      "type": "tool",
      "category": "Web / Programming"
    }, {
      "skill": "3D Modelling",
      "type": "skill",
      "category": "Design"
    }, {
      "skill": "3D Texturing",
      "type": "skill",
      "category": "Design"
    }, {
      "skill": "Animation",
      "type": "skill",
      "category": "Design"
    }, {
      "skill": "Concept Art / Matt",
      "type": "skill",
      "category": "Design"
    }, {
      "skill": "FX",
      "type": "skill",
      "category": "Design"
    }, {
      "skill": "Interaction Design",
      "type": "skill",
      "category": "Design"
    }, {
      "skill": "Motion Graphics / Compositing",
      "type": "skill",
      "category": "Design"
    }, {
      "skill": "Photography",
      "type": "skill",
      "category": "Design"
    }, {
      "skill": "Rendering",
      "type": "skill",
      "category": "Design"
    }, {
      "skill": "Rigging / TD",
      "type": "skill",
      "category": "Design"
    }, {
      "skill": "Rotoscoping",
      "type": "skill",
      "category": "Design"
    }, {
      "skill": "Typography",
      "type": "skill",
      "category": "Design"
    }, {
      "skill": "User Experience",
      "type": "skill",
      "category": "Design"
    }, {
      "skill": "Video Editing",
      "type": "skill",
      "category": "Design"
    }, {
      "skill": "After Effects",
      "type": "tool",
      "category": "Design"
    }, {
      "skill": "CS (Creative Suite)",
      "type": "tool",
      "category": "Design"
    }, {
      "skill": "Illustrator",
      "type": "tool",
      "category": "Design"
    }, {
      "skill": "InDesign",
      "type": "tool",
      "category": "Design"
    }, {
      "skill": "Maya",
      "type": "tool",
      "category": "Design"
    }, {
      "skill": "Photoshop",
      "type": "tool",
      "category": "Design"
    }, {
      "skill": "Shake",
      "type": "tool",
      "category": "Design"
    }, {
      "skill": "Sketch",
      "type": "tool",
      "category": "Design"
    }, {
      "skill": "3D Printing",
      "type": "skill",
      "category": "Engineering Skills"
    }, {
      "skill": "Analogue Circuit Design",
      "type": "skill",
      "category": "Engineering Skills"
    }, {
      "skill": "Analogue Electronics",
      "type": "skill",
      "category": "Engineering Skills"
    }, {
      "skill": "CAD / CAM",
      "type": "skill",
      "category": "Engineering Skills"
    }, {
      "skill": "Communications Engineering",
      "type": "skill",
      "category": "Engineering Skills"
    }, {
      "skill": "Control System Engineering",
      "type": "skill",
      "category": "Engineering Skills"
    }, {
      "skill": "Digital Circuit Design",
      "type": "skill",
      "category": "Engineering Skills"
    }, {
      "skill": "Electronic Design",
      "type": "skill",
      "category": "Engineering Skills"
    }, {
      "skill": "Embedded Systems",
      "type": "skill",
      "category": "Engineering Skills"
    }, {
      "skill": "Instrumentation and controls",
      "type": "skill",
      "category": "Engineering Skills"
    }, {
      "skill": "Mechatronics",
      "type": "skill",
      "category": "Engineering Skills"
    }, {
      "skill": "Micro-controller Programming",
      "type": "skill",
      "category": "Engineering Skills"
    }, {
      "skill": "PCB Design",
      "type": "skill",
      "category": "Engineering Skills"
    }, {
      "skill": "Power Electronics",
      "type": "skill",
      "category": "Engineering Skills"
    }, {
      "skill": "Power Systems & Distribution",
      "type": "skill",
      "category": "Engineering Skills"
    }, {
      "skill": "Process Design",
      "type": "skill",
      "category": "Engineering Skills"
    }, {
      "skill": "Robotics",
      "type": "skill",
      "category": "Engineering Skills"
    }, {
      "skill": "Signal Processing",
      "type": "skill",
      "category": "Engineering Skills"
    }, {
      "skill": "Clustering",
      "type": "skill",
      "category": "Systems / Ops / DBA"
    }, {
      "skill": "Database Administration",
      "type": "skill",
      "category": "Systems / Ops / DBA"
    }, {
      "skill": "Distributed Computing / Virtualisation",
      "type": "skill",
      "category": "Systems / Ops / DBA"
    }, {
      "skill": "Firewalls",
      "type": "skill",
      "category": "Systems / Ops / DBA"
    }, {
      "skill": "Information Security",
      "type": "skill",
      "category": "Systems / Ops / DBA"
    }, {
      "skill": "Load Balancers",
      "type": "skill",
      "category": "Systems / Ops / DBA"
    }, {
      "skill": "Network Architecture",
      "type": "skill",
      "category": "Systems / Ops / DBA"
    }, {
      "skill": "Network Engineering",
      "type": "skill",
      "category": "Systems / Ops / DBA"
    }, {
      "skill": "NoSQL",
      "type": "skill",
      "category": "Systems / Ops / DBA"
    }, {
      "skill": "Security Analysis",
      "type": "skill",
      "category": "Systems / Ops / DBA"
    }, {
      "skill": "Switches / Routers",
      "type": "skill",
      "category": "Systems / Ops / DBA"
    }, {
      "skill": "Systems Engineering",
      "type": "skill",
      "category": "Systems / Ops / DBA"
    }, {
      "skill": "Systems Infrastructure",
      "type": "skill",
      "category": "Systems / Ops / DBA"
    }, {
      "skill": "Mac OSX Admin",
      "type": "tool",
      "category": "Systems / Ops / DBA"
    }, {
      "skill": "MySQL DBA",
      "type": "tool",
      "category": "Systems / Ops / DBA"
    }, {
      "skill": "Oracle DBA",
      "type": "tool",
      "category": "Systems / Ops / DBA"
    }, {
      "skill": "Postgres DBA",
      "type": "tool",
      "category": "Systems / Ops / DBA"
    }, {
      "skill": "SQLServer DBA",
      "type": "tool",
      "category": "Systems / Ops / DBA"
    }, {
      "skill": "Systems Administration - Unix / Linux",
      "type": "tool",
      "category": "Systems / Ops / DBA"
    }, {
      "skill": "Systems Administration - Windows",
      "type": "tool",
      "category": "Systems / Ops / DBA"
    }, {
      "skill": "Vmware",
      "type": "tool",
      "category": "Systems / Ops / DBA"
    }, {
      "skill": "Agile",
      "type": "skill",
      "category": "BA / Digital Marketing"
    }, {
      "skill": "Business Analysis",
      "type": "skill",
      "category": "BA / Digital Marketing"
    }, {
      "skill": "Content Marketing",
      "type": "skill",
      "category": "BA / Digital Marketing"
    }, {
      "skill": "Data Analysis",
      "type": "skill",
      "category": "BA / Digital Marketing"
    }, {
      "skill": "Digital Marketing",
      "type": "skill",
      "category": "BA / Digital Marketing"
    }, {
      "skill": "Information Architecture",
      "type": "skill",
      "category": "BA / Digital Marketing"
    }, {
      "skill": "Project Management",
      "type": "skill",
      "category": "BA / Digital Marketing"
    }, {
      "skill": "Search Engine Optimisation (SEO)",
      "type": "skill",
      "category": "BA / Digital Marketing"
    }, {
      "skill": "Statistics",
      "type": "skill",
      "category": "BA / Digital Marketing"
    }, {
      "skill": "Adwords",
      "type": "tool",
      "category": "BA / Digital Marketing"
    }, {
      "skill": "Google Analytics",
      "type": "tool",
      "category": "BA / Digital Marketing"
    }];
  }  
}
