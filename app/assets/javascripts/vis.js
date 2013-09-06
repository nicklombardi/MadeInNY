var BubbleChart, root,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

BubbleChart = (function() {

  function BubbleChart(data) {
    this.hide_details = __bind(this.hide_details, this);

    this.show_details = __bind(this.show_details, this);

    this.hide_categories = __bind(this.hide_categories, this);

    this.display_categories = __bind(this.display_categories, this);

    this.move_towards_category = __bind(this.move_towards_category, this);

    this.display_by_category = __bind(this.display_by_category, this);

    this.move_towards_center = __bind(this.move_towards_center, this);

    this.display_group_all = __bind(this.display_group_all, this);

    this.start = __bind(this.start, this);

    this.create_vis = __bind(this.create_vis, this);

    this.create_nodes = __bind(this.create_nodes, this);

    var max_amount;
    this.data = data;
    this.width = 600;
    this.height = 400;
    this.tooltip = CustomTooltip("pulse_tooltip", 240);
    this.center = {
      x: this.width / 2,
      y: this.height / 2
    };
    this.category_centers = {
      "Advertising": {
        x: this.width / 4,
        y: this.height / 2
      },
      "Tech": {
        x: this.width / 3,
        y: this.height / 2
      },
      "Education": {
        x: this.width / 2,
        y: this.height / 2
      },
      "Ecommerce": {
        x: 2 * this.width / 3.1,
        y: this.height / 2
      },
      "Other": {
        x: 2 * this.width / 2.5,
        y: this.height / 2
      }
    };
    this.layout_gravity = -0.01;
    this.damper = 0.1;
    this.vis = null;
    this.nodes = [];
    this.force = null;
    this.circles = null;
    this.fill_color = d3.scale.category20c();
    max_amount = d3.max(this.data, function(d) {
      return parseInt(d.total_amount);
    });
    this.radius_scale = d3.scale.pow().exponent(0.5).domain([0, max_amount]).range([2, 85]);
    this.create_nodes();
    this.create_vis();
  }

  BubbleChart.prototype.create_nodes = function() {
    var _this = this;
    this.data.forEach(function(d) {
      var node;
      node = {
        id: d.id,
        radius: _this.radius_scale(parseInt(d.total_amount)),
        value: d.total_amount,
        name: d.name,
        org: d.twitter_username,
        group: d.group,
        category: d.category_code,
        x: Math.random() * 900,
        y: Math.random() * 800
      };
      return _this.nodes.push(node);
    });
    return this.nodes.sort(function(a, b) {
      return b.value - a.value;
    });
  };

  BubbleChart.prototype.create_vis = function() {
    var that,
      _this = this;
    this.vis = d3.select("#vis").append("svg").attr("width", this.width).attr("height", this.height).attr("id", "svg_vis");
    this.circles = this.vis.selectAll("circle").data(this.nodes, function(d) {
      return d.id;
    });
    that = this;
    this.circles.enter().append("circle").attr("r", 0).attr("fill", function(d) {
      return _this.fill_color(d.value);
    }).attr("stroke-width", 2).attr("stroke", function(d) {
      return d3.rgb(_this.fill_color(d.value)).brighter();
    }).attr("id", function(d) {
      return "bubble_" + d.id;
    }).style("opacity", "0.8").on("mouseover", function(d, i) {
      return that.show_details(d, i, this);
    }).on("mouseout", function(d, i) {
      return that.hide_details(d, i, this);
    });
    return this.circles.transition().duration(2000).attr("r", function(d) {
      return d.radius;
    });
  };

  BubbleChart.prototype.charge = function(d) {
    return -Math.pow(d.radius, 2.0) / 8;
  };

  BubbleChart.prototype.start = function() {
    return this.force = d3.layout.force().nodes(this.nodes).size([this.width, this.height]);
  };

  BubbleChart.prototype.display_group_all = function() {
    var _this = this;
    this.force.gravity(this.layout_gravity).charge(this.charge).friction(0.9).on("tick", function(e) {
      return _this.circles.each(_this.move_towards_center(e.alpha)).attr("cx", function(d) {
        return d.x;
      }).attr("cy", function(d) {
        return d.y;
      });
    });
    this.force.start();
    return this.hide_categories();
  };

  BubbleChart.prototype.move_towards_center = function(alpha) {
    var _this = this;
    return function(d) {
      d.x = d.x + (_this.center.x - d.x) * (_this.damper + 0.02) * alpha;
      return d.y = d.y + (_this.center.y - d.y) * (_this.damper + 0.02) * alpha;
    };
  };

  BubbleChart.prototype.display_by_category = function() {
    var _this = this;
    this.force.gravity(this.layout_gravity).charge(this.charge).friction(0.9).on("tick", function(e) {
      return _this.circles.each(_this.move_towards_category(e.alpha)).attr("cx", function(d) {
        return d.x;
      }).attr("cy", function(d) {
        return d.y;
      });
    });
    this.force.start();
    return this.display_categories();
  };

  BubbleChart.prototype.move_towards_category = function(alpha) {
    var _this = this;
    return function(d) {
      var target;
      target = _this.category_centers[d.category];
      d.x = d.x + (target.x - d.x) * (_this.damper + 0.02) * alpha * 1.1;
      return d.y = d.y + (target.y - d.y) * (_this.damper + 0.02) * alpha * 1.1;
    };
  };

  BubbleChart.prototype.display_categories = function() {
    var categories, categories_data, categories_x,
      _this = this;
    categories_x = {
      "Advertising": 60,
      "Tech": this.width / 3.3,
      "Education": this.width / 2,
      "Ecommerce": this.width / 1.4,
      "Other": this.width - 60
    };
    categories_data = d3.keys(categories_x);
    categories = this.vis.selectAll(".categories").data(categories_data);
    return categories.enter().append("text").attr("class", "categories").attr("x", function(d) {
      return categories_x[d];
    }).attr("y", 40).attr("text-anchor", "middle").text(function(d) {
      return d;
    });
  };

  BubbleChart.prototype.hide_categories = function() {
    var categories;
    return categories = this.vis.selectAll(".categories").remove();
  };

  BubbleChart.prototype.show_details = function(data, i, element) {
    var content,
      _this = this;
    d3.select(element).attr("stroke", function(d) {
      return d3.rgb(_this.fill_color(d.value)).darker();
    });
    content = "<span class=\"name\"></span><span class=\"value\"> <h3>" + data.name + "</h3></span><hr>";
    content += "<span class=\"name\">Pulse:</span><span class=\"value\"> " + data.value + "</span><br/>";
    content += "<span class=\"name\">Sector:</span><span class=\"value\"> " + data.category + "</span>";
    return this.tooltip.showTooltip(content, d3.event);
  };

  BubbleChart.prototype.hide_details = function(data, i, element) {
    var _this = this;
    d3.select(element).attr("stroke", function(d) {
      return d3.rgb(_this.fill_color(d.group)).brighter();
    });
    return this.tooltip.hideTooltip();
  };

  return BubbleChart;

})();

root = typeof exports !== "undefined" && exports !== null ? exports : this;

$(function() {
  var chart, render_vis,
    _this = this;
  chart = null;
  render_vis = function(csv) {
    chart = new BubbleChart(csv);
    chart.start();
    return root.display_all();
  };
  root.display_all = function() {
    return chart.display_group_all();
  };
  root.display_category = function() {
    return chart.display_by_category();
  };
  root.toggle_view = function(view_type) {
    if (view_type === 'category') {
      return root.display_category();
    } else {
      return root.display_all();
    }
  };
  return d3.csv("assets/pulse.csv", render_vis);
});
