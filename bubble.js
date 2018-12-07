
var dataset2;
var w = 600,
	h = 300,
	diameter = 300,
	angle,
	x,y, i,r;
	
d3.json("networks_count_BL.json").then(function (data) {
	
	bubbleMap(data);
});

function interpolateColor(color1, color2, factor) {
		if (arguments.length < 3) { 
			factor = 0.5; 
		}
		var result = color1.slice();
		for (var i = 0; i < 3; i++) {
			result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
		}
		return result;
	};
	
function interpolateColors(color1, color2, steps) {
		var stepFactor = 1 / (steps - 1),
			interpolatedColorArray = [];

		color1 = color1.match(/\d+/g).map(Number);
		color2 = color2.match(/\d+/g).map(Number);

		for(var i = 0; i < steps; i++) {
			interpolatedColorArray.push(interpolateColor(color1, color2, stepFactor * i));
		}

		return interpolatedColorArray;
	}

function componentToHex(c) {
		var hex = c.toString(16);
		return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
		return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
	
function bubbleMap(data){
	data.sort(function(a, b) {
        return b.C - a.C;
    })
    var dataset1  ,children = [];
	//console.log("before",dataset1);
	dataset1 = data.slice(1,50);
	//console.log("ater",dataset1);
    //dataset2 = data.slice(72, data.lenght);
	for (i=0; i<dataset1.length; i++) {
		r = dataset1[i]["C"]/5
		children.push({'A': dataset1[i]["A"], 'B': parseInt(dataset1[i]["B"]), 
		'C': parseInt(dataset1[i]["C"]), 'D': parseInt(dataset1[i]["D"]),
		'E': parseFloat(dataset1[i]["E"]), "R":r});
    }	
	//todos os objetos criados para as bolhas
	var full = {children};

	//generate gradient colors
	
	var colorRange = [];
	var color2= interpolateColors("rgb (255, 00,00)", "rgb (255,235,235)", 20);
	for (i=0; i<color2.length; i++) {
		colorRange.push(rgbToHex(color2[i][0],color2[i][1],color2[i][2]));
		
	}
	/* var pos = [1, 2, 3, 4, 5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,
					21, 22, 23, 24, 25,26,27,28,29,30,31, 32, 33, 34, 35,36,37,38,39,40,
					41, 42, 43, 44, 45,46,47,48,49,50,51, 52, 53, 54, 55,56,57,58,59,60];
					
    *var pos = [1, 2, 3, 4, 5,6,7,8,9,10,11];*/
    var pos = [0,1, 2, 3, 4, 5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
		
    /*var pos = [0,1, 2, 3, 4, 5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,
					21, 22, 23, 24, 25,26,27,28,29,30,31, 32, 33, 34, 35,36,37,38,39,40];*/
	
	//trollar the background ball
	colorRange.unshift("#000000");
	var color = d3.scaleLinear().range(colorRange).domain(pos);
	
	var bubble = d3.pack(full)
		.size([diameter, diameter])
		.padding(1.5);
	
	
	var svg = d3.select("#mind")
		.append("svg")
		.attr("width", w)
		.attr("height", h)
		.attr("class", "bubble");

	var nodes = d3.hierarchy(full)
		.sum(function(d) { return d.C; });
	
	var node = svg.selectAll(".node")
		.data(bubble(nodes).descendants())
		.enter()
		.filter(function(d){
			return  !d.full_dataset;
		})
		.append("g")
		.attr("class", "node")
		.attr("transform", function(d) {
			return "translate(" + d.x + "," + d.y + ")";
		});

	//console.log("node",node);
	node.append("title")
		.text(function(d) {
			return d.A;
		});

	node.append("circle")
		.attr("r", function(d) {
			return d.r;
		})
		.style("fill", function(d,i) {
			return color(i);
		});

	node.append("text")
		.attr("dy", ".2em")
		.style("text-anchor", "middle")
		.text(function(d) {
			return d.data.A;
		})
		.attr("font-family", "roboto", "sans-serif")
		.attr("font-size", function(d){
			return d.r/2;
		})
		.attr("fill", "black")
		.on("mouseenter", function() {
			d3.select(this)
				.style("cursor", "default");
		});

    node.append("text")
		.attr("dy", "1.3em")	
		.style("text-anchor", "middle")
		.text(function(d) {
			return d.data.C;
		})
		.attr("font-family",  "oswald thin", "sans-serif")
		.attr("font-size", function(d){
			return d.r/2;
		})
		.attr("fill", "black")
		.on("mouseenter", function() {
			d3.select(this)
				.style("cursor", "default");
		});
		
	node.on("mouseenter", function(d) {
			//tooltip.style("display", null);
			d3.select(this)
				.transition(100)
				.style("opacity", 0.7);
		})
	node.on("mouseleave", function() {
			d3.select(this)
				.transition(100)
				.style("opacity", 1);
			//tooltip.style("display", "none");
		})
	node.on("mousemove", function(d, i) {
			d3.select(this)
				.style("opacity", 0.7);
			//tooltip.style("display", null);
			var xPosition = d3.mouse(this)[0] - 20;
			var yPosition = d3.mouse(this)[1] - 25;
			//tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
			//tooltip.select("text").text(d.data.A);
		})
	node.on('click', function(d, i) {
		if (d.height != 1){		
			series(d.data.A);
			//console.log(document.getElementById("network").value);
			selectnetwork();
		}
		
		//meter aqui funcao para mudar o grafico la em cima
	})
	
	/*node.append("stop")
		.attr("offset", "0%")
		.attr("stop-color", color(1));
	node.append("stop")
		.attr("offset", "5%")
		.attr("stop-color", color(2));
	node.append("stop")
		.attr("offset", "10%")
		.attr("stop-color", color(3));
	node.append("stop")
		.attr("offset", "15%")
		.attr("stop-color", color(4));
	node.append("stop")
		.attr("offset", "20%")
		.attr("stop-color", color(5));
	node.append("stop")
		.attr("offset", "25%")
		.attr("stop-color", color(6));
	node.append("stop")
		.attr("offset", "30%")
		.attr("stop-color", color(7));
	node.append("stop")
		.attr("offset", "35%")
		.attr("stop-color", color(8));
	node.append("stop")
		.attr("offset", "40%")
		.attr("stop-color", color(9));
	node.append("stop")
		.attr("offset", "45%")
		.attr("stop-color", color(10));
	node.append("stop")
		.attr("offset", "50%")
		.attr("stop-color", color(11));
	node.append("stop")
		.attr("offset", "55%")
		.attr("stop-color", color(12));	
	node.append("stop")
		.attr("offset", "60%")
		.attr("stop-color", color(13));
	node.append("stop")
		.attr("offset", "65%")
		.attr("stop-color", color(14));
	node.append("stop")
		.attr("offset", "70%")
		.attr("stop-color", color(15));
	node.append("stop")
		.attr("offset", "75%")
		.attr("stop-color", color(16));
	node.append("stop")
		.attr("offset", "80%")
		.attr("stop-color", color(17));
	node.append("stop")
		.attr("offset", "85%")
		.attr("stop-color", color(18));
	node.append("stop")
		.attr("offset", "90%")
		.attr("stop-color", color(19));
	node.append("stop")
		.attr("offset", "95%")
		.attr("stop-color", color(20));
	node.append("stop")
		.attr("offset", "100%")
		.attr("stop-color", color(21));	*/

	 // Prep the tooltip bits, initial display is hidden
    /*var tooltip = svg.append("g")
    .attr("class", "tooltip")
    .style("display", "none");
        
    tooltip.append("rect")
    .attr("width", 60)
    .attr("height", 20)
    .attr("fill", "white")
    .style("opacity", 0.5);

    tooltip.append("text")
    .attr("x", 30)
    .attr("dy", "1.2em")
    .style("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("font-weight", "bold");	*/
}

function series(network){
	document.getElementById("network").value = network;
	document.getElementById("mind").innerHTML = "";
	var children = [];
	d3.json("networks_series_BL.json").then(function (dataS) {
		dataS.sort(function(a, b) {
			return b.C - a.C;
		})
		dataSeries = dataS.slice(1,dataS.lenght);
		//vai buscar as series so daquela network
		for (i=1; i < dataSeries.length; i++) {
			if (dataSeries[i].A == network){
				children.push({'A': dataSeries[i]["A"], 'B': dataSeries[i]["B"], 
						'C': parseInt(dataSeries[i]["C"]), 'D': parseInt(dataSeries[i]["D"]),
						'E': parseFloat(dataSeries[i]["E"]), "R":r});	
			}	
		}
	var full2 = {children};

	//generate gradient colors
	
	var colorRange = [];
	var color2= interpolateColors("rgb (255, 00,00)", "rgb (255,235,235)", children.length/3);
	for (i=0; i<color2.length; i++) {
		colorRange.push(rgbToHex(color2[i][0],color2[i][1],color2[i][2]));
	}
	//console.log(pos);
	 var pos = [0,1, 2, 3, 4, 5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,
					21, 22, 23, 24, 25,26,27,28,29,30,31, 32, 33, 34, 35,36,37,38,39,40,
					41, 42, 43, 44, 45,46,47,48,49,50,51, 52, 53, 54, 55,56,57,58,59,60,
					61, 62, 63, 64, 65,66,67,68,69,70, 71, 72, 73, 74, 75,76,77,78,79,80,
					81,82, 83, 84, 85,86,87,88,89,90,91, 92, 93, 94, 95,96,97,98,99,100,101, 102, 103, 104, 105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120];
   //trollar the background ball
	colorRange.unshift("#000000");
	var color = d3.scaleLinear().range(colorRange).domain(pos);
	
	var bubble2 = d3.pack(full2)
		.size([diameter, diameter])
		.padding(1.5);
	
	
	var svg = d3.select("#mind")
		.append("svg")
		.attr("width", w)
		.attr("height", h)
		.attr("class", "bubble");
		
	//console.log("full2", full2);

	var series = d3.hierarchy(full2)
		.sum(function(d) { return d.C; });
	
	var serie = svg.selectAll(".serie")
		.data(bubble2(series).descendants())
		.enter()
		.filter(function(d){
			return  !d.full_dataset;
		})
		.append("g")
		.attr("class", "serie")
		.attr("transform", function(d) {
			return "translate(" + d.x + "," + d.y + ")";
		});

	//console.log("serie",serie);
	serie.append("title")
		.text(function(d) {
			return d.A;
		});

	serie.append("circle")
		.attr("r", function(d) {
			return d.r;
		})
		.style("fill", function(d,i) {
			return color(i);
		});

	serie.append("text")
		.attr("dy", ".2em")
		.style("text-anchor", "middle")
		.text(function(d) {
			return d.data.B;
		})
		.attr("font-family", "roboto", "sans-serif")
		.attr("font-size", function(d){
			return d.r/4;
		})
		.attr("fill", "black")
		.on("mouseenter", function() {
			d3.select(this)
				.style("cursor", "default");
		});

    serie.append("text")
		.attr("dy", "1.3em")	
		.style("text-anchor", "middle")
		.text(function(d) {
			return d.data.C;
		})
		.attr("font-family", "oswald", "sans-serif")
		.attr("font-size", function(d){
			return d.r/4;
		})
		.attr("fill", "black")
		.on("mouseenter", function() {
			d3.select(this)
				.style("cursor", "default");
		});
		
	serie.on("mouseenter", function(d) {
			//tooltip.style("display", null);
			d3.select(this)
				.transition(100)
				.style("opacity", 0.7);
		})
	serie.on("mouseleave", function() {
			d3.select(this)
				.transition(100)
				.style("opacity", 1);
			//tooltip.style("display", "none");
		})
	serie.on("mousemove", function(d, i) {
			d3.select(this)
				.style("opacity", 0.7);
			//tooltip.style("display", null);
			var xPosition = d3.mouse(this)[0] - 20;
			var yPosition = d3.mouse(this)[1] - 25;
			//tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
			//tooltip.select("text").text(d.data.A);
		})
	serie.on('click', function(d, i) {
		if (d.height == 1){		
			document.getElementById("mind").innerHTML = "";
			setOriginals();
			d3.json("networks_count_BL.json").then(function (data) {
			bubbleMap(data);
		});
			
		}else{			
			document.getElementById("serie").value = d.data.B;
		}
		//series(d.data.A);
		
	})
	 // Prep the tooltip bits, initial display is hidden
    /*var tooltip = svg.append("g")
		.attr("class", "tooltip")
		.style("display", "none");
        
   /* tooltip.append("rect")
		.attr("width", 60)
		.attr("height", 20)
		.attr("fill", "white")
		.style("opacity", 0.5);

    tooltip.append("text")
		.attr("x", 30)
		.attr("dy", "1.2em")
		.style("text-anchor", "middle")
		.attr("font-size", "12px")
		.attr("font-weight", "bold");*/
		
	});
		
}
