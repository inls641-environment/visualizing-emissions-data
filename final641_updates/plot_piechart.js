//copied and modified from https://d3-graph-gallery.com/graph/pie_annotation.html

var pie_width = 350
    pie_height = 350
    pie_margin = 30

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
var radius = Math.min(pie_width, pie_height) / 2 - pie_margin

class city_piechart{
    constructor(container_id, emissions) {
        this.container_id = container_id;
        this.emissions = emissions;
        this.svg = d3.select('#'+this.container_id)

        this.render()
    }
    render() {
        //create new array of cities with average renewable and nonrenewable
        let cities = Array.from(d3.group(emissions, d => d.ID));
        //console.log(cities)

        var avgDataset = [] 
        for (let cityIndex in cities) {
                let cityId = cities[cityIndex][1][0]['ID'];
                let cityName = cities[cityIndex][1][0]['AccountName'];
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

                //console.log(cityName + '    ' + nonRenew + '     ' + renew)
                avgDataset.push({'ID': cityId, 'city': cityName, "Coal": coal_avg, "Gas": gas_avg, "Oil": oil_avg, 
                                "Nuclear": nuclear_avg, "Hydro": hydro_avg, "Bioenergy": bioenergy_avg, "Wind": wind_avg, 
                                "Geothemal": geothermal_avg, "Solar": solar_avg, "Other": other_avg
                                })
            };

        // append the svg object to the div called 'my_dataviz'
        const g = this.svg.append("g")
                .attr("width", pie_width)
                .attr("height", pie_height)
            .append("g")
                .attr("transform", "translate(" + pie_width / 2 + "," + pie_height / 2 + ")");

        // Create dummy data
        var testCity = avgDataset[0];
        const individual_data = {"Coal": testCity['Coal'], "Gas":testCity['Gas'], "Oil": testCity['Oil'], 
                    "Nuclear": testCity['Nuclear'], "Hydro": testCity['Hydro'], "Bioenergy": testCity['Bioenergy'], "Wind": testCity['Wind'], 
                    "Geothemal": testCity['Geothermal'], "Solar": testCity['Solar'], "Other": testCity['Other']};
        console.log(individual_data);
        
        //remove sources with 0 or undefined values
        //for (let resource in individual_data) {
        //    if (!Number(individual_data[resource]) || individual_data[resource] === 0){
        //        console.log(resource);
        //        console.log(individual_data[resource]);
        //        console.log(index)
        //    };
        //};


        console.log(individual_data);

        // set the color scale
        const color = d3.scaleOrdinal().range(d3.schemeSet2);

        // Compute the position of each group on the pie:
        const pie = d3.pie().value(function(d) {return d[1]})
        const data_ready = pie(Object.entries(individual_data))

        // shape helper to build arcs:
        const arcGenerator = d3.arc()
            .innerRadius(0)
            .outerRadius(radius)

        // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
        g.selectAll('mySlices').data(data_ready).join('path')
            .attr('d', arcGenerator)
            .attr('fill', function(d){ return(color(d.data[0])) })
            .attr("stroke", "black")
            .style("stroke-width", "2px")
            .style("opacity", 0.7)

        // Now add the annotation. Use the centroid method to get the best coordinates
        g.selectAll('mySlices').data(data_ready).join('text')
            .text(function(d){ return d.data[0]})
            .attr("transform", function(d) { return `translate(${arcGenerator.centroid(d)})`})
            .style("text-anchor", "middle")
            .style("font-size", 17)
        }
}
