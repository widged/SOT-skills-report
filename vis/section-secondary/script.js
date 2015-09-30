function draw_skills_bubbles(data, node) {

  var r = 720  / 3,
    w = (r+10) * 5,
    h = 400,
    x = d3.scale.linear().range([0, r]),
    y = d3.scale.linear().range([0, r]),
    zoomNode,
    root;


  // Define the div for the tooltip
  var div = d3.select(node).append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  var pack = d3.layout.pack()
    .size([r, r])
    .value(function(d) { return d.size; });

  var vis = d3.select(node).insert("svg:svg", "h2")
    .attr("width", w)
    .attr("height", h)
    .append("svg:g")
    .attr("transform", "translate(" + 0 + "," + 0 + ")");


    jsonp_bubbles.children.forEach(function(d, i) {
      var g = vis.insert("svg:g");
      g.attr("transform", "translate(" + (i * (r + 10)) + "," + 0 + ")");
      g.attr("data-left", (i * (r + 10)));
      g.attr("class", d.name.split(/\s+/)[0].toLowerCase() );
      drawCategory(d, g);
    });


  function drawCategory(root, g) {

      zoomNode = root;

      var nodes = pack.nodes(root);

      g.selectAll("circle")
        .data(nodes)
        .enter().append("svg:circle")

        .attr("class", bubbleClass)
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("r",  function(d) { return d.r; })
        // .style('pointer-events', function(d) { return (d.depth === 1) ? 'auto' : 'none'; })
        // .style('cursor', function(d) { return (d.depth === 2) ? 'pointer' : 'default'; })
        .on("click", function(d) { return zoom(zoomNode == d ? root : d); })
        .on("mouseover", function(d) {
          if(d.depth === 1){
            var lines = d.children.map(function(d) { return [d.value, d.name].join('\t'); });
            lines.unshift(d.name);
            div.transition()
              .duration(200)
              .style("opacity", 0.9);

              var groupLeft = parseInt(this.parentNode.getAttribute('data-left'), 10);
            div.html(lines.join("<br/>"))
              .style("left", (groupLeft + parseInt(this.getAttribute('cx'))) + "px")
              .style("top", (this.getAttribute('cy') - 28) + "px");
          }
        })
        .on("mouseout", function(d) {
          div.transition()
          .duration(500)
          .style("opacity", 0);
        });

      g.selectAll("text")
        .data(nodes)
        .enter().append("svg:text")
        .attr("class", bubbleClass)
        .attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y; })
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .style("opacity", function(d) { return d.r > 20 ? 1 : 0; })
        .text(function(d) { return bubbleText(d); });

      d3.select(window).on("click", function() { zoom(root); });

      function bubbleText(d){
        if(d.depth === 1){
          return d.name;
        } else if (d.depth !== 0){
          return d.name +"\t"+ d.value;
        }
        return "";
      }

      function bubbleClass(d){
        if(d.depth === 0){
          return "root";
        } else if(d.depth === 1){
          return "top_parent";
        } else {
          return "child_"+d.name;
        }
      }

      function zoom(d, i) {
        var k = r / d.r / 2;
        x.domain([d.x - d.r, d.x + d.r]);
        y.domain([d.y - d.r, d.y + d.r]);

        var t = g.transition()
          .duration(d3.event.altKey ? 7500 : 750);

        t.selectAll("circle")
          .attr("cx", function(d) { return x(d.x); })
          .attr("cy", function(d) { return y(d.y); })
          .attr("r", function(d) { return k * d.r; });

        t.selectAll("text")
          .attr("x", function(d) { return x(d.x); })
          .attr("y", function(d) { return y(d.y); })
          .style("opacity", function(d) { return k * d.r > 20 ? 1 : 0; });

        zoomNode = d;
        d3.event.stopPropagation();
      }

  }

  
}
