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
			//comentar linha de cima para tirar click no mapa em si
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
            // mouse events
			//depois sai para dar origem a secao
            /*.on("mouseenter", function(d) {
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
            })*/;

        svg.append("g")
            .selectAll("g")
            .data(myPlacesData).enter()
            .append("g")
            .attr("transform", function (d) { return "translate(" + projection(d.geometry.coordinates[0][0]) + ")"; })
            .attr("class", "points")
            .append("circle")
            .attr("r", 4)
            .attr("fill", "#cca300")
            .on('click', clicked_city)
            // mouse events
            /*.on("mouseenter", function(d) {
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
            })*/
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
				console.log(dataWeWant);
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
	
    // Prep the tooltip bits, initial display is hidden
    /*var tooltip = svg.append("g")
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
    .attr("font-weight", "bold");*/
	
}