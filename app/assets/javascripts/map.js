var makeMap = {
    d3PlotPoints: function(dataset) {
        var w = 1000;
        var h = 1000;

        var color = d3.scale.category20c();

        var projection = d3.geo.mercator() 
            .center([-73.877220, 40.687635]) 
            .scale(255000) 
            .translate([752.2, 687.5]);

        var svg = d3.select(".d3-object")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

        var size = d3.scale.linear()
            .domain([1, 300])
            .range([5, 40]);

        var bigger = d3.scale.linear()
            .domain([1, 300])
            .range([20, 60]);

        svg.selectAll("dot")
            .data(dataset)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .style("opacity", 0.8)
            .attr("transform", function(d){
                return "translate(" + projection([d[0], d[1]]) + ")";
            })
            .attr("r", function(d) {
                return size(d[2]);
            })
            .style("fill", function(d) {
                return color(d[2]);
            })
            .attr("stroke-width", 1).attr("stroke", function(d) {
                return d3.rgb(color(d[2])).brighter();
            });

        var div = d3.select(".d3-object").append("div")
            .style("position", "absolute")
            .style("text-align", "left")
            .style("background", "white")
            .style("border-radius", "4px")
            .style("padding", "10px")
            .style("padding-top", "5px")
            .style("border", "solid 1px #DBDCDE")
            .style("opacity", 0);

        var popup = d3.select(".d3-object").append("div")
            .style("position", "absolute")
            .style("text-align", "left")
            .style("background", "white")
            .style("border-radius", "4px")
            .style("padding", "10px")
            .style("padding-top", "5px")
            .style("border", "solid 1px #B8DBFC")
            .style("opacity", 0);

        function mouseover(d) {
            d3.select(this)
                .transition()
                .ease("elastic")
                .attr("r", bigger(d[2]))
                .attr("stroke-width", 1).attr("stroke", function(d) {
                    return d3.rgb(color(d[2])).darker();
                })
                .duration(500);

            div.html("<h4>" + d[3] + "</h4>" +  "<hr><h6>" + d[4] +"</h6>")
                .style("left", (d3.event.pageX + 9) + "px")
                .style("top", (d3.event.pageY - 43) + "px");
            div.transition()
                .style("visibility", "visible")
                .style("opacity", 1)
                .duration(500);
        }

        function mouseout(d) {
            d3.select(this)
                .transition()
                .ease("elastic")
                .attr("stroke-width", 1).attr("stroke", function(d) {
                    return d3.rgb(color(d[2])).brighter();
                })
                .attr("r", size(d[2]))
                .duration(1000);
            div.transition()
                .style("opacity", 1e-6)
                .style("visibility", "hidden")
                .duration(1000);
    }

        function mousedown(d) {
            d3.select(this)
                .transition()
                .ease("elastic")
                .attr("r", bigger(d[2]*1.4))
                .attr("stroke-width", 1).attr("stroke", function(d) {
                  return d3.rgb(color(d[2])).darker();
                })
                .duration(500);
            div.transition()
                .style("opacity", 1e-6)
                .style("visibility", "hidden")
                .duration(1000);

            popup.html("<h4>" + d[3] + "</h4>" +  "<hr><h6>" + d[4] + "</h6>" + d[7] + " " + d[8] + "<br>" + "New York, NY " + d[11] + "<br><a href=" + d[6] + " target=/'blank/'>" + d[6] + "</a>")
                .style("left", (d3.event.pageX + 19) + "px")
                .style("top", (d3.event.pageY - 43) + "px");
            popup.transition()
                .style("visibility", "visible")
                .style("opacity", 1)
                .duration(500);
        }

        d3.selectAll(".dot")
            .on("mouseover", mouseover)
            .on("mouseout", mouseout)
            .on("mousedown", mousedown);
    }
};