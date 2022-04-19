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
            cities = cities.filter(d => d[1][0]['Coal'] > d3.mean(emissions, d => d.Coal))
        }
        if (_subset == 'Gas') {
            cities = cities.filter(d => d[1][0]['Gas'] > d3.mean(emissions, d => d.Gas))
        }
        if (_subset == 'Oil') {
            cities = cities.filter(d => d[1][0]['Oil'] > d3.mean(emissions, d => d.Oil))
        }
        if (_subset == 'Nuclear') {
            cities = cities.filter(d => d[1][0]['Nuclear'] > d3.mean(emissions, d => d.Nuclear))
        }
        if (_subset == 'Hydro') {
            cities = cities.filter(d => d[1][0]['Hydro'] > d3.mean(emissions, d => d.Hydro))
        }
        if (_subset == 'Bioenergy') {
            cities = cities.filter(d => d[1][0]['Bioenergy'] > d3.mean(emissions, d => d.Bioenergy))
        }
        if (_subset == 'Wind') {
            cities = cities.filter(d => d[1][0]['Wind'] > d3.mean(emissions, d => d.Wind))
        }
        if (_subset == 'Geothermal') {
            cities = cities.filter(d => d[1][0]['Geothemal'] > d3.mean(emissions, d => d.Geothemal))
        }
        if (_subset == 'Solar') {
            cities = cities.filter(d => d[1][0]['Solar'] > d3.mean(emissions, d => d.Solar))
        }
        if (_subset == 'Other') {
            cities = cities.filter(d => d[1][0]['Other'] > d3.mean(emissions, d => d.Other))
        }

        if (_subset == 'BASIC') {
            cities = cities.filter(d => d[1][0]['Total (Traditional)'] == 0)
        }

        if (_subset == 'Traditional') {
            cities = cities.filter(d => d[1][0]['Total(BASIC)'] === 0)
        }

        if (_subset == 'Renewable') {
            cities = cities.filter(d => d[1][0]['Reneweable'] > d[1][0]['Non-Renewable'])
        }

        if (_subset == 'Non-Renewable') {
            cities = cities.filter(d => d[1][0]['Non-Renewable'] > d[1][0]['Reneweable'])
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
                    document.getElementById("cityIDfromMap").innerHTML = d[1][0]['ID']; //write to HYML trick from: https://sebhastian.com/display-javascript-variable-html/
                    //var cities_plot = new city_scatterplot("scatter_plot", emissions)
                    console.log(d[1][0]['ID'])
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