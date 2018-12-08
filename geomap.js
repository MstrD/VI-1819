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

    d3.json("new_cities.geojson").then(function(gj) {
        svg.append("g")
            .selectAll("g")
            .data(gj.features).enter()
            .append("g")
            .attr("transform", function (d) { return "translate(" + projection(d.geometry.coordinates[0][0]) + ")"; })
            .append("circle")
            .attr("r", 2)
            .attr("fill", "rgb(66, 134, 244)")
            .on('click', clicked);
    });

    function clicked(d) {
        var x, y, k;
      
        if (d && centered !== d) {
          var centroid = path.centroid(d);
          console.log(centroid);
          x = centroid[0];
          y = centroid[1];
          k = 2;
          centered = d;
        } else {
          x = width / 2;
          y = height / 2 + 70;
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
}