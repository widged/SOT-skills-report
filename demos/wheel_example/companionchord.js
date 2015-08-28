var r1 = 900 / 2,
    r0 = r1 - 200;

var chord = d3.layout.chord()
    .padding(0.02)
    .sortSubgroups(d3.descending)
    .sortChords(d3.descending);

var arc = d3.svg.arc()
    .innerRadius(r0)
    .outerRadius(r0 + 20);

var svg = d3.select("body").append("svg")
    .attr("width", r1 * 2)
    .attr("height", r1 * 2)
  .append("g")
    .attr("transform", "translate(" + r1 + "," + r1 + ")");

/** Returns an event handler for fading a given chord group. */
function fade(opacity) {
  return function(g, i) {
    svg.selectAll("g path.chord")
        .filter(function(d) {
          return d.source.index != i && d.target.index != i;
        })
      .transition()
        .style("opacity", opacity);
  };
}
  
function draw(companions) {
  var indexByName = {},
      nameByIndex = {},
      matrix = [],
      n = 0;

  // Compute a unique index for each name.
  var families= {},
      f = 0,
      indexInFamily = 0,
      familyHue = 0,
      hueStep = 26;
  companions.forEach(function(d) {
    p = d.name;
    console.log();
    if(!families[d.family] || !families[d.family].color) {
      f++;
      var hSaturation = (f % 2 !== 0)  ? 0.5 : 0.9;
      var hLightness  = (f % 2 !== 0)  ? 0.5 : 0.9;
      indexInFamily = 1;
      families[d.family] = {name: d.family,color: d3.hsl(familyHue, hSaturation, hLightness)}; familyHue+= hueStep;
    }
    else
    {
      indexInFamily++;
    }
    var baseColor = families[d.family].color;
    // var ramp=d3.scale.linear().domain([0,6]).range(["#fdfdfd",baseColor]);
    d.recolor = d3.rgb(baseColor); // d3.rgb(ramp(indexInFamily));

    if (!(d in indexByName)) {
      nameByIndex[n] = p;
      indexByName[p] = n++;
    }
  });

  // Construct a square matrix counting relationships.
  companions.forEach(function(d) {
    var source = indexByName[d.name],
        row = matrix[source];
    if (!row) {
     row = matrix[source] = [];
     for (var i = -1; ++i < n;) row[i] = 0;
    }
    d.companions.forEach(function(d) { row[indexByName[d]]++; });
  });

  chord.matrix(matrix);

  var g = svg.selectAll("g.group")
      .data(chord.groups)
    .enter().append("g")
      .attr("class", "group");

  g.append("path")
      .style("fill", function(d, i) { return companions[i].recolor; })
      .style("stroke", function(d, i) { return companions[i].recolor.darker(); })
      .attr("d", arc)
      .on("mouseover", fade(0.1))
      .on("mouseout", fade(1));
      
  
  g.append("text")
      .each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
      .attr("dy", ".35em")
      .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
      .attr("transform", function(d) {
        return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
            + "translate(" + (r0 + 26) + ")"
            + (d.angle > Math.PI ? "rotate(180)" : "");
      })
      .text(function(d) { return nameByIndex[d.index]; });

  svg.selectAll("path.chord")
      .data(chord.chords)
    .enter().append("path")
      .attr("class", "chord")
      .style("stroke", function(d, i) { return companions[d.source.index].recolor.darker(); })
      .style("fill", function(d, i) { return companions[d.source.index].recolor; })
      .attr("d", d3.svg.chord().radius(r0));

}

jsonp_companions(draw);
