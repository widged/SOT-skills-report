/* jshint esnext: true */

class JsonExporter {
  constructor() {}
  line(d, fields) {  
    var o = {};
    for (var i = 0, ni = fields.length; i < ni; i++) {
      o[fields[i]] = d[i];
    }
    return o;
   }

  wrap(lines) {
    return {content: JSON.stringify(lines, null, 2), ext: 'json' };
  }

  dump(list, fields) {
    return this.wrap(list.map((d) => { return  this.line(d, fields); }));
  } 
}

class ValueSeparatedExporter {

  constructor(separator, extension) {
    this.state = {separator: separator, extension: extension};
  }

  line(d) {  
    let {separator} = this.state;
    if(d.indexOf(separator) !== -1) { 
      d = d.replace(/\"^(.*?)\"$/, "$1");
      d = d.replace(/[^\\]\"/g, "\"");
      d = `"${d}"`; 
    }
    return d.join(separator); 
  }

  wrap(lines, fields) {
    let {separator, extension} = this.state;
    lines.unshift(fields.join(separator));
    return {content: lines.join('\n'), ext: extension };
  }

  dump(list, fields) {
    return this.wrap(list.map((d) => { return  this.line(d, fields); }), fields);
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

export default class LinesExporter {
  static getExporter(fmt) {
    let EXPORT_FORMAT = {
      'csv': CrudeCsvExporter, 
      'tsv': CrudeTsvExporter, 
      'json': JsonExporter 
    };
    var ExporterFactory = EXPORT_FORMAT[fmt] || EXPORT_FORMAT.tsv;
    return new ExporterFactory();
  }
}

