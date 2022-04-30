//coding examples and modifications from
//https://d3-graph-gallery.com/graph/density_basic.html
//https://d3-graph-gallery.com/graph/histogram_coloredTail.html
//https://stackoverflow.com/questions/57751840/density-plot-using-a-list-of-integers
//https://stackoverflow.com/questions/59447584/label-above-d3-chart-itself

// set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 30, left: 50},
    width = 400 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;

// Function to compute density
function kernelDensityEstimator(kernel, X) {
    return function(V) {
        return X.map(function(x) {
            return [x, d3.mean(V, function(v) { return kernel(x - v); })];
        });
    };
}

function kernelEpanechnikov(k) {
    return function(v) {
        return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
        };
    }

function get_interest_resource () {
        var resource = document.getElementById("resourcebox").value;
        console.log(resource);
        //if the energy box isnt renewable or nonrenewable
        if (resource === 'all') {
            var tot_Box = document.getElementById("energybox").value;
            //replace interest resource with total variable if renewable or non renewable
            if (tot_Box === "all") {
                resource = "Non-Renewable"
            }
            else {
                resource = tot_Box
            }
        }
        return resource
    }

class city_histogram{
    constructor(container_id, emissions, selected_city) {
        this.container_id = container_id;
        this.emissions = emissions;
        this.selected_city = selected_city;
        this.svg = d3.select('#'+this.container_id)
        this.render(selected_city)
    }
    render(selected_city) {
        d3.selectAll("#" +this.container_id +"> *").remove(); //https://stackoverflow.com/questions/22452112/nvd3-clear-svg-before-loading-new-chart
        
        //create new array of cities with average renewable and nonrenewable
        let cities = Array.from(d3.group(emissions, d => d.ID));
        //console.log('histogram')
        let interest_resource = get_interest_resource()
        //console.log(interest_resource)

        var avgIndDataset = []
        var avgTotDataset = []
        for (let cityIndex in cities) {
            let cityId = cities[cityIndex][1][0]['ID'];
            let cityName = cities[cityIndex][1][0]['AccountName'];
            let renew_avg = d3.mean(cities[cityIndex][1], d => d.Reneweable) * 100;
            let nonrenew_avg = d3.mean(cities[cityIndex][1], d => d.NonRenewable) * 100;
            let coal_avg = d3.mean(cities[cityIndex][1], d => d.Coal);
            let gas_avg = d3.mean(cities[cityIndex][1], d => d.Gas);
            let oil_avg = d3.mean(cities[cityIndex][1], d => d.Oil);
            let nuclear_avg = d3.mean(cities[cityIndex][1], d => d.Nuclear);
            let hydro_avg = d3.mean(cities[cityIndex][1], d => d.Hydro);
            let bioenergy_avg = d3.mean(cities[cityIndex][1], d => d.Bioenergy);
            let wind_avg = d3.mean(cities[cityIndex][1], d => d.Wind);
            let geothermal_avg = d3.mean(cities[cityIndex][1], d => d.Geothermal);
            let solar_avg = d3.mean(cities[cityIndex][1], d => d.Solar);
            let other_avg = d3.mean(cities[cityIndex][1], d => d.Other);

            avgTotDataset.push({'ID': cityId, 'city': cityName, 
                    "Renewable": renew_avg, "Non-Renewable": nonrenew_avg,
                    "Coal": coal_avg, "Gas": gas_avg, "Oil": oil_avg,
                    "Nuclear": nuclear_avg, "Hydro": hydro_avg, "Bioenergy": bioenergy_avg, "Wind": wind_avg,
                    "Geothemal": geothermal_avg, "Solar": solar_avg, "Other": other_avg
                })

            if (selected_city === cityId) {
                avgIndDataset.push({'ID': cityId, 'city': cityName,
                    "Renewable": renew_avg, "Non-Renewable": nonrenew_avg,
                    "Coal": coal_avg, "Gas": gas_avg, "Oil": oil_avg,
                    "Nuclear": nuclear_avg, "Hydro": hydro_avg, "Bioenergy": bioenergy_avg, "Wind": wind_avg,
                    "Geothemal": geothermal_avg, "Solar": solar_avg, "Other": other_avg
                })
            }
        };

        //create full dataset with average of each city for a given resource
        var fulldata = []
        for (const key in avgTotDataset) {
            for (const key1 in avgTotDataset[key]) {
                if (key1 === interest_resource) {
                    fulldata.push(avgTotDataset[key][key1])
                }
            }
        };

        // append the svg object to the body of the page
        let g = this.svg.append("g")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

        // Create dummy data
        var testCity = avgIndDataset[0];
        const individual_data = {"Coal": testCity['Coal'], "Gas":testCity['Gas'], "Oil": testCity['Oil'],
            "Nuclear": testCity['Nuclear'], "Hydro": testCity['Hydro'], "Bioenergy": testCity['Bioenergy'], "Wind": testCity['Wind'],
            "Geothemal": testCity['Geothermal'], "Solar": testCity['Solar'], "Other": testCity['Other']};
        console.log(testCity['city']);


        //remove sources with 0 or undefined values
        for (let resource in individual_data) {
            if (!Number(individual_data[resource]) || individual_data[resource] === 0){
                delete individual_data[resource];
            }
        };

        //create title
        document.getElementById('histo_text').innerHTML = interest_resource + ' histogram for ' + testCity['city'];

        var min = d3.min(fulldata);
        var max = d3.max(fulldata);
        var domain = [min,max];

        // The number of bins
        var Nbin = 10;

        // X axis: scale and draw
        var x = d3.scaleLinear()
            .domain(domain)
            .range([0, width]);
        
        g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        var histogram = d3
            .histogram()
            .domain(x.domain()) // then the domain of the graphic
            .thresholds(x.ticks(Nbin)); // then the numbers of bins

        // And apply this function to data to get the bins
        var bins = histogram(fulldata);

        //y-axis: scale and draw
        let maxY = d3.max(bins, function(d) {
            return d.length;
            })
        var y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, maxY]);

        g.append("g")
            .call(d3.axisLeft(y));
        
        //plot histogram
        g.selectAll("rect")
            .data(bins)
            .enter()
            .append("rect")
            .attr("x", 1)
            .attr("transform", function(d) {
                    return "translate(" + x(d.x0) + "," + y(d.length) + ")";
                })
            .attr("width", function(d) {
                    return x(d.x1) - x(d.x0);
                })
            .attr("height", function(d) {
                    return height - y(d.length);
                })
            .style("fill", "#69b3a2");
        
        // Append a vertical line to highlight the separation for city of interest
        let cityValue = testCity[interest_resource].toFixed(2)
        g.append("line")
            .attr("x1", x(cityValue) )
            .attr("x2", x(cityValue) )
            .attr("y1", y(0))
            .attr("y2", y(maxY))
            .attr("stroke", "black")
            .attr("stroke-dasharray", "4")
        g.append("text")
            .attr("x", x(cityValue))
            .attr("y", y(10))
            .text(testCity['city'] + ": " + cityValue)
            .style("font-size", "15px")
            .attr("text-anchor", "left")

        // Append a vertical line to highlight the separation for US average
        let USavg = Math.round(d3.mean(fulldata))
        g.append("line")
            .attr("x1", x(USavg) )
            .attr("x2", x(USavg) )
            .attr("y1", y(0))
            .attr("y2", y(maxY))
            .attr("stroke", "grey")
            .attr("stroke-dasharray", "4")
        g.append("text")
            .attr("x", x(USavg))
            .attr("y", y(25))
            .text("US average: " + USavg)
            .style("font-size", "15px")
            .attr("text-anchor", "left")
    }
}