function geomap() {
    var margin = {
        top: 15,
        right: 0,
        bottom: 15,
        left: 30
    };

    var width = 700 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom,
        centered;

    var svg = d3.select("#geomap").append("svg")
        .attr("width", width)
        .attr("height", height + 50)
        .attr("id", "geomap")
        .attr("translate", "(0," + height + ")");

    var projection = d3.geoMercator()
        .scale(100)
        .translate([width/2, height/2 + 70]);

    var path = d3.geoPath()
        .projection(projection);

    d3.json("world-110m.geojson").then(function(gj) {
        return svg.selectAll("path")
            .data(gj.features)
            .enter()
            .append("path")
            .attr('d', path)
            .on("click", clicked);
            /*.on("mouseover", function(d) {
                d3.select(this)
                    .classed("active", true);
            })
            .on("mouseout", function(d){
                d3.select(this)
                    .classed("active", false);
            });*/
    });

    var myPlaces = [];
    d3.json("actors_nomenies_wins_ratio_place_of_birth_counter.json").then(function(data) {
        for (var i = 0; i < current_heatmap.length; i++) {
            for (var j = 1; j < data.length; j++) {
                if (current_heatmap[i].nominee == data[j].A) {
                    myPlaces.push(data[j].E);
                }
            }
        }
    });
    
    var myPlacesData = [];
    d3.json("new_cities.geojson").then(function(gj) {
        for (var i = 0; i < myPlaces.length; i++) {
            for (var j = 0; j < gj.features.length; j++) {
                if (myPlaces[i] == gj.features[j].properties.NAME) {
                    myPlacesData.push(gj.features[j]);
                }
            }
        }
        svg.append("g")
            .selectAll("g")
            .data(gj.features).enter()
            .append("g")
            .attr("transform", function (d) { return "translate(" + projection(d.geometry.coordinates[0][0]) + ")"; })
            .append("circle")
            .attr("r", 2)
            .attr("fill", "rgb(66, 134, 244)")
            .on('click', clicked)
            // mouse events
            .on("mouseenter", function(d) {
                tooltip.style("display", null);
            })
            .on("mouseleave", function() {
                tooltip.style("display", "none");
            })
            .on("mousemove", function(d, i) {
                tooltip.style("display", null);
                var xPosition = d3.mouse(this)[0] + 550;
                var yPosition = d3.mouse(this)[1] + 150;
                tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
                tooltip.select("text").text(d.properties.NAME);
            });

        svg.append("g")
            .selectAll("g")
            .data(myPlacesData).enter()
            .append("g")
            .attr("transform", function (d) { return "translate(" + projection(d.geometry.coordinates[0][0]) + ")"; })
            .append("circle")
            .attr("r", 4)
            .attr("fill", "#cca300")
            .on('click', clicked)
            // mouse events
            .on("mouseenter", function(d) {
                tooltip.style("display", null);
            })
            .on("mouseleave", function() {
                tooltip.style("display", "none");
            })
            .on("mousemove", function(d, i) {
                tooltip.style("display", null);
                var xPosition = d3.mouse(this)[0] + 550;
                var yPosition = d3.mouse(this)[1] + 150;
                tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
                tooltip.select("text").text(d.properties.NAME);
            })
    });

    function clicked(d) {
        var x, y, k;
      
        if (d && centered !== d) {
          var centroid = path.centroid(d);
          x = centroid[0];
          y = centroid[1];
          k = 2;
          centered = d;
        } else {
          x = width / 2 + 150;
          y = height / 2 + 80;
          k = 1;
          centered = null;
        }
      
        svg.selectAll("path")
            .classed("active", centered && function(d) { return d === centered; });
      
        svg.transition()
            .duration(750)
            .attr("transform", "translate(" + (width / 2 + 150) + "," + (height / 2 + 80) + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
            .style("stroke-width", 1.5 / k + "px");
      }

    // Prep the tooltip bits, initial display is hidden
    var tooltip = svg.append("g")
    .attr("class", "tooltip")
    .style("display", "none");
        
    tooltip.append("rect")
    .attr("width", 100)
    .attr("height", 20)
    .attr("fill", "white")
    .style("opacity", 0.5);

    tooltip.append("text")
    .attr("x", 50)
    .attr("dy", "1.2em")
    .style("text-anchor", "middle")
    .style("text-align", "center")
    .attr("font-size", "12px")
    .attr("font-weight", "bold");
}