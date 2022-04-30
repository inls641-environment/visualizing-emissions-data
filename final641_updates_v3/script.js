//  let us_map_data = async () => {
//      return await d3.json("us-states.json").then(function(data) {
//          console.log(data)
//          return data[0]
//      })
//  }
//
// console.log(us_map_data)

class USA_MAP {
    constructor(container_id, emissions) {
        this.container_id = container_id;
        this.emissions = emissions;
        this.svg = d3.select('#'+this.container_id)

    };

    async render(_subset) {

        // Index the state data by state name for easy lookup.
        let us_map_data = await d3.json('us-states.json', d => d)
        //console.log(us_map_data)

        // Create a projection.
        let projection = d3.geoAlbersUsa()
            .translate([1000 / 2, 600 / 2]) // translate to center of the SVG element.
            .scale([1000]); // scale the projection so see the entire US

        // Define the path generator using the projection.
        let path = d3.geoPath().projection(projection);

        // Select the SVG element for the map.
        let svg = d3.select("#us_map");

        let cities = Array.from(d3.group(emissions, d => d.AccountName));

        if (_subset == 'Coal') {
            cities = cities.filter(d => d3.mean(d[1], x => x.Coal) > d3.mean(emissions, d => d.Coal))
            cities.forEach(d => console.log('Coal Average: ' + d3.mean(d[1], x => x.Coal) + 'National Average: ' + d3.mean(emissions, d => d.Coal)))
        }
        if (_subset == 'Gas') {
            cities = cities.filter(d => d3.mean(d[1], x => x.Gas) > d3.mean(emissions, d => d.Gas))
            cities.forEach(d => console.log('Gas Average: ' + d3.mean(d[1], x => x.Gas)))
        }
        if (_subset == 'Oil') {
            cities = cities.filter(d => d3.mean(d[1], x => x.Oil) > d3.mean(emissions, d => d.Oil))
            cities.forEach(d => console.log('Oil Average: ' + d3.mean(d[1], x => x.Oil)))
        }
        if (_subset == 'Nuclear') {
            cities = cities.filter(d => d3.mean(d[1], x => x.Nuclear) > d3.mean(emissions, d => d.Nuclear))
            cities.forEach(d => console.log('Nuclear Average: ' + d3.mean(d[1], x => x.Nuclear)))
        }
        if (_subset == 'Hydro') {
            cities = cities.filter(d => d3.mean(d[1], x => x.Hydro) > d3.mean(emissions, d => d.Hydro))
            cities.forEach(d => console.log('Hydro Average: ' + d3.mean(d[1], x => x.Hydro)))
        }
        if (_subset == 'Bioenergy') {
            cities = cities.filter(d => d3.mean(d[1], x => x.Bioenergy) > d3.mean(emissions, d => d.Bioenergy))
            cities.forEach(d => console.log('Bioenergy Average: ' + d3.mean(d[1], x => x.Bioenergy)))
        }
        if (_subset == 'Wind') {
            cities = cities.filter(d => d3.mean(d[1], x => x.Wind) > d3.mean(emissions, d => d.Wind))
            cities.forEach(d => console.log('Wind Average: ' + d3.mean(d[1], x => x.Wind)))
        }
        if (_subset == 'Geothermal') {
            cities = cities.filter(d => d3.mean(d[1], x => x.Geothemal) > d3.mean(emissions, d => d.Geothemal))
            cities.forEach(d => console.log('Geothermal Average: ' + d3.mean(d[1], x => x.Geothemal)))
        }
        if (_subset == 'Solar') {
            cities = cities.filter(d => d3.mean(d[1], x => x.Solar) > d3.mean(emissions, d => d.Solar))
            cities.forEach(d => console.log('Solar Average: ' + d3.mean(d[1], x => x.Solar)))
        }
        if (_subset == 'Other') {
            cities = cities.filter(d => d3.mean(d[1], x => x.Other) > d3.mean(emissions, d => d.Other))
            cities.forEach(d => console.log('Other Average: ' + d3.mean(d[1], x => x.Other)))
        }

        if (_subset == 'BASIC') {
            cities = cities.filter(d => d[1][0]['Total (Traditional)'] == 0)
        }

        if (_subset == 'Traditional') {
            cities = cities.filter(d => d[1][0]['Total(BASIC)'] === 0)
        }

        if (_subset == 'Renewable') {
            cities = cities.filter(d => d3.mean(d[1], x => x.Reneweable) > d3.mean(d[1], y => y.NonRenewable))
        }

        if (_subset == 'Non-Renewable') {
            cities = cities.filter(d => d3.mean(d[1], x => x.Reneweable) < d3.mean(d[1], y => y.NonRenewable))
        }

        // Define a color scale for the map.
        //let colormap = d3.scaleLinear().domain([10,30]).range(["silver", "red"]);

        // draw state lines
        this.svg.append("g")
            .attr("class", "states")
            .selectAll("path")
            .data(us_map_data.features)
            .enter().append("path")
            .attr("fill", 'peachpuff')
            .attr("d", path)
            .attr("stroke", "grey")



        this.svg.selectAll(".city").data(cities, d=> d).join(

            enter => enter.append('circle')
                .attr("class", "city")
                .attr("cx", d => {
                    return projection([d[1][0]['long'], d[1][0]['lat']])[0]
                })
                .attr("cy", d => {
                    return projection([d[1][0]['long'], d[1][0]['lat']])[1]
                })
                .attr("r", 4)
                .attr("fill", "white")
                .attr("stroke", "black")
                .on("click", (event,d) => {
                    document.getElementById("cityIDfromMap").innerHTML = "Selected City: " + d[1][0]['AccountName']; //write to HYML trick from: https://sebhastian.com/display-javascript-variable-html/
                    //var cities_plot = new city_scatterplot("scatter_plot", emissions)
                    console.log(d[1][0]['ID']);
                    document.getElementById('cityname').innerHTML = 'Selected City: ' + d[1][0]['AccountName'] + '<br />';
                    document.getElementById("emissionsinfo").innerHTML = "The " + d[1][0]['AccountName'] +
                        " gets " + Math.round(d3.mean(d[1], x => x.Reneweable) * 100) + "% of their energy from renewable sources." + '<br />'
                    + "Over the time period of our data, they reported an average of " + Math.round(d3.mean(d[1], x => x['Total (Traditional)'])) + ' metric tonnes of CO2 emitted under the traditional reporting framework.' +
                    'They also reported an average of ' + Math.round(d3.mean(d[1], x => x['Total(BASIC)'])) + ' metric tonnes of CO2 emitted under the BASIC reporting framework.';

                    var city_pie = new city_piechart("ummm_pie", emissions, d[1][0]['ID']);
                })
                //.on("mouseover", (event, d) => {
                //    document.getElementById("details").innerHTML = "The " + d[1][0]['AccountName'] +
                //        " gets " + Math.round(d[1][0]['Reneweable'] * 100) + "% of their energy from renewable sources.";
                //})
                //.on("mouseout", (event, d) => {
                //    document.getElementById("details").innerHTML = ""})

                .raise(),

            update => update.raise(),

            exit => exit.remove())

        //this.svg.on("click", function(event,d) { console.log(d.cities); });
    }
};

// let cities_map = new USA_MAP("us_map");
// //let path_data = d3.json('us-states.json');
// cities_map.render("us");