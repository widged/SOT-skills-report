/* jshint esnext: true */


// -------------------------
class FN {

  static get_distinct_values(nodes, keyName, keySortFn) {
    var allValues, distinctValues, key, value;
    allValues = {};
    nodes.forEach(function(d) {
        var value = d.original[keyName];
        allValues[value] = true;
    });
    distinctValues = [];
    for (key in allValues) {
      value = allValues[key];
      distinctValues.push(key);
    }
    distinctValues.sort(keySortFn(keyName));
    return distinctValues;
  }  
}


// -------------------------
class Svg {

  static listenForSelection({circles, circleStyle, onItemSelection}) {
    if(circles === undefined) { return; }
    if(typeof onItemSelection !== 'function') { onItemSelection = function() {}; }
    let {defaultStrokeColor, selectedStrokeColor, radius} = circleStyle;
      circles.on("mouseover", function(d, i) { 
        d3.select(this)
           .attr("r", radius + 2)
            .attr("stroke-width", 3)
           .attr("stroke", selectedStrokeColor);
        onItemSelection(d.original, {cx: Math.round(d.x), cy: Math.round(d.y)}); 
      })
      .on("mouseout", function(d, i)  { 
        d3.select(this)
           .attr("r", radius)
            .attr("stroke-width", 1)
          .attr("stroke", defaultStrokeColor);

        onItemSelection(); 
      });
  }
  static mountVis(div, width, height) {
    var svg = d3.select(div).append("svg");
    svg.attr("width", width)
      .attr("height", height);
    return svg;
  }

  static appendCircles({vis, data, circleStyle, width, height}) {

    let svg = vis;
    let {defaultStrokeColor, selectedStrokeColor, fillColor, radius} = circleStyle;

    var nodes = data.map(function(d, i) {
        return {
          id: i,
          original: d,
          radius: radius,
          x: Math.random() * width,
          y: Math.random() * height
        };
    });

    var circles = svg.append('g').selectAll("circle")
      .data(nodes, function(d) { return d.id; });

    circles.enter().append("circle")
      .attr("r", radius * 3)
      .attr("stroke-width", 1)
      .attr("stroke",  defaultStrokeColor)
      .attr("opacity", 0)
      .style("fill", function(d) { return fillColor; })
      .attr("id", function(d) { return "b_" + d.id; });

    circles.transition()
      .duration(2000)
      .attr("opacity", 1)
      .attr("r", function(d) { return d.radius; });

    var force = d3.layout.force().nodes(nodes).size([width, height]);
    circles.call(force.drag);

    return {nodes, circles, force};
  }

  static getGroupData({distinctValues, width, height}) {
      if (!distinctValues || !distinctValues.length || distinctValues[0] === "undefined") {
        return [{label: '', cx: width / 2, cy: height / 2 }];
      }

      let center = { cx: width / 2, cy: height / 2 };
      var numCenters     = distinctValues.length;
      var sp = 200;
      return distinctValues.map(function(d, i) {
          var x_position = (((width - (sp*2)) * (i + 0)) / (numCenters-1) + sp);
          return {label: d, cx: x_position, cy: center.cy};
      });
  }

  static removeTopLabels(svg) {
      svg.selectAll(".top-labels").remove();
  }

  static addTopLabels(svg, group_data) {
    // add labels atop each group
    svg.selectAll(".top-labels").remove();

    var labels = svg.append('g')
      .attr("class", "top-labels")
      .selectAll("g")
      .data(group_data);

    var g = labels.enter()
        .append("g")
        .attr("text-anchor", "start")
        .attr("transform",function({cx}) {  return `translate(${cx},100)rotate(-35)`; });

        g.append("text").attr('fill', 'white').attr('stroke', 'white').attr('stroke-width', '3').text(function({label}) { return label; });
        g.append("text").text(function({label}) { return label; });
    return labels;
  }

}

// -------------------------
class LayoutUtils {

  static moveTowardsGroupCenter({alpha, width, height, damper, group_data, keyName}) {
    let centersMap = group_data.reduce((acc, d) => { acc[d.label] = d; d.actual = []; return acc; }, {});

    return function(d) {
      let value = d.original[keyName];
      let center = centersMap[value || ''];
      d.x = d.x + (center.cx - d.x) * (damper + 0.02) * alpha * 1.1;
      d.y = d.y + (center.cy - d.y) * (damper + 0.02) * alpha * 1.1;
      center.actual.push({cx: d.x, cy: d.y});
    };
  }

  static charge(d) {
    return (d.radius !== 0)  ? -Math.pow(d.radius, 2) : 0;
  }  

}

// -------------------------
export default class BubbleChart  {

  constructor() {
    this.state = {
      width:      1000,
      height:      600,
      forceGravity: -0.01,
      damper:        0.5
    };

    let {width, height} = this.state;
    var div = document.createElement('div');
    let vis = Svg.mountVis(div, width, height);
    this.state.div = div;
    this.state.vis = vis;
  }

  // public accessors

  keySortFn(_) {
    this.state.keySortFn = _;
    return this;
  }

  circleStyle(_) {
    if(!arguments.length) { return this.state.circleStyle; }
    this.state.circleStyle = _;
    return this;
  }

  mountIn(node) {
    let {div} = this.state;
    node.appendChild(div);
    return this;
  }

  plot(data) {
    let {vis, width, height, circleStyle, onItemSelection} = this.state;
    let {circles, nodes, force} = Svg.appendCircles({vis, data, circleStyle, width, height});
    Svg.listenForSelection({circles, circleStyle, onItemSelection: onItemSelection});
    Object.assign(this.state, {force, nodes, vis, circles});
    return this;
  }

  onItemSelection(_) {
    let {circles, circleStyle} = this.state;
    this.state.onItemSelection = _;
    Svg.listenForSelection({circles, circleStyle, onItemSelection: _});
    return this;
  }

  color_by(keyName, getColorFn) {
    let {nodes, circles, keySortFn} = this.state;
    var distinctValues = FN.get_distinct_values(nodes, keyName, keySortFn);
    let colorFn        = getColorFn(keyName, distinctValues);
    let duration = (!keyName || !keyName.length) ? 1500 : 1000;
    circles.transition().duration(duration).style("fill", function(d) {
        return colorFn(d.original[keyName]);
    }); 
    return this;     
  }

  group_by(keyName) {

    let {width, height, forceGravity, damper, force, nodes, vis, circles, keySortFn} = this.state;
    var distinctValues = FN.get_distinct_values(nodes, keyName, keySortFn);
    let group_data = Svg.getGroupData({distinctValues, width, height});
    Svg.removeTopLabels(vis);
    var labels = Svg.addTopLabels(vis, group_data);

    var tickCount = 0;
    force.gravity(forceGravity).charge(LayoutUtils.charge).friction(0.9).on("tick", function(e) {
      tickCount++;
      circles
        .each(LayoutUtils.moveTowardsGroupCenter({alpha: e.alpha, width, height, damper, group_data, keyName}))
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });

    if((tickCount < 5) || (tickCount % 10 == 0 && tickCount < 200)) {
    labels.attr("transform",function({cx, actual}) {  
        let cxstats = actual.reduce(function(acc, {cx,cy}) { acc.sum += cx, acc.n +=1; return acc; } ,{sum: 0, n: 0});
        let avg = cxstats.n ? Math.round(cxstats.sum / cxstats.n) : 0;
        return `translate(${avg},100)rotate(-35)`;
        // console.log(actual)
      });
    }

        
    });
    force.start();
    return this;     
  }
  

  use_filters(filters) {
    // not currently in use
    let {circleStyle, force, nodes, circles} = this.state;
    let {radius} = circleStyle;
    nodes.forEach(function(d) {
        d.radius = radius;
        filters.discrete.forEach(function(filter) {
          var value = d.original[filter.target];
          if (filter.removeValues[value] !== null) {
            d.radius = 0;
          }
        });
      });
    force.start();
    circles.transition().duration(2000).attr("r", function(d) {
      return d.radius;
    });
    return this;
  }

}