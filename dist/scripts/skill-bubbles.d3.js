function draw_skills_bubbles(data, node) {

  var r = 900  / 3,
    w = (r+30) * 3,
    h = 640,
    x = d3.scale.linear().range([0, r]),
    y = d3.scale.linear().range([0, r]),
    root;


  // Define the div for the tooltip
  var tooltip = d3.select(node).append("item-tooltip")
    .attr("class", "tooltip")
    .style("opacity", 0);

  var pack = d3.layout.pack()
    .size([r, r])
    .value(function(d) { return d.size; });

  var vis = d3.select(node).insert("svg:svg", "h2")
    .attr("width", w)
    .attr("height", h)
    .on("click", function(d) { 
      var pt = d3.mouse(this);
      zoom(pt[0],pt[1]);
    })
/*
    .call(d3.behavior.zoom().on("zoom", function () {
      vis.attr("transform", "translate(" + d3.event.translate + ")") //  + " scale(" + scale + ")"
    }))    
*/
    .append("svg:g")
    .attr("transform", "translate(" + 0 + "," + 0 + ")");

/*

var zoom = d3.behavior.zoom()
    .x(x)
    .y(y)
    .scaleExtent([1, 10])
    .on("zoom", zoomed);

.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(zoom);    
*/    

    var zoomed;
    function zoom(x, y) {
      if(!zoomed) { 
        var scaleFactor = 4;
        var newx = x - scaleFactor * x;
        var newy = y - scaleFactor * y;
        vis
          .transition().duration(750)
          .attr("transform", "translate("+ [newx, newy].join(',') +"),scale("+scaleFactor+")");
        vis
          .classed("zoomed", true);
        zoomed = true;
      } else {
        vis
          .transition().duration(750)
          .attr("transform", "translate(" + [0, 0].join(',') + "),scale(1)");
        vis          
          .classed("zoomed", false);
        zoomed = false;
      }
      d3.event.stopPropagation();
    }

    d3.select(window).on("click", function() { zoom(0,0); });



    data.children.forEach(function(d, i) {
      var left = 30 + (i * (r + 30));
      var top = 0;
      if(i > 2) {
        top = r + 20;
        left = ((4-i) * (r+30)) + r/2;
      }
      var g = vis.insert("svg:g");
      var bubs = g.insert("svg:g");
      g.attr("transform", "translate(" + left + "," + top + ")");
      g.attr("class", d.name.split(/\s+/)[0].toLowerCase() );

      bubs.attr("transform", "translate(" + 0 + "," + 20 + ")");
      bubs.attr("data-left", left);
      bubs.attr("data-top", top);
      if(d.children && d.children.length) {
        drawCategory(d, bubs);
      }

      g.append("svg:text").text(function(x) {
        return d.name;
      })
      .attr("dy", "1em")
      .attr("x", r/2)
      .attr("text-anchor", "middle")
      .style("opacity", 1).classed('category', true);
    });

  function drawCategory(root, g) {

      var nodes = pack.nodes(root);
      nodes.sort(function(a,b) {
        return b.depth - a.depth;
      });

      var node = g.selectAll(".node")
                .data(nodes)
                .enter()
                .append("svg:g")
                .attr("class", function(d) { 
                    var classes = 'node depth-' + d.depth;
                    if(d.depth === 2) { classes += ' level-' + d.name.split(' ')[0].toLowerCase(); }
                    return classes;
                })
                .attr("transform", function(d) { 
                    return "translate(" + Math.round(d.x) + "," + Math.round(d.y) + ")"; 
                })
              .style('pointer-events', function(d) { return (d.depth > 0) ? 'auto' : 'none'; })
              .style('cursor', function(d) { return (d.depth > 0) ? 'pointer' : 'default'; })
        .on("mouseover", function(d) {
          var left = parseInt(this.parentNode.getAttribute('data-left'), 10);
          var top = parseInt(this.parentNode.getAttribute('data-top'), 10);
          if(d.depth === 1){
            var lines = d.children.map(function(d) { return [d.value, d.name].join('\t'); });
            lines.unshift(d.name);
            tooltip.transition().duration(200)
              .style("opacity", 0.9);
            tooltip.html(lines.join("<br/>"))
              .style("left", (left + d.x + 15) + "px")
              .style("top", (top + d.y + 20) + "px");
          }
        })
        .on("mouseout", function(d) {
          tooltip.transition()
          .duration(500)
          .style("opacity", 0);
        });
        
      var circle = node.append("circle")
        .attr("r",  function(d) { return d.r; });

      var text = node.append("svg:text")
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
//        .style("opacity", textOpacity)
        .text(function(d) { 
            if(d.depth === 1){
              return d.name;
            } else if (d.depth !== 0){
              return d.name +" "+ d.value;
            }
            return "";
        });



  }

  
}