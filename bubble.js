var dataset2;
var w = 300,
	h = 270,
	diameter = 270,
	angle,
	x,y, i,r;
	
d3.json("networks_count_BL.json").then(function (data) {
	
	bubbleMap(data);
});

/*function mudarounao(){
	console.log("network----",document.getElementById('network').value);
	if (document.getElementsByClassName("circle")[0]){
		console.log("Tenho que mudar");
	}else{
		
		console.log("Não mudo");
	}
}*/

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
        return b.D - a.D;
    })
    var dataset1  ,children = [];
	//console.log("before",dataset1);
	dataset1 = data.slice(0,50);
	//console.log("ater",dataset1);
    //dataset2 = data.slice(72, data.lenght);
	for (i=0; i<dataset1.length; i++) {
		r = dataset1[i]["D"]/5;
		
		var word = "", index;
		var originalName = dataset1[i]["A"];
		if (dataset1[i]["A"].length > 8){
			var splited = dataset1[i]["A"].split(/\s/);
			if(splited.length > 1){
				for ( index = 0 ; index <= splited.length-1; ++index) { 	
					word += splited[index].slice(0,1);	
				}
				dataset1[i]["A"]	= word;
			}
		}
		
		children.push({'A': dataset1[i]["A"], 'B': parseInt(dataset1[i]["B"]), 
		'C': parseInt(dataset1[i]["C"]), 'D': parseInt(dataset1[i]["D"]),
		'E': parseFloat(dataset1[i]["E"]),'F': parseFloat(dataset1[i]["F"]), "R":r, "O":originalName});
    }	
	//todos os objetos criados para as bolhas
	var full = {children};

	//generate gradient colors
	
	var colorRange = [];
	var color2= interpolateColors("rgb (0, 51, 51)", "rgb (102,204,153)", 20);
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
	colorRange.unshift("#1c1f24");
	var color = d3.scaleLinear().range(colorRange).domain(pos);
	
	var bubble = d3.pack(full)
		.size([diameter, diameter])
		.padding(1.5);
	
	
	var svg = d3.select("#mind")
		.append("svg")
		.attr("width", diameter)
		.attr("height", diameter)
		.attr("class", "bubble");

	var nodes = d3.hierarchy(full)
		.sum(function(d) { return d.D; });
	
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
		
//filter(function(d){ return d.parent; }) 
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
			if (typeof d.data.A === "undefined"){
			}else{
				
				return d.data.A;
			}
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
	
    node.on("mouseenter", function() {
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
		})
	node.on('click', function(d, i) {
		if (d.height != 1){		
			series(d.data.O);
			selectnetwork();
			console.log(d.data.O);
			document.getElementById("bubble_network").innerHTML = d.data.O;
			document.getElementById("bubble_nseries").innerHTML = d.data.F;
			document.getElementById("bubble_wins").innerHTML = d.data.C;
			document.getElementById("bubble_nominees").innerHTML = d.data.B;
			document.getElementById("select_network").style.display= 'block' ;
		}
		
		//meter aqui funcao para mudar o grafico la em cima
	})
	
}
		

function series(network){
	
	document.getElementById("mind").innerHTML = "";
	var children = [];
	d3.json("networks_series_BL.json").then(function (dataS) {
		dataS.sort(function(a, b) {
			return b.E - a.E;
		})
		dataSeries = dataS.slice(0,dataS.lenght);
		//vai buscar as series so daquela network
		for (i=1; i < dataSeries.length; i++) {
			if (dataSeries[i].A == network){
				r = dataSeries[i]["E"]/5;
				var word = "", index;
				if (dataSeries[i]["B"].length > 12){
					var splited = dataSeries[i]["B"].split(/\s/);
					if(splited.length > 3 || dataSeries[i]["B"].length > 15){
						word = splited[0];
						for ( index = 1 ; index <= splited.length-1; ++index) { 	
							word += " " + splited[index].slice(0,1);	
							//console.log(word);
						}
						dataSeries[i]["B"]	= word;
					}
				}
				
				children.push({'A': dataSeries[i]["A"], 'B': dataSeries[i]["B"], 
						'C': parseInt(dataSeries[i]["C"]), 'D': parseInt(dataSeries[i]["D"]),
						'E': parseFloat(dataSeries[i]["E"]), "R":r});	
			}	
		}
	var full2 = {children};

	//generate gradient colors
	
	var colorRange = [];
	var color2= interpolateColors("rgb (0, 51, 51)", "rgb (102,204,153)", children.length/3);
	for (i=0; i<color2.length; i++) {
		colorRange.push(rgbToHex(color2[i][0],color2[i][1],color2[i][2]));
	}
	//console.log(pos);
	 var pos = [0,1, 2, 3, 4, 5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,
					21, 22, 23, 24, 25,26,27,28,29,30,31, 32, 33, 34, 35,36,37,38,39,40,
					41, 42, 43, 44, 45,46,47,48,49,50,51, 52, 53, 54, 55,56,57,58,59,60,
					61, 62, 63, 64, 65,66,67,68,69,70, 71, 72, 73, 74, 75,76,77,78,79,80,
					81,82, 83, 84, 85,86,87,88,89,90,91, 92, 93, 94, 95,96,97,98,99,100,
					101, 102, 103, 104, 105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120];
   //trollar the background ball
	colorRange.unshift("#1c1f24");
	var color = d3.scaleLinear().range(colorRange).domain(pos);
	
	var bubble2 = d3.pack(full2)
		.size([diameter, diameter])
		.padding(1.5);
	
	
	var svg = d3.select("#mind")
		.append("svg")
		.attr("width", diameter)
		.attr("height", diameter)
		.attr("class", "bubble");
		
	//console.log("full2", full2);

	var series = d3.hierarchy(full2)
		.sum(function(d) { return d.E; });
	
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
//.filter(function(d){ return d.parent; }) 
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

    serie.on("mouseenter", function() {
			d3.select(this)
				.style("cursor", "default");
		});
		
	document.getElementById("network").value = network;
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
			document.getElementById("select_network").style.display= 'none' ;
		});
			
		}else{
			document.getElementById("serie").value = d.data.B;
		}
		
		
	})
		
	});
		
}