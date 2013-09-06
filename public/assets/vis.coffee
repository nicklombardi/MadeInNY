
class BubbleChart
  constructor: (data) ->
    @data = data
    @width = 600
    @height = 400

    @tooltip = CustomTooltip("pulse_tooltip", 240)

    # locations the nodes will move towards
    # depending on which view is currently being
    # used
    @center = {x: @width / 2, y: @height / 2}
    @category_centers = {
      "Advertising": {x: @width / 4, y: @height / 2},
      "Tech": {x: @width / 3, y: @height / 2},
      "Education": {x: @width / 2, y: @height / 2},
      "Ecommerce": {x: 2 * @width / 3.25, y: @height / 2},
      "Other": {x: 2 * @width / 2.7, y: @height / 2}
    }

    # used when setting up force and
    # moving around nodes
    @layout_gravity = -0.01
    @damper = 0.1

    # these will be set in create_nodes and create_vis
    @vis = null
    @nodes = []
    @force = null
    @circles = null

    # nice looking colors - no reason to buck the trend
    @fill_color = d3.scale.category20c()

    # use the max total_amount in the data as the max in the scale's domain
    max_amount = d3.max(@data, (d) -> parseInt(d.total_amount))
    @radius_scale = d3.scale.pow().exponent(0.5).domain([0, max_amount]).range([2, 85])

    this.create_nodes()
    this.create_vis()

  # create node objects from original data
  # that will serve as the data behind each
  # bubble in the vis, then add each node
  # to @nodes to be used later
  create_nodes: () =>
    @data.forEach (d) =>
      node = {
        id: d.id
        radius: @radius_scale(parseInt(d.total_amount))
        value: d.total_amount
        name: d.name
        org: d.twitter_username
        group: d.group
        category: d.category_code
        x: Math.random() * 900
        y: Math.random() * 800
      }
      @nodes.push node

    @nodes.sort (a,b) -> b.value - a.value


  # create svg at #vis and then
  # create circle representation for each node
  create_vis: () =>
    @vis = d3.select("#vis").append("svg")
      .attr("width", @width)
      .attr("height", @height)
      .attr("id", "svg_vis")

    @circles = @vis.selectAll("circle")
      .data(@nodes, (d) -> d.id)

    # used because we need 'this' in the
    # mouse callbacks
    that = this

    # radius will be set to 0 initially.
    # see transition below
    @circles.enter().append("circle")
      .attr("r", 0)
      .attr("fill", (d) => @fill_color(d.value))
      .attr("stroke-width", 2)
      .attr("stroke", (d) => d3.rgb(@fill_color(d.value)).brighter())
      .attr("id", (d) -> "bubble_#{d.id}")
      .style("opacity", "0.8")
      .on("mouseover", (d,i) -> that.show_details(d,i,this))
      .on("mouseout", (d,i) -> that.hide_details(d,i,this))

    # Fancy transition to make bubbles appear, ending with the
    # correct radius
    @circles.transition().duration(2000).attr("r", (d) -> d.radius)


  # Charge function that is called for each node.
  # Charge is proportional to the diameter of the
  # circle (which is stored in the radius attribute
  # of the circle's associated data.
  # This is done to allow for accurate collision
  # detection with nodes of different sizes.
  # Charge is negative because we want nodes to
  # repel.
  # Dividing by 8 scales down the charge to be
  # appropriate for the visualization dimensions.
  charge: (d) ->
    -Math.pow(d.radius, 2.0) / 8

  # Starts up the force layout with
  # the default values
  start: () =>
    @force = d3.layout.force()
      .nodes(@nodes)
      .size([@width, @height])

  # Sets up force layout to display
  # all nodes in one circle.
  display_group_all: () =>
    @force.gravity(@layout_gravity)
      .charge(this.charge)
      .friction(0.9)
      .on "tick", (e) =>
        @circles.each(this.move_towards_center(e.alpha))
          .attr("cx", (d) -> d.x)
          .attr("cy", (d) -> d.y)
    @force.start()

    this.hide_categories()

  # Moves all circles towards the @center
  # of the visualization
  move_towards_center: (alpha) =>
    (d) =>
      d.x = d.x + (@center.x - d.x) * (@damper + 0.02) * alpha
      d.y = d.y + (@center.y - d.y) * (@damper + 0.02) * alpha

  # sets the display of bubbles to be separated
  # into each category. Does this by calling move_towards_category
  display_by_category: () =>
    @force.gravity(@layout_gravity)
      .charge(this.charge)
      .friction(0.9)
      .on "tick", (e) =>
        @circles.each(this.move_towards_category(e.alpha))
          .attr("cx", (d) -> d.x)
          .attr("cy", (d) -> d.y)
    @force.start()

    this.display_categories()

  # move all circles to their associated @category_centers
  move_towards_category: (alpha) =>
    (d) =>
      target = @category_centers[d.category]
      d.x = d.x + (target.x - d.x) * (@damper + 0.02) * alpha * 1.1
      d.y = d.y + (target.y - d.y) * (@damper + 0.02) * alpha * 1.1

  # Method to display category titles
  display_categories: () =>
    categories_x = {"Advertising":60, "Tech": @width / 3.3, "Education": @width / 2, "Ecommerce": @width / 1.4, "Other": @width - 60}
    categories_data = d3.keys(categories_x)
    categories = @vis.selectAll(".categories")
      .data(categories_data)

    categories.enter().append("text")
      .attr("class", "categories")
      .attr("x", (d) => categories_x[d] )
      .attr("y", 40)
      .attr("text-anchor", "middle")
      .text((d) -> d)

  # Method to hide category titiles
  hide_categories: () =>
    categories = @vis.selectAll(".categories").remove()

  show_details: (data, i, element) =>
    d3.select(element).attr("stroke", (d) => d3.rgb(@fill_color(d.value)).darker())
    content = "<span class=\"name\"></span><span class=\"value\"> <h3>#{data.name}</h3></span><hr>"
    content +="<span class=\"name\">Pulse:</span><span class=\"value\"> #{data.value}</span><br/>"
    content +="<span class=\"name\">Sector:</span><span class=\"value\"> #{data.category}</span>"
    @tooltip.showTooltip(content,d3.event)


  hide_details: (data, i, element) =>
    d3.select(element).attr("stroke", (d) => d3.rgb(@fill_color(d.group)).brighter())
    @tooltip.hideTooltip()


root = exports ? this

$ ->
  chart = null

  render_vis = (csv) ->
    chart = new BubbleChart csv
    chart.start()
    root.display_all()
  root.display_all = () =>
    chart.display_group_all()
  root.display_category= () =>
    chart.display_by_category()
  root.toggle_view = (view_type) =>
    if view_type == 'category'
      root.display_category()
    else
      root.display_all()

  d3.csv "assets/pulse.csv", render_vis
