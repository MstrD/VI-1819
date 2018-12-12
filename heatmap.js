//dados iniciais
var heatmap_full_win, heatmap_full_nominee;
//10 melhores atores (so nome)
var heatmap_win, heatmap_nominee;
// 10 melhores com linhas todos os anos
var dataNomineeWithAll, dataWinWithAll;
//qual e o atual
var current_heatmap, current_heatmap_data;
//original com tudo tudo (same ref que vars full)
var orig_heatmap_win, orig_heatmap_nom;
var firstyear = 1949, lastyear = 2017, reduced=false;
var selectedShow = null;

function reduceHeatmap(show){
	//fazer verificacao se esta reduced ou nao para poder voltar atras
	if (reduced == true && show == selectedShow){ //queremos voltar ao geral
			console.log("voltar heatmap original");
			heatmap_full_win = orig_heatmap_win;
			heatmap_full_nominee = orig_heatmap_nom;

			dataWinWithAll = RangeAnosChanged(heatmap_full_win, 10, firstyear, lastyear, "wins");
			heatmap_win = mySlice(dataWinWithAll, 10);
			dataNomineeWithAll = RangeAnosChanged(heatmap_full_nominee, 10, firstyear, lastyear, "nominees");
			heatmap_nominee = mySlice(dataNomineeWithAll, 10);
			reduced = false;
			selectedShow = null;
			atualizaHeatmap();
	}
	else{
		console.log("reduzir heatmap");
		var dataWeWant = [];
		var aux_win = [];
		var new_win = [];
		var new_nominee = [];
		var aux_nominee = [];
		reduced = true;
		selectedShow = show;
		d3.json("shows-and-each-actors.json").then(function (dataS) {
			dataS.splice(0, 1);
			for (var i = 0; i < dataS.length; i++) {
				if (dataS[i].A == show) dataWeWant.push(dataS[i]);
			}
			dataWeWant = dataWeWant.slice(0, dataWeWant.length);
			for (var j = 0; j < dataWeWant.length; j++) {
				for (var i = 0; i < orig_heatmap_win.length; i++) {
					if (orig_heatmap_win[i].nominee == dataWeWant[j].B) {
						aux_win.push(orig_heatmap_win[i]);
						continue;
					}
				}
			}
			aux_nominee = JSON.parse(JSON.stringify(aux_win));
			//reduzir sets iniciais
			heatmap_full_win = aux_win;
			heatmap_full_nominee = aux_nominee;
			dataWinWithAll = RangeAnosChanged(heatmap_full_win, 10, firstyear, lastyear, "wins");
			dataNomineeWithAll = RangeAnosChanged(heatmap_full_nominee, 10, firstyear, lastyear, "nominees");
			heatmap_win = mySlice(dataWinWithAll, 10);
			heatmap_nominee = mySlice(dataNomineeWithAll, 10);
			
			atualizaHeatmap();
		});
	}
	
}

function atualizaHeatmap(){
	if (document.getElementById("hm_nominees").checked){
		current_heatmap_data = dataNomineeWithAll;
		current_heatmap = heatmap_nominee;
	}
    else{
		current_heatmap_data = dataWinWithAll;
		current_heatmap = heatmap_win;
	}
    d3.select("#heatmap").selectAll("svg").remove();
	heatmap(current_heatmap, current_heatmap_data, firstyear, lastyear);
	d3.select("#geomap").selectAll("svg").remove();
	geomap();
}

//limita a "data" com os anos selecionados no form
function myFirstSlice(data, limit, firstyear, lastyear) {
    var act = 0;
    var namesRead = [];
    var dataFinal = [];
    for (var i = 0; i < data.length; i++) {
        if (namesRead.includes(data[i].nominee));
        else {
            act++;
            namesRead.push(data[i].nominee);
        }
        if (firstyear <= data[i].year && data[i].year <= lastyear)
            dataFinal.push(data[i]);
        if (namesRead.length == limit + 1) {
            if (firstyear == 1949)
                dataFinal.pop();
            break;
        }
    }
    return dataFinal;
}


function SelecionaAnos(data, firstyear, lastyear) {
    var dataFinal = [];
	//percorre tudo fica com linhas so dos anos certos
    for (var i = 0; i < data.length; i++) {
        if (firstyear <= data[i].year && data[i].year <= lastyear)
            dataFinal.push(data[i]); 
    }
    return dataFinal;
}

function RecontaWinsNominees(data, firstyear, lastyear){
	var i = 0;
	for(i; i< data.length; i++){
		//conta wins e nominees
		var wins = 0; 
		var nominees = 0;
		//console.log(data[i].year);
		//tem de ser um while a verificar o ano...
		var j=0;
		var linhas = 0;
		var nominee = data[i].nominee;
		//console.log(i);
		while(i+j< data.length && data[i+j].year <= lastyear && data[i+j].nominee == nominee){
			if (data[i+j].winner == 1)
				wins++;
			else if (data[i+j].winner == 0)
				nominees++;
			else ;
			linhas++;
			j++;
			
		}
		//atualiza este valor em todas as linhas
		for(var y=0; y < linhas; y++ ){
			data[i+y].wins = wins;
			data[i+y].nominees = nominees;
		}
		i = i + linhas-1; //proxima pessoa
	}
	
	return data;
}

function CortaLinhas(data, limit){
	var act = 0;
    var namesRead = [];
    var dataFinal = [];
    for (var i = 0; i < data.length; i++) {
        if (namesRead.includes(data[i].nominee));
        else {
            act++;
            namesRead.push(data[i].nominee);
        }
        if (namesRead.length == limit + 1) {
            break;
        }
		dataFinal.push(data[i]);
    }
    return dataFinal;
}

function RangeAnosChanged(data, limit, firstyear, lastyear, order){

	var data_anos_selec = SelecionaAnos (data, firstyear, lastyear);
	//atualiza data anterior com wins e nominees dess eintervalo

	var data_reconta_wins_nominees = RecontaWinsNominees(data_anos_selec, firstyear, lastyear);
	//ordena pelo pretendido

	var data_new;
	if (order == "wins"){
		//ordenar por wins novas
		data_new = data_reconta_wins_nominees.sort(function(a, b) {
			return b.wins - a.wins;
		});
	}
	else {
		//ordenar por nominees novas
		data_new = data_reconta_wins_nominees.sort(function(a, b) {
			return b.nominees - a.nominees;
		});
	}
	
	//corta os x de limit no num e atores select
	data_final = CortaLinhas(data_new, limit);
	//depois passar este ao myslice para tirar os nomes...
	return data_final;
}

//limita a data apenas em x elementos, da os nomes apenas (1 linha por cada)
function mySlice(data, limit) {
    var act = 0;
    var namesRead = [];
    var dataFinal = [];
    for (var i = 0; i < data.length; i++) {
        if (namesRead.includes(data[i].nominee)) {
            continue;
        }
        else {
            act++;
            namesRead.push(data[i].nominee);
            dataFinal.push(data[i]);
            if (act == limit)
                break;
        }
    }
    return dataFinal;
}

d3.json("final_results.json").then(function(data) {
    heatmap_full_win = data;
    heatmap_full_nominee = JSON.parse(JSON.stringify(data));
	
	//wins
    heatmap_win = heatmap_full_win.sort(function(a, b) {
        return b.wins - a.wins;
    });
    orig_heatmap_win = heatmap_win;
	
	//data final wins
	console.log("vou limitar os anos por 1949 e 2017 inicio - wins");
    dataWinWithAll = RangeAnosChanged(orig_heatmap_win, 10, 1949, 2017, "wins");
	console.log("vou limitar a 10 atores");
	heatmap_win = mySlice(dataWinWithAll, 10);
	
	
	//nominees
    heatmap_nominee = heatmap_full_nominee.sort(function(a, b) {
        return b.nominees - a.nominees;
    });
    orig_heatmap_nom = heatmap_nominee;
	
	//data final nominees
	console.log("vou limitar os anos por 1949 e 2017 inicio - nominees");
	dataNomineeWithAll = RangeAnosChanged(orig_heatmap_nom, 10, 1949, 2017, "nominees");
	heatmap_nominee = mySlice(dataNomineeWithAll, 10);
	
	//comecamos com os nominees
    current_heatmap = heatmap_nominee;
    current_heatmap_data = dataNomineeWithAll;
    geomap();
    heatmap(heatmap_nominee, dataNomineeWithAll, 1949, 2017);
})

function selectHeatMapData() {
    atualizaHeatmap();
}

function selectHeatMapRange() {
    var myfirst = parseInt(document.getElementById("firstyear").value), mylast = parseInt(document.getElementById("lastyear").value);
    var myAllData;
    if (1949 <= myfirst <= 2017 && 1949 <= mylast <= 2017) {
        if (myfirst < mylast) {
            firstyear = myfirst;
            lastyear = mylast;
			//limitar aos anos selecionados a data de ambos 
			//dataWinWithAll = myFirstSlice(orig_heatmap_win, 10, myfirst, mylast);
			//dataNomineeWithAll = myFirstSlice(orig_heatmap_nom, 10, myfirst, mylast);
			dataWinWithAll = RangeAnosChanged(heatmap_full_win, 10, myfirst, mylast, "wins");
			dataNomineeWithAll = RangeAnosChanged(heatmap_full_nominee, 10, myfirst, mylast, "nominees");
			heatmap_win = mySlice(dataWinWithAll, 10);
			heatmap_nominee = mySlice(dataNomineeWithAll, 10);
			
            atualizaHeatmap();
        }
    }
}

function heatmap(data, dataWithAll, firstyear, lastyear) {
    var margin = {
        top: 10,
        right: 0,
        bottom: 15,
        left: 130
    };

    var width = 750 - margin.left - margin.right,
        height = 230 - margin.top - margin.bottom;

    var years = []
    for (var i = firstyear; i <= lastyear+1; i++) {
        years.push(i);
    }

    var colors = ["#1c1f24", "#996600", "#adad85"];
    var actors_years;

    var gridSize = Math.floor(width / years.length),
        legendElementWidth = gridSize*2;

    var svg = d3.select("#heatmap").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear()
        .range([0, width])
        .domain([years[0], years[years.length - 1]]);

    var y = d3.scaleBand()
        .rangeRound([0, height])
        .padding(0.2)
        .domain(data.map(function (d) {
            return d.nominee;
        }));

    //make y axis to show bar names
    var yAxis = d3.axisLeft(y)
        //no tick marks
        .tickSize(0);

    var xAxis = d3.axisBottom(x)
        .tickSize(10)
        .tickFormat(d3.format("d"));

    var gy = svg.append("g")
        .attr("class", "hm_axis")
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
            .style("color", "white");
        });

    var gx = svg.append("g")
        .attr("transform", "translate(0," + (height - 7) + ")")
        .attr("class", "axis")
        .call(xAxis);

    const cards = svg.selectAll(".hour")
        .data(dataWithAll, (d) => d);

    cards.enter().append("rect")
        .attr("x", ((d) => x(d.year)))
        .attr("y", (d) => y(d.nominee))
        //.attr("rx", 2)
        //.attr("ry", 2)
        .attr("class", "hm_stuff")
        .attr("width", gridSize)
        .attr("height", y.bandwidth())
        .style("fill", colors[0])
        .merge(cards)
        .transition()
        .duration(2000)
        .style("fill", function(d) {
            if (d.winner == 1) return colors[1];
            else if (d.winner == 0) return colors[2];
            else return colors[0];
        });

    //cards.exit().remove();
}