function geomap() {
    var margin = {
        top: 15,
        right: 0,
        bottom: 20,
        left: 30
    };

    var width = 750 - margin.left - margin.right,
        height = 250 - margin.top - margin.bottom,
        centered;
    
    var selected = false;

    var svg = d3.select("#geomap").append("svg")
        .attr("width", width)
        .attr("height", height + 50)
        .attr("id", "map")
        .attr("translate", "(0," + height + ")");

    var projection = d3.geoMercator()
        .scale(90)
        .translate([width/2 - 40, height/2 + 60]);

    var path = d3.geoPath()
        .projection(projection);

    d3.json("world-110m.geojson").then(function(gj) {
        return svg.selectAll("path")
            .data(gj.features)
            .enter()
            .append("path")
            .attr('d', path)
            .on("click", clicked);
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
    var myPlacesName = [];
    d3.json("new_cities.geojson").then(function(gj) {
        for (var i = 0; i < myPlaces.length; i++) {
            for (var j = 0; j < gj.features.length; j++) {
                if (myPlaces[i] == gj.features[j].properties.NAME && !myPlacesName.includes(gj.features[j].properties.NAME)) {
                    myPlacesData.push(gj.features[j]);
                    myPlacesName.push(gj.features[j].properties.NAME);
                }
            }
        }
        svg.append("g")
            .selectAll("g")
            .data(gj.features).enter()
            .append("g")
            .attr("transform", (d) => "translate(" + projection(d.geometry.coordinates[0][0]) + ")")
            .attr("class", "allPoints")
            .append("circle")
            .attr("r", 2)
            .attr("fill", "rgb(66, 134, 244)")
            .on('click', clicked_city)
            .on("mouseenter", function(d) {
                d3.select(this)
                .style("cursor", "pointer");
            })
            .on("mouseleave", function() {
                d3.select(this)
                .style("cursor", "auto");
            });

        svg.append("g")
            .selectAll("g")
            .data(myPlacesData).enter()
            .append("g")
            .attr("transform", function (d) { return "translate(" + projection(d.geometry.coordinates[0][0]) + ")"; })
            .attr("class", "points")
            .append("circle")
            .attr("r", 4)
            .attr("fill", "#cca300")
            .on('click', function(d) {
                clicked_city(d);
                var actual = d3.select(this);
                var index; 
                var all = svg.selectAll(".points");
                for (var i = 0; i < current_heatmap.length; i++) {
                    if (current_heatmap[i].PlaceOfBirth === actual._groups[0][0].__data__.properties.NAME) { index = i; break; }
                }
                if (!selected) {
                    d3.select("#heatmap").select("svg").select(".hm_axis").selectAll(".tick")
                    .filter((d, i) => i !== index)
                    .selectAll("text")
                    .transition()
                    .duration(1000)
                    .style("opacity", 0.3);
                    d3.select("#heatmap").select("svg").select(".hm_axis").selectAll(".tick")
                    .filter((d, i) => i === index)
                    .selectAll("text")
                    .transition()
                    .duration(1000)
                    .style("color", "#f3ce13");
                    selected = true;
                }
                else {
                    d3.select("#heatmap").select("svg").select(".hm_axis").selectAll(".tick")
                    .filter((d, i) => i !== index)
                    .selectAll("text")
                    .transition()
                    .duration(1000)
                    .style("opacity", 1.0);
                    d3.select("#heatmap").select("svg").select(".hm_axis").selectAll(".tick")
                    .filter((d, i) => i === index)
                    .selectAll("text")
                    .transition()
                    .duration(1000)
                    .style("color", "white");
                    selected = false;
                }
            })
            .on("mouseenter", function(d) {
                d3.select(this)
                .style("cursor", "pointer");
            })
            .on("mouseleave", function() {
                d3.select(this)
                .style("cursor", "auto");
            });
    });

    function clicked(d) {
        var x, y, k;
		document.getElementById("select_city").style.display= 'none' ;
        if (d && centered !== d) {
          var centroid = path.centroid(d);
          x = centroid[0];
          y = centroid[1];
          k = 2;
          centered = d;
        } else {
          x = width / 2 ;
          y = height / 2 ;
          k = 1;
          centered = null;
        }
      
        svg.selectAll("path")
            .classed("active", centered && function(d) { return d === centered; });
      
		//.translate([width / 2 - point[0] * scale, height / 2 - point[1] * scale])
		
        svg.transition()
            .duration(750)
            .attr("transform", "translate(" + (width / 2 - x) + "," + (height / 2 - y) + ")scale(" + k + ")")
            .style("stroke-width", 1.5 / k + "px");
      }
	
	function clicked_city(d){
		clicked(d);
		var cityName = d.properties.NAME;
		if (centered == d){
			var dataWeWant = [];
			d3.json("placeOfBirth_details.json").then(function (dataS){
				dataS.splice(0, 1);
				for (var i = 0; i < dataS.length; i++) {
					if (dataS[i].A == cityName){ 
						dataWeWant.push(dataS[i]);
					}
				}
				document.getElementById("geo_city").innerHTML = dataWeWant[0].A;
				document.getElementById("geo_nactors").innerHTML = dataWeWant[0].D;
				document.getElementById("geo_wins").innerHTML = dataWeWant[0].B;
				document.getElementById("geo_nominees").innerHTML = dataWeWant[0].C;
				
				document.getElementById("select_city").style.display= 'block' ;
			});
		}
		else{
			document.getElementById("select_city").style.display= 'none' ;
		}
	}
}