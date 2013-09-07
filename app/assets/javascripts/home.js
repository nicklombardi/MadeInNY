// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
var companiesObject,
    // for making dots
    dataset = [],
    // for making new york part of donut
    categories = {
        fashion: 0,
        tech: 0,
        advertising: 0,
        other: 0,
        ecommerce: 0,
        finance: 0,
        education: 0,
        enterprise: 0
    },
    siliconCategories = {
        fashion: 0,
        tech: 0,
        advertising: 0,
        other: 0,
        ecommerce: 0,
        finance: 0,
        education: 0,
        enterprise: 0
    };

// this is just for our knowledge (seeing what the categories are) and how many companies we don't have funding info for
var allCategoriesArray = [],
    numberOfCompaniesWithoutFunding = 0;

var getCompanyData = {
    dataFromDatabase: function() {
        var that = this;
        console.log("going to make ajax request for companies");

        // retrieves data from home controller index action
        // data for dots on map
        $.ajax({
            url: '/home.json',
            dataType: 'json',
            data: 'GET'
        }).done(function (data) {
            console.log("got data from companies database");
            console.log(data);
            companiesObject = data;

            // sorts database descendingly by twitter users
            // correlates well enough to funding to have smaller circles on top
            function compare(a,b) {
              if (a.followers > b.followers)
                 return -1;
              if (a.followers < b.followers)
                return 1;
              return 0;
            }

            data.sort(compare);

            // calls prepDataForD3 function
            that.prepDataForD3(data);
            that.getSiliconData();
        });
    },
    prepDataForD3: function(data) {
        console.log("prepping companies data");
        var i,
            length = data.length,
            fundingString,
            fundingArray,
            thousandOrMillion,
            totalFunding,
            category;

        for(i = 0; i < length; i++) {
            // total_money_raised attribute is currently in format of $6M or $316k
            fundingString = data[i].total_money_raised;
            fundingArray = fundingString.split("$");
            thousandOrMillion = fundingArray[1][fundingArray[1].length - 1];

            // formats funding number based on whether it's in millions or thousands
            if (thousandOrMillion === "k") {
                totalFunding = parseFloat(fundingArray[1]) / 1000;
            } else if (thousandOrMillion === "M") {
                totalFunding = parseFloat(fundingArray[1]);
            } else if (fundingArray[1] === "0") {
                totalFunding = 1;
                numberOfCompaniesWithoutFunding += 1;
            }

            // if (totalFunding < 10) {
            //     totalFunding = totalFunding + 10;
            // } else if (totalFunding > 70) {
            //     totalFunding = 70;
            // }

            // console.log(totalFunding);

            // populates global variable dataset array
            // for dots
            dataset.push([data[i].longitude, data[i].latitude, totalFunding, data[i].name, data[i].description, data[i].followers]);

            // this keeps track of how many companies belong to a category
            category = data[i].category_code;
            allCategoriesArray.push(category);

            if (category === "fashion") {
                categories.fashion += 1;
            } else if ((category === "web") || (category === "search") || (category === "mobile") || (category === "software") || (category === "hardware") || (category === "games_video") || (category === "cleantech") || (category === "social") || (category === "messaging") || (category === "photo_video")) {
                categories.tech += 1;
            } else if ((category === "advertising") || (category === "public_relations")) {
                categories.advertising += 1;
            } else if (category === "ecommerce") {
                categories.ecommerce += 1;
            } else if (category === "finance") {
                categories.finance += 1;
            } else if (category === "education") {
                categories.education += 1;
            } else if (category === "enterprise") {
                categories.enterprise += 1;
            } else {
                categories.other += 1;
            }

        }

        // calls d3PlotPoints function to create points and description divs using global variable dataset
        console.log("creating dots all over the place");
        this.d3PlotPoints(dataset);
    },
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

        function mouseover(d) {
            d3.select(this)
                .transition()
                .ease("elastic")
                .attr("r", bigger(d[2]))
                .attr("stroke-width", 1).attr("stroke", function(d) {
                  return d3.rgb(color(d[2])).darker();
                })
                .duration(500);

            div.html("<h4>" + d[3] + "</h4>" +  "<hr>" + d[4] )
                .style("left", (d3.event.pageX + 9) + "px")
                .style("top", (d3.event.pageY - 43) + "px")
                div
                .transition()
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
            div
                .transition()
                .style("opacity", 1e-6)
                .style("visibility", "hidden")
                .duration(1000);
        }

        d3.selectAll(".dot")
            .on("mouseover", mouseover)
            .on("mouseout", mouseout);
    },
    getSiliconData: function() {
        var that = this;
        console.log("sending request for silicon valley database");

        $.ajax({
            url: '/silicon.json',
            dataType: 'json',
            data: 'GET'
        }).done(function(data) {
            console.log("got silicon valley data, mofos");
            console.log(data);
            that.prepDataForDonut(data);
        });
    },
    prepDataForDonut: function(data) {
        var j,
            siliconLength = data.length,
            category;
        console.log("about to mess this mothereffer up");

        for (j = 0; j < siliconLength; j++) {

            // keeping track of categories of silicon valley companies
            category = data[j].category_code;

            if (category === "fashion") {
                siliconCategories.fashion += 1;
            } else if ((category === "web") || (category === "search") || (category === "mobile") || (category === "software") || (category === "hardware") || (category === "games_video") || (category === "cleantech") || (category === "social") || (category === "messaging") || (category === "photo_video") || (category === "security") || (category === "network_hosting") || (category === "biotech")) {
                siliconCategories.tech += 1;
            } else if ((category === "advertising") || (category === "public_relations")) {
                siliconCategories.advertising += 1;
            } else if (category === "ecommerce") {
                siliconCategories.ecommerce += 1;
            } else if (category === "finance") {
                siliconCategories.finance += 1;
            } else if (category === "education") {
                siliconCategories.education += 1;
            } else if (category === "enterprise") {
                siliconCategories.enterprise += 1;
            } else {
                siliconCategories.other += 1;
            }

        }

        this.createDonutGraph();
    },
    createDonutGraph: function() {
        console.log("time to make the donuts");

        var ny = {
            label: 'New York',
            pct: [categories.fashion, categories.tech, categories.advertising, categories.ecommerce, categories.finance, categories.other, categories.education, categories.enterprise]
            },
            sv = {
            label: 'Silicon Valley',
            pct: [siliconCategories.fashion, siliconCategories.tech, siliconCategories.advertising, siliconCategories.ecommerce, siliconCategories.finance, siliconCategories.other, siliconCategories.education, siliconCategories.enterprise]
            },
            data = ny;

        var labels = ['Fash.', 'Tech', 'Advert.', 'eComm.', 'Fin.', 'Other', 'Edu.', 'Enter.'];

        var w = 320,                       // width and height, natch
            h = 320,
            r = Math.min(w, h) / 2,        // arc radius
            dur = 750,                     // duration, in milliseconds
            color = d3.scale.category20c(),
            donut = d3.layout.pie().sort(null),
            arc = d3.svg.arc().innerRadius(r - 70).outerRadius(r - 20);

        // ---------------------------------------------------------------------
        var svg = d3.select("#donut").append("svg:svg")
            .attr("width", w).attr("height", h);

        var arc_grp = svg.append("svg:g")
            .attr("class", "arcGrp")
            .attr("transform", "translate(" + (w / 2) + "," + (h / 2) + ")");

        var label_group = svg.append("svg:g")
            .attr("class", "lblGroup")
            .attr("transform", "translate(" + (w / 2) + "," + (h / 2) + ")");

        // GROUP FOR CENTER TEXT
        var center_group = svg.append("svg:g")
            .attr("class", "ctrGroup")
            .attr("transform", "translate(" + (w / 2) + "," + (h / 2) + ")");

        // CENTER LABEL
        var pieLabel = center_group.append("svg:text")
            .attr("dy", ".35em").attr("class", "chartLabel")
            .attr("text-anchor", "middle")
            .text(data.label);

        // DRAW ARC PATHS
        var arcs = arc_grp.selectAll("path")
            .data(donut(data.pct));
        arcs.enter().append("svg:path")
            .attr("stroke", "white")
            .attr("stroke-width", 1)
            .attr("fill", function(d, i) {return color(i);})
            .attr("d", arc)
            .each(function(d) {this._current = d});

        // DRAW SLICE LABELS
        var sliceLabel = label_group.selectAll("text")
            .data(donut(data.pct));
        sliceLabel.enter().append("svg:text")
            .attr("class", "arcLabel")
            .attr("transform", function(d) {return "translate(" + arc.centroid(d) + ")"; })
            .attr("text-anchor", "middle")
            .text(function(d, i) {return labels[i]; });

        // Store the currently-displayed angles in this._current.
        // Then, interpolate from this._current to the new angles.
        function arcTween(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function(t) {
                return arc(i(t));
            };
        }

        // update chart
        function updateChart(model) {
            data = eval(model); // which model?

            arcs.data(donut(data.pct)); // recompute angles, rebind data
            arcs.transition().ease("elastic").duration(dur).attrTween("d", arcTween);

            sliceLabel.data(donut(data.pct));
            sliceLabel.transition().ease("elastic").duration(dur)
                .attr("transform", function(d) {return "translate(" + arc.centroid(d) + ")"; })
                .style("fill-opacity", function(d) {return d.value==0 ? 1e-6 : 1;});

            pieLabel.text(data.label);
        }

        // click handler
        $("#category a").click(function() {
            updateChart(this.href.slice(this.href.indexOf('#') + 1));
        });
    }
};

$(document).ready(function() {
    console.log("window loaded");
    getCompanyData.dataFromDatabase();

     $('#view_selection a').click(function() {
          var view_type = $(this).attr('id');
          $('#view_selection a').removeClass('active');
          $(this).toggleClass('active');
          toggle_view(view_type);
          return false;
        });

        $('#view_selection_donut a').click(function() {
          var view_type = $(this).attr('id');
          $('#view_selection_donut a').removeClass('active');
          $(this).toggleClass('active');
          toggle_view(view_type);
          return false;
        });
});