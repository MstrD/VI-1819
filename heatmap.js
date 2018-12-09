var heatmap_full_win, heatmap_full_nominee, heatmap_win, heatmap_nominee, dataNomineeWithAll, dataWinWithAll, current_heatmap, current_heatmap_data, orig_heatmap_win, orig_heatmap_nom;
var firstyear = 1949, lastyear = 2017, rangeChanged = false;

/*d3.json("actors_nomenies_wins_ratio_place_of_birth_counter.json").then(function(data) {
    data.splice(0, 1);
    data.sort(function(a, b) {
        return b.B - a.B;
    });
    data = data.slice(0, 10);
    console.log(data);
    heatmap(data);
})*/

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
    heatmap_win = heatmap_full_win.sort(function(a, b) {
        return b.wins - a.wins;
    });
    orig_heatmap_win = heatmap_win;
    dataWinWithAll = myFirstSlice(heatmap_win, 10, 1949, 2017);
    heatmap_win = mySlice(heatmap_win, 10);
    heatmap_nominee = heatmap_full_nominee.sort(function(a, b) {
        return b.nominees - a.nominees;
    });
    orig_heatmap_nom = heatmap_nominee;
    dataNomineeWithAll = myFirstSlice(heatmap_nominee, 10, 1949, 2017);
    heatmap_nominee = mySlice(heatmap_nominee, 10);
    current_heatmap = heatmap_nominee;
    current_heatmap_data = dataNomineeWithAll;
    geomap();
    heatmap(heatmap_nominee, dataNomineeWithAll, 1949, 2017);
})

function selectHeatMapData() {
    d3.select("#heatmap").selectAll("svg").remove();
    d3.select("#geomap").selectAll("svg").remove();
    if (!rangeChanged) {
        if (document.getElementById("hm_nominees").checked) {
            current_heatmap = heatmap_nominee;
            current_heatmap_data = dataNomineeWithAll;
            heatmap(heatmap_nominee, dataNomineeWithAll, firstyear, lastyear);
        }
        else {
            current_heatmap = heatmap_win;
            current_heatmap_data = dataWinWithAll;
            heatmap(heatmap_win, dataWinWithAll, firstyear, lastyear);
        }
    }
    else {
        if (document.getElementById("hm_nominees").checked) {
            current_heatmap = heatmap_nominee;
            current_heatmap_data = myFirstSlice(orig_heatmap_nom, 10, firstyear, lastyear);
            heatmap(heatmap_nominee, current_heatmap_data, firstyear, lastyear);
        }
        else {
            current_heatmap = heatmap_win;
            current_heatmap_data = myFirstSlice(orig_heatmap_win, 10, firstyear, lastyear);
            heatmap(heatmap_win, current_heatmap_data, firstyear, lastyear);
        }
    }
    geomap();
}

function selectHeatMapRange() {
    var myfirst = parseInt(document.getElementById("firstyear").value), mylast = parseInt(document.getElementById("lastyear").value);
    var myAllData;
    if (1949 <= myfirst <= 2017 && 1949 <= mylast <= 2017) {
        if (myfirst < mylast) {
            firstyear = myfirst;
            lastyear = mylast;
            if (document.getElementById("hm_nominees").checked)
                myAllData = myFirstSlice(orig_heatmap_nom, 10, myfirst, mylast);
            else
                myAllData = myFirstSlice(orig_heatmap_win, 10, myfirst, mylast);
            current_heatmap_data = myAllData;
            rangeChanged = true;
            d3.select("#heatmap").selectAll("svg").remove();
            heatmap(current_heatmap, myAllData, myfirst, mylast);
        }
    }
}

function heatmap(data, dataWithAll, firstyear, lastyear) {
    var margin = {
        top: 40,
        right: 0,
        bottom: 15,
        left: 100
    };

    var width = 700 - margin.left - margin.right,
        height = 250 - margin.top - margin.bottom;

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
        .call(yAxis);

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