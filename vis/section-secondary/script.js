function draw_skills_bubbles(data) {

  data = data.children[0]

  var w = 1280,
    h = 800,
    r = 720  / 3,
    x = d3.scale.linear().range([0, r]),
    y = d3.scale.linear().range([0, r]),
    node,
    root;

  // Define the div for the tooltip
  var div = d3.select("skill-bubbles").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  var pack = d3.layout.pack()
    .size([r, r])
    .value(function(d) { return d.size; });

  var vis = d3.select("skill-bubbles").insert("svg:svg", "h2")
    .attr("width", w)
    .attr("height", h)
    .append("svg:g")
    .attr("transform", "translate(" + (w - r) / 2 + "," + (h - r) / 2 + ")");

  node = root = data;

  var nodes = pack.nodes(root);

  vis.selectAll("circle")
    .data(nodes)
    .enter().append("svg:circle")

    .attr("class", function(d) { return bubbleClass(d);})
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; })
    .attr("r", function(d) { return d.r; })
    .on("click", function(d) { return zoom(node == d ? root : d); })
    .on("mouseover", function(d) {
      if(d.depth == 1){
        var text = d.name + "<br/>";
        for(var i = 0, size = d.size; i < size ; i++){
          var child = d.children[i];
          text = text + child.value  + "\t" + child.name  + "<br/>";
        }
        div.transition()
        .duration(200)
        .style("opacity", .9);
        div.html(text)
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
      }
    })
    .on("mouseout", function(d) {
      div.transition()
      .duration(500)
      .style("opacity", 0);
    });

  vis.selectAll("text")
    .data(nodes)
    .enter().append("svg:text")
    .attr("class", function(d) { return bubbleClass(d); })
    .attr("x", function(d) { return d.x; })
    .attr("y", function(d) { return d.y; })
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .style("opacity", function(d) { return d.r > 20 ? 1 : 0; })
    .text(function(d) { return bubbleText(d); });

  d3.select(window).on("click", function() { zoom(root); });

  function bubbleText(d){
    if(d.depth == 1){
      return d.name;
    } else if (d.depth != 0){
      return d.name +"\t"+ d.value;
    }
    return "";
  }

  function bubbleClass(d){
    if(d.depth == 0){
      return "root";
    } else if(d.depth == 1){
      return "top_parent";
    } else if (d.depth == 2){
      return "parent";
    } else {
      return "child_"+d.name;
    }
  }

  function zoom(d, i) {
    var k = r / d.r / 2;
    x.domain([d.x - d.r, d.x + d.r]);
    y.domain([d.y - d.r, d.y + d.r]);

    var t = vis.transition()
      .duration(d3.event.altKey ? 7500 : 750);

    t.selectAll("circle")
      .attr("cx", function(d) { return x(d.x); })
      .attr("cy", function(d) { return y(d.y); })
      .attr("r", function(d) { return k * d.r; });

    t.selectAll("text")
      .attr("x", function(d) { return x(d.x); })
      .attr("y", function(d) { return y(d.y); })
      .style("opacity", function(d) { return k * d.r > 20 ? 1 : 0; });

    node = d;
    d3.event.stopPropagation();
  }
  
}
