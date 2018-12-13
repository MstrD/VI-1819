var win, full_win, nominee, full_nominee, rating, full_rating, last_sort;
var orig_win, orig_nominee, orig_rating, orig_layers1, orig_layers2, orig_layers3;
var layers1, layers2, layers3, last_layer;
var wr, wl;
var chil_select;
var has_rate, has_win, has_nom;

d3.json("final_TL.json").then(function (data) {
    full_win = data;
    // full_nominee is a deepcopy of full_win,
    // otherwise we wouldn't get the right results
    full_nominee = JSON.parse(JSON.stringify(data));
	full_rating = JSON.parse(JSON.stringify(data));
	//remove primeira linha com os titulos das colunas
    full_win.splice(0, 1);
    full_win.sort(function(a, b) {
        return b.G - a.G;
    });
    full_nominee.splice(0, 1);
    full_nominee.sort(function(a, b) {
        return b.D - a.D;
    })
	full_rating.splice(0, 1);
    full_rating.sort(function(a, b) {
        return b.I - a.I;
    })
	//tira os primeiros 10 
    win = full_win.slice(0,10);
    nominee = full_nominee.slice(0,10);
    rating = full_rating.slice(0,10);

    var stackKey = ["Wins by actor", "Wins as serie", "Nominations by actor", "Nominations as serie", "Rating"]
    var stack = d3.stack()
			.keys(stackKey)
			/*.order(d3.stackOrder)*/
            .offset(d3.stackOffsetNone);
    

	//ate onde vai, onde comeca, ate onde vai
	//delimitaoes das colunas do grafico
	//para futura selecao fazer o indice a bater no anterior
    layers1 = stack(win);
    for (var i = 0; i < win.length; i++) {
        layers1[0][i][1] = parseInt(win[i].E);
        layers1[1][i][0] = layers1[0][i][1];
        layers1[1][i][1] = layers1[1][i][0] + parseInt(win[i].F);
		layers1[2][i][0] = layers1[1][i][1];
		layers1[2][i][1] = layers1[2][i][0] + parseInt(win[i].B);
		layers1[3][i][0] = layers1[2][i][1];
		layers1[3][i][1] = layers1[3][i][0] + parseInt(win[i].C);
    }
    layers2 = stack(nominee);
    for (var i = 0; i < nominee.length; i++) {
        layers2[0][i][1] = parseInt(nominee[i].E);
        layers2[1][i][0] = layers2[0][i][1];
        layers2[1][i][1] = layers2[1][i][0] + parseInt(nominee[i].F);
		layers2[2][i][0] = layers2[1][i][1];
		layers2[2][i][1] = layers2[2][i][0] + parseInt(nominee[i].B);
		layers2[3][i][0] = layers2[2][i][1];
		layers2[3][i][1] = layers2[3][i][0] + parseInt(nominee[i].C);
    }
	layers3 = stack(rating);
    for (var i = 0; i < rating.length; i++) {
        layers3[0][i][1] = parseInt(rating[i].E);
        layers3[1][i][0] = layers3[0][i][1];
        layers3[1][i][1] = layers3[1][i][0] + parseInt(rating[i].F);
		layers3[2][i][0] = layers3[1][i][1];
		layers3[2][i][1] = layers3[2][i][0] + parseInt(rating[i].B);
		layers3[3][i][0] = layers3[2][i][1];
		layers3[3][i][1] = layers3[3][i][0] + parseInt(rating[i].C);
    }

    orig_win = win;
    orig_nominee = nominee;
    orig_rating = rating;
	//so interessa se for copia de objeto e nao ref
    orig_layers1 = layers1;
    orig_layers2 = layers2;
    orig_layers3 = layers3;

	wl = 180;
	wr = 350;
    barchart(win, layers1, wr);
    ratings(win,wl);
	last_layer = layers1;
	last_sort = win;
});

function selectnetwork(){
    var dataWeWant = [];
    var aux_win = [];
    var new_win = [];
    var new_nominee = [];
    var new_rating = [];
	d3.json("networks_series_BL.json").then(function (dataS) {
        dataS.splice(0, 1);
		for (var i = 0; i < dataS.length; i++) {
			if (dataS[i].A == document.getElementById("network").value) dataWeWant.push(dataS[i]);
        }
        dataWeWant.sort(function(a, b) {
            return b.B - a.B;
        })
        dataWeWant = dataWeWant.slice(0, dataWeWant.length);
        for (var j = 0; j < dataWeWant.length; j++) {
            for (var i = 0; i < full_win.length; i++) {
                if (full_win[i].A == dataWeWant[j].B) {
                    aux_win.push(full_win[i]);
                    continue;
                }
            }
        }
        var aux_nominee = JSON.parse(JSON.stringify(aux_win));
        var aux_rating = JSON.parse(JSON.stringify(aux_win));
        aux_win.sort(function(a, b) {
			return b.G - a.G;
		});
        aux_nominee.sort(function(a, b) {
			return b.D - a.D;
		});
        aux_rating.sort(function(a, b) {
			return b.I - a.I;
		});

		win = aux_win.slice(0, 10);
		nominee = aux_nominee.slice(0, 10);
		rating = aux_rating.slice(0, 10);
		
        var stackKey = ["Wins by actor", "Wins as serie", "Nominations by actor", "Nominations as serie", "Rating"]
        var stack = d3.stack()
			.keys(stackKey)
			/*.order(d3.stackOrder)*/
            .offset(d3.stackOffsetNone);

			
        layers1 = stack(win);
        for (var i = 0; i < win.length; i++) {
            layers1[0][i][1] = parseInt(win[i].E);
            layers1[1][i][0] = layers1[0][i][1];
            layers1[1][i][1] = layers1[1][i][0] + parseInt(win[i].F);
            layers1[2][i][0] = layers1[1][i][1];
            layers1[2][i][1] = layers1[2][i][0] + parseInt(win[i].B);
            layers1[3][i][0] = layers1[2][i][1];
            layers1[3][i][1] = layers1[3][i][0] + parseInt(win[i].C);
        }
        layers2 = stack(nominee);
        for (var i = 0; i < nominee.length; i++) {
            layers2[0][i][1] = parseInt(nominee[i].E);
            layers2[1][i][0] = layers2[0][i][1];
            layers2[1][i][1] = layers2[1][i][0] + parseInt(nominee[i].F);
            layers2[2][i][0] = layers2[1][i][1];
            layers2[2][i][1] = layers2[2][i][0] + parseInt(nominee[i].B);
            layers2[3][i][0] = layers2[2][i][1];
            layers2[3][i][1] = layers2[3][i][0] + parseInt(nominee[i].C);
        }
        layers3 = stack(rating);
        for (var i = 0; i < rating.length; i++) {
            layers3[0][i][1] = parseInt(rating[i].E);
            layers3[1][i][0] = layers3[0][i][1];
            layers3[1][i][1] = layers3[1][i][0] + parseInt(rating[i].F);
            layers3[2][i][0] = layers3[1][i][1];
            layers3[2][i][1] = layers3[2][i][0] + parseInt(rating[i].B);
            layers3[3][i][0] = layers3[2][i][1];
            layers3[3][i][1] = layers3[3][i][0] + parseInt(rating[i].C);
        }
		
		if (has_win == false){
			uncheck(layers1,win, "win");
			uncheck(layers2,nominee, "win");
			uncheck(layers3,rating, "win");
		}
		if (has_nom == false){
			uncheck(layers1,win, "nominee");
			uncheck(layers2,nominee, "nominee");
			uncheck(layers3,rating, "nominee");
		}
		
			
        d3.select("#barchart").selectAll("svg").remove();
        var s_wins = document.getElementById("sort_wins");
		var s_nominees = document.getElementById("sort_nominees");
		var s_rating = document.getElementById("sort_rating");
	
		if (s_wins.checked == true){
			barchart(win, layers1, wr);
			ratings(win,wl);
			last_layer = layers1;
			last_sort = win;
		}
		else if (s_nominees.checked == true) {
			barchart(nominee, layers2, wr);
			ratings(nominee,wl);
			last_layer = layers2;
			last_sort = nominee;
		}
		else{
			barchart(rating, layers3, wr);
			ratings(rating,wl);
			last_layer = layers3;
			last_sort = rating;
		}
    });
}

function setOriginals() {
    d3.select("#barchart").selectAll("svg").remove();

    win = orig_win;
    nominee = orig_nominee;
    rating = orig_rating;
    //layers1 = orig_layers1;
    //layers2 = orig_layers2;
    //layers3 = orig_layers3;
	
	var stackKey = ["Wins by actor", "Wins as serie", "Nominations by actor", "Nominations as serie", "Rating"]
    var stack = d3.stack()
			.keys(stackKey)
			/*.order(d3.stackOrder)*/
            .offset(d3.stackOffsetNone);

	layers1 = stack(win);
        for (var i = 0; i < win.length; i++) {
            layers1[0][i][1] = parseInt(win[i].E);
            layers1[1][i][0] = layers1[0][i][1];
            layers1[1][i][1] = layers1[1][i][0] + parseInt(win[i].F);
            layers1[2][i][0] = layers1[1][i][1];
            layers1[2][i][1] = layers1[2][i][0] + parseInt(win[i].B);
            layers1[3][i][0] = layers1[2][i][1];
            layers1[3][i][1] = layers1[3][i][0] + parseInt(win[i].C);
        }
        layers2 = stack(nominee);
        for (var i = 0; i < nominee.length; i++) {
            layers2[0][i][1] = parseInt(nominee[i].E);
            layers2[1][i][0] = layers2[0][i][1];
            layers2[1][i][1] = layers2[1][i][0] + parseInt(nominee[i].F);
            layers2[2][i][0] = layers2[1][i][1];
            layers2[2][i][1] = layers2[2][i][0] + parseInt(nominee[i].B);
            layers2[3][i][0] = layers2[2][i][1];
            layers2[3][i][1] = layers2[3][i][0] + parseInt(nominee[i].C);
        }
        layers3 = stack(rating);
        for (var i = 0; i < rating.length; i++) {
            layers3[0][i][1] = parseInt(rating[i].E);
            layers3[1][i][0] = layers3[0][i][1];
            layers3[1][i][1] = layers3[1][i][0] + parseInt(rating[i].F);
            layers3[2][i][0] = layers3[1][i][1];
            layers3[2][i][1] = layers3[2][i][0] + parseInt(rating[i].B);
            layers3[3][i][0] = layers3[2][i][1];
            layers3[3][i][1] = layers3[3][i][0] + parseInt(rating[i].C);
        }
		
		if (has_win == false){
			uncheck(layers1,win, "win");
			uncheck(layers2,nominee, "win");
			uncheck(layers3,rating, "win");
		}
		if (has_nom == false){
			uncheck(layers1,win, "nominee");
			uncheck(layers2,nominee, "nominee");
			uncheck(layers3,rating, "nominee");
		}
	
	var s_wins = document.getElementById("sort_wins");
	var s_nominees = document.getElementById("sort_nominees");
	var s_rating = document.getElementById("sort_rating");

	if (s_wins.checked == true){
        barchart(win, layers1, wr);
		ratings(win,wl);
		last_layer = layers1;
        last_sort = win;
	}
	else if (s_nominees.checked == true) {
		barchart(nominee, layers2, wr);
		ratings(nominee,wl);
		last_layer = layers2;
		last_sort = nominee;
	}
	else{
		barchart(rating, layers3, wr);
		ratings(rating,wl);
		last_layer = layers3;
		last_sort = rating;
    }
    
}


// form event listener
function handleClick(button) {
    //d3.selectAll("svg").remove();
	document.getElementById("barchart").innerHTML = "";
	var checkBox = document.getElementById("check_rating");
	var wl, wr;
	if (checkBox.checked == true){
		wl = 180;
		wr = 350;
	}
	else{
		wl = 0;
		wr = 530;
	}
	//provavelmente esta verificacao sai, visto que as vars wl e wr estao definidas globalmente
	// e sao mudadas no handle select
    if (button.value == "nominees") {
        barchart(nominee, layers2, wr);
        ratings(nominee, wl);
		last_layer = layers2;
		last_sort = nominee;
    }
	else if (button.value == "rating"){
		barchart(rating, layers3,wr);
		ratings(rating,wl);
		last_layer = layers3;
		last_sort = rating;
	}
    else {
        barchart(win, layers1, wr);
        ratings(win, wl);
		last_layer = layers1;
		last_sort = win;
    }
}

function handleSelect(){
	var checkBox = document.getElementById("check_rating");

	if (checkBox.checked == true){
		wl = 180;
		wr = 350;
		document.getElementById("sort_rating").disabled = false;
		document.getElementById("sort_rating").style.opacity = 1;
		has_rate = true;
	}
	else{
		document.getElementById("sort_rating").disabled = true;
		document.getElementById("sort_rating").style.opacity = 0.2;
		wl = 0;
		wr = 500;
		has_rate = false;
	}
	document.getElementById("barchart").innerHTML = "";
	barchart(last_sort, last_layer,wr);
    ratings(last_sort,wl);
}

function check(layer, sort, op){
	if (op == "win"){
		for (var i = 0; i < sort.length; i++) {
			layer[0][i][1] = layer[0][i][1] + parseInt(sort[i].E);
			layer[1][i][0] = layer[1][i][0] + parseInt(sort[i].E);
			layer[1][i][1] = layer[1][i][1] + parseInt(sort[i].E) + parseInt(sort[i].F);
			layer[2][i][0] = layer[2][i][0] + parseInt(sort[i].E) + parseInt(sort[i].F);
			layer[2][i][1] = layer[2][i][1] + parseInt(sort[i].E) + parseInt(sort[i].F);
			layer[3][i][0] = layer[3][i][0] + parseInt(sort[i].E) + parseInt(sort[i].F);
			layer[3][i][1] = layer[3][i][1] + parseInt(sort[i].E) + parseInt(sort[i].F);
		}
	}
	else if (op == "nominee"){
		for (var i = 0; i < sort.length; i++) {
			layer[2][i][1] = layer[2][i][0] + parseInt(sort[i].B);
			layer[3][i][0] = layer[2][i][1];
			layer[3][i][1] = layer[3][i][0] + parseInt(sort[i].C);
		}
	}
}

function uncheck(layer, sort, op){
	if (op == "win"){
		for (var i = 0; i < sort.length; i++) {
			layer[0][i][1] = layer[0][i][1] - parseInt(sort[i].E);
			layer[1][i][0] = layer[1][i][0] - parseInt(sort[i].E);
			layer[1][i][1] = layer[1][i][1] - parseInt(sort[i].E) - parseInt(sort[i].F);
			layer[2][i][0] = layer[2][i][0] - parseInt(sort[i].E) - parseInt(sort[i].F);
			layer[2][i][1] = layer[2][i][1] - parseInt(sort[i].E) - parseInt(sort[i].F);
			layer[3][i][0] = layer[3][i][0] - parseInt(sort[i].E) - parseInt(sort[i].F);
			layer[3][i][1] = layer[3][i][1] - parseInt(sort[i].E) - parseInt(sort[i].F);
		}
	}
	else if (op == "nominee"){
		for (var i = 0; i < sort.length; i++) {
			layer[2][i][1] = layer[2][i][0];
			layer[3][i][0] = layer[2][i][1];
			layer[3][i][1] = layer[3][i][0];
		}
	}
}

function handleWins(){
	var checkBoxW = document.getElementById("check_wins");
	if (checkBoxW.checked == true){
		check(layers1,win, "win");
		check(layers2,nominee, "win");
		check(layers3,rating, "win");
		document.getElementById("sort_wins").disabled = false;
		document.getElementById("sort_wins").style.opacity = 1;
		has_win = true;
	}
	else{
		uncheck(layers1,win, "win");
		uncheck(layers2,nominee, "win");
		uncheck(layers3,rating, "win");
		document.getElementById("sort_wins").disabled = true;
		document.getElementById("sort_wins").style.opacity = 0.2;
		has_win = false;
	}
	document.getElementById("barchart").innerHTML = "";
	barchart(last_sort, last_layer,wr);
    ratings(last_sort,wl);
}

function handleNominees(){
	var checkBoxW = document.getElementById("check_nominees");
	if (checkBoxW.checked == true){
		check(layers1,win, "nominee");
		check(layers2,nominee, "nominee");
		check(layers3,rating, "nominee");
		document.getElementById("sort_nominees").disabled = false;
		document.getElementById("sort_nominees").style.opacity = 1;
		has_nom = true;
	}
	else{
		uncheck(layers1,win, "nominee");
		uncheck(layers2,nominee, "nominee");
		uncheck(layers3,rating, "nominee");
		document.getElementById("sort_nominees").disabled = true;
		document.getElementById("sort_nominees").style.opacity = 0.2;
		has_nom = false;
	}
	document.getElementById("barchart").innerHTML = "";
	barchart(last_sort, last_layer,wr);
    ratings(last_sort,wl);
}


function barchart(data, layers, w) {
    //set up svg using margin conventions - we'll need plenty of room on the left for labels
    var margin = {
        top: 5,
        right: 0,
        bottom: 15,
        left: 130
    };

    var width = w - margin.left - margin.right,
        height = 250 - margin.top - margin.bottom;

    var svg = d3.select("#barchart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("id", "bc")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
     

	let max = 0;
	for(let i = 0; i < data.length; i++) {
		if(parseInt(data[i].H) > max) {
			max = parseInt(data[i].H);
		}
    }
    
    // flag to perform a click transition over a TV series
    var selected = false;
		
    var x = d3.scaleLinear()
        .range([0, width])
        .domain([0, max]);

    var y = d3.scaleBand()
        .rangeRound([0, height])
        .padding(0.2)
        .domain(data.map(function (d) {
            return d.A;
        }));

    //make y axis to show bar names
    var yAxis = d3.axisLeft(y)
        //no tick marks
        .tickSize(0);

    var xAxis = d3.axisBottom(x)
        .tickSize(10);

    var gy = svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        // name selection: text goes yellow
        .selectAll(".tick")
        .on("mouseenter", function() {
            d3.select(this)
            .transition()
            .duration(400)
            .style("color", "#f3ce13")
            .style("cursor", "pointer");
        })
        .on("mouseleave", function() {
            d3.select(this)
            .transition()
            .duration(400)
            .style("color", "white")
            .style("cursor", "context-menu");
        })
        .on("click", function(d) {
            var actual = this;
			if (reduced == true && selected && d == selectedShow){
				console.log("sai fora, volta tudo a white");
				var meee = d3.select(".axis").selectAll(".tick").filter(() => d3.select(this) == actual);
				console.log(meee);
				d3.select(".axis").selectAll(".tick")
                .filter(() => d3.select(this) == actual).transition()
                .duration(400)
                .style("opacity", 1.0);
                d3.select(this)
                .transition()
                .duration(400)
                .style("color", "white");
				
				//caso de sai fora volta tudo a white
				d3.select(".axis").selectAll(".tick")
                .transition()
                .duration(400)
                .style("opacity", 1.0);
                d3.select(this)
                .transition()
                .duration(400)
                .style("color", "white");
                selected = false;
			}
			else {
				//muda de serie selecionada - mete a white a nova
				console.log("selecionei uma serie");
				d3.select(".axis").selectAll(".tick")
                .filter(() => d3.select(this) == actual).transition()
                .duration(400)
                .style("opacity", 1.0);
                d3.select(this)
                .transition()
                .duration(400)
                .style("color", "white");
				
				//outras ficam a semi
				d3.select(".axis").selectAll(".tick")
                .filter(() => d3.select(this) !== actual)
                .transition()
                .duration(400)
                .style("opacity", 0.3);
                d3.select(this)
                .transition()
                .duration(400)
                .style("color", "#f3ce13")
                .style("cursor", "pointer");
                selected = true;
			}
            reduceHeatmap(d);
        });

    var gx = svg.append("g")
        .attr("transform", "translate(0," + (height - 7) + ")")
        .attr("class", "x axis")
        .call(xAxis);

    var colors = ["#996600", "#cca300", "#adad85", "#7a7a52"];
    
    var bars = svg.selectAll(".bar")
        .data(layers)
        .enter()
        .append("g")
		.style("fill", function(d, i) { return colors[i]; })
		;

    //append rects
    bars.selectAll("rect")
    .data(function(d) { return d; }).enter()
    .append("rect")
    .attr("class", "bar")
    .attr("id", function(d) {
        return d.index;
    })
    .attr("y", function (d) {
        return y(d.data.A);
    })
    .attr("height", y.bandwidth())
    .attr("x", function (d) {
        return x(d[0]);
    })
    .attr("width", function (d) {
        return x(d[1]) - x(d[0]);
    })
    // mouse events
    .on("mouseenter", function(d) {
        tooltip.style("display", null);
        d3.select(this)
            .transition(100)
            .style("opacity", 0.3)
            .style("cursor", "pointer");
    })
    .on("mouseleave", function() {
        d3.select(this)
            .transition(100)
            .style("opacity", 1)
            .style("cursor", "context-menu");
        tooltip.style("display", "none");
    })
    .on("mousemove", function(d, i) {
        d3.select(this)
            .style("opacity", 0.3);
        tooltip.style("display", null);
        var xPosition = d3.mouse(this)[0] - 20;
        var yPosition = d3.mouse(this)[1] - 25;
        tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
        tooltip.select("text").text(d[1]-d[0]);
    })
	.on('click', function(d, i) {
        var actual = d3.select(this)._groups[0][0].outerHTML;
        var index; 
        var all = svg.selectAll("rect");
        for (var i = 0; i < all._groups[0].length; i++) {
            if (all._groups[0][i].outerHTML === actual) { index = i % data.length; break; }
        }
        console.log(index);
        if (!selected) {
            d3.select(".axis").selectAll(".tick")
            .filter((d, i) => i !== index)
            .transition()
            .duration(400)
            .style("opacity", 0.3);
            d3.select(".axis").selectAll(".tick")
            .filter((d, i) => i === index)
            .transition()
            .duration(400)
            .style("color", "#f3ce13")
            .style("cursor", "pointer");
            selected = true;
        }
        else {
            d3.select(".axis").selectAll(".tick")
            .filter((d, i) => i !== index)
            .transition()
            .duration(400)
            .style("opacity", 1.0);
            d3.select(".axis").selectAll(".tick")
            .filter((d, i) => i === index)
            .transition()
            .duration(400)
            .style("color", "white");
            selected = false;
        }
		reduceHeatmap(d.data.A);				
		//document.getElementById("show").value = d.data.A;
		
	})
	

    // Prep the tooltip bits, initial display is hidden
    var tooltip = svg.append("g")
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
    .attr("font-weight", "bold");

}

function ratings(data, w) {
    //set up svg using margin conventions 
    var margin = {
        top: 5,
        right: 25,
        bottom: 15,
        left: 10
    };

    var width = w - margin.left - margin.right,
        height = 250 - margin.top - margin.bottom;

    var selected = false;

    var svg = d3.select("#barchart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("id", "ratings")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear()
        .range([width, 0])
        .domain([0, 10]);

    var y = d3.scaleBand()
        .rangeRound([0, height])
        .padding(0.2)
        .domain(data.map(function (d) {
            return d.A;
        }));

    //make y axis to show bar names
    var yAxis = d3.axisLeft(y)
        //no tick marks
        .tickSize(0);

    var xAxis = d3.axisBottom(x)
        .tickSize(10);

    var gy = svg.append("g")
        .attr("class", "specialaxis")
        .call(yAxis);

    var gx = svg.append("g")
        .attr("transform", "translate(0," + (height - 7) + ")")
        .attr("class", "x axis")
        .call(xAxis);
    
    var bars = svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("g");

    //append rects
    bars.append("rect")
    .attr("class", "bar_rating")
    .attr("y", function (d) {
        return y(d.A);
    })
    .attr("height", y.bandwidth())
    .attr("x", function (d) {
        return x(d.I);
    })
    .attr("width", function (d) {
        return x(0) - x(d.I);
    });

    // Prep the tooltip bits, initial display is hidden
    var tooltip = svg.append("g")
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
    .attr("font-weight", "bold");

    //mouse effects
    bars.on("mouseenter", function(d) {
        tooltip.style("display", null);
        d3.select(this)
            .transition(100)
            .style("opacity", 0.3)
            .style("cursor", "pointer");
    });

    bars.on("mouseleave", function() {
        d3.select(this)
            .transition(100)
            .style("opacity", 1)
            .style("cursor", "context-menu");
        tooltip.style("display", "none");
    });

    bars.on("mousemove", function(d) {
        d3.select(this)
            .style("opacity", 0.3);
        tooltip.style("display", null);
        var xPosition = d3.mouse(this)[0] - 20;
        var yPosition = d3.mouse(this)[1] - 25;
        tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
        tooltip.select("text").text(parseFloat(d.I).toFixed(1));
    })
	
	bars.on('click', function(d) {
        var actual = d3.select(this)._groups[0][0].innerHTML;
        var index; 
        var all = svg.selectAll("rect");
        for (var i = 0; i < all._groups[0].length; i++) {
            if (all._groups[0][i].outerHTML === actual) { index = i; break; }
        }
        if (!selected) {
            d3.select(".axis").selectAll(".tick")
            .filter((d, i) => i !== index)
            .transition()
            .duration(400)
            .style("opacity", 0.3);
            d3.select(".axis").selectAll(".tick")
            .filter((d, i) => i === index)
            .transition()
            .duration(400)
            .style("color", "#f3ce13")
            .style("cursor", "pointer");
            selected = true;
        }
        else {
            d3.select(".axis").selectAll(".tick")
            .filter((d, i) => i !== index)
            .transition()
            .duration(400)
            .style("opacity", 1.0);
            d3.select(".axis").selectAll(".tick")
            .filter((d, i) => i === index)
            .transition()
            .duration(400)
            .style("color", "white");
            selected = false;
        }
		reduceHeatmap(d.A);
		
	})
}