Derived data are already provided in the derived folder, in json format. 
They have been generated with:

    cd sot-skills-report/data
    parse-csv.es6.js tsv
    // parse-csv.es6.js csv
    // parse-csv.es6.js json


To explore data, group them in different ways,  you should be able to use excel or open office. Try the `pivot table`  functionality. See [Data Pilots (Pivot Tables) in OpenOffice Calc](http://openoffice.blogs.com/openoffice/2006/11/data_pilots_in_.html) for a tutorial. 

If you want to do it the programmatic way, you can use the [array-nester](https://github.com/widged/array-nester-es6) package available on my account. 

For instance, to list the 10 most common skills
    
    let skills = importSkills();  // read skills.tsv, split by line, split by '\t'

    let legend = "10 most common skills for each proficiency level";
    let nester = return new Nester()
                    .key({label: (d) => { return d[0]; }})
                    .key({label: (d) => { return d[1]; }, sortValues: (a, b) => {return b - a; }})
                    .rollup(function(leaves) { return leaves.length; });

    console.log(`---- ${legend} -----`);
    var top10 = nester.nest(skills).map(({key, values}) => { 
        let skillStr = values.slice(0,10).map(({key, values}) => `${key}, ${values}`).join('; ');
        return {[key]: skillStr};
    });
    console.log(JSON.stringify(top10, null, 2));
