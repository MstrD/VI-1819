function geomap() {
    var margin = {
        top: 15,
        right: 0,
        bottom: 15,
        left: 30
    };

    var width = 700 - margin.left - margin.right,
        height = 290 - margin.top - margin.bottom;

    var svg = d3.select("#geomap").append("svg")
        .attr("width", width)
        .attr("height", height + 50)
        .attr("id", "geomap")
        .attr("translate", "(0," + height + ")");

    var projection = d3.geoMercator()
        .scale(80)
        .translate([width/2, height/2 + 70]);

    var path = d3.geoPath()
        .projection(projection);

    d3.json("world-110m.geojson").then(function(gj) {
        return svg.selectAll("path")
            .data(gj.features)
            .enter()
            .append("path")
            .attr('d', path);
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
        return svg.selectAll("path")
            .data(gj.features)
            .enter()
            .append("path")
            .attr('d', path);
    });
}