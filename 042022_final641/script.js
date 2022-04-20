//  let us_map_data = async () => {
//      return await d3.json("us-states.json").then(function(data) {
//          console.log(data)
//          return data[0]
//      })
//  }
//
// console.log(us_map_data)






class USA_MAP {
    constructor(container_id, avg_emissions) {
        this.container_id = container_id;
        this.avg_emissions = this.avg_emissions
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
        //console.log(avg_emissions)
        let cities = Array.from(d3.group(avg_emissions, d => d.City));

        if (_subset == 'Coal') {
            cities = cities.filter(d => d['Coal'] > d3.mean(avg_emissions, d => d.Coal))
        }
        if (_subset == 'Gas') {
            cities = cities.filter(d => d['Gas'] > d3.mean(avg_emissions, d => d.Gas))
        }
        if (_subset == 'Oil') {
            cities = cities.filter(d => d['Oil'] > d3.mean(avg_emissions, d => d.Oil))
        }
        if (_subset == 'Nuclear') {
            cities = cities.filter(d => d['Nuclear'] > d3.mean(avg_emissions, d => d.Nuclear))
        }
        if (_subset == 'Hydro') {
            cities = cities.filter(d => d['Hydro'] > d3.mean(avg_emissions, d => d.Hydro))
        }
        if (_subset == 'Bioenergy') {
            cities = cities.filter(d => d['Bioenergy'] > d3.mean(avg_emissions, d => d.Bioenergy))
        }
        if (_subset == 'Wind') {
            cities = cities.filter(d => d['Wind'] > d3.mean(avg_emissions, d => d.Wind))
        }
        if (_subset == 'Geothermal') {
            cities = cities.filter(d => d['Geothemal'] > d3.mean(avg_emissions, d => d.Geothemal))
        }
        if (_subset == 'Solar') {
            cities = cities.filter(d => d['Solar'] > d3.mean(avg_emissions, d => d.Solar))
        }
        if (_subset == 'Other') {
            cities = cities.filter(d => d['Other'] > d3.mean(avg_emissions, d => d.Other))
        }

        //if (_subset == 'BASIC') {
        //    cities = cities.filter(d => d[1][0]['Total (Traditional)'] == 0)
        //    }

        //if (_subset == 'Traditional') {
        //    cities = cities.filter(d => d[1][0]['Total(BASIC)'] === 0)
        //    }

        if (_subset == 'Renewable') {
            cities = cities.filter(d => d['Renewable'] > d['Non-Renewable'])
        }

        if (_subset == 'Non-Renewable') {
            cities = cities.filter(d => d['Non-Renewable'] > d['Renewable'])
        }

        // Define a color scale for the map.
        //let colormap = d3.scaleLinear().domain([10,30]).range(["silver", "red"]);

        // draw state lines
        this.svg.append("g")
            .attr("class", "states")
            .selectAll("path")
            .data(us_map_data.features)
            .enter().append("path")
            .attr("fill", 'green')
            .attr("d", path)

        this.svg.selectAll(".city").data(cities, d=> d).join(

            enter => enter.append('circle')
                .attr("class", "city")
                .attr("cx", d => {
                    //console.log('city plotting')
                    //console.log(d)
                    //console.log(d[1][0]['longitude'])
                    //console.log(d[1][0]['latitude'])
                    //console.log(projection([d[1][0]['longitude'], d[1][0]['latitude']]))
                    return projection([d[1][0]['longitude'], d[1][0]['latitude']])[0]
                })
                .attr("cy", d => {
                    return projection([d[1][0]['longitude'], d[1][0]['latitude']])[1]
                })
                .attr("r", 4)
                .attr("fill", "black")
                .on("mouseover", (event, d) => {
                    document.getElementById("details").innerHTML = "The " + d[1][0]['City'] + " gets " + Math.round(d[1][0]['Reneweable'] * 100) + "% of their energy from renewable sources.";
                })
                .on("mouseout", (event, d) => {
                    document.getElementById("details").innerHTML = ""})
                .raise(),

            update => update.raise(),

            exit => exit.remove())
    }
};

// let cities_map = new USA_MAP("us_map");
// //let path_data = d3.json('us-states.json');
// cities_map.render("us");