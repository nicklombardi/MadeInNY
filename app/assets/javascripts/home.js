// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
var companiesObject,
    dataset = [];

var getCompanyData = {
    dataFromDatabase: function() {
        var that = this;
        console.log("going to make ajax request");

        // retrieves data from home controller index action
        $.ajax({
            url: '/home.json',
            dataType: 'json',
            data: 'GET'
        }).done(function (data) {
            console.log("got data from database");
            console.log(data);
            companiesObject = data;
            // calls prepDataForD3 function
            that.prepDataForD3(data);
        });
    },
    prepDataForD3: function(data) {
        console.log("prepping data");
        var i,
            length = data.length,
            fundingString,
            fundingArray,
            thousandOrMillion,
            totalFunding;

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
            }

            // populates global variable dataset array
            dataset.push([data[i].longitude, data[i].latitude, totalFunding, data[i].name, data[i].description]);
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

        var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

        svg.selectAll("dot")
            .data(dataset)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("transform", function(d){
                return "translate(" + projection([d[0], d[1]]) + ")";
            })
            .attr("r", function(d) {
                return (d[2]/4);
            })
            .style("fill", function(d) {
                return color(d[2]);
            });

        var div = d3.select("body").append("div")
            .style("position", "absolute")
            .style("text-align", "left")
            .style("background", "white")
            .style("border-radius", "4px")
            .style("padding", "6px")
            .style("border", "solid 1px #DBDCDE")
            .style("opacity", 0);

        function mouseover(d) {
            d3.select(this)
                .transition()
                .ease("elastic")
                .attr("r", (d[2]/2))
                .duration(500);

            div.html(d[3] +  "<br />" + d[4])
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
                .attr("r", (d[2]/4))
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
    }
};

$(document).ready(function() {
    console.log("window loaded");
    getCompanyData.dataFromDatabase();
});