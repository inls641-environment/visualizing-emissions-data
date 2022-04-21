//referenced from hand-on excerises
let width = 250
let height = 250
let margin_x = 50
let margin_y = 25


class city_scatterplot{
    constructor(container_id, emissions) {
        this.container_id = container_id;
        this.emissions = emissions;
        this.svg = d3.select('#'+this.container_id)

        this.render()
    }

    async render() {
        //create new array of cities with average renewable and nonrenewable
        let cities = Array.from(d3.group(emissions, d => d.ID));

        var avgDataset = []
        for (let cityIndex in cities) {
            let cityId = cities[cityIndex][1][0]['ID'];
            let cityName = cities[cityIndex][1][0]['AccountName'];
            let nonRenew = d3.mean(cities[cityIndex][1], d => d.NonRenewable);
            let renew = d3.mean(cities[cityIndex][1], d => d.Reneweable);
            avgDataset.push({'ID': cityId, 'city': cityName, 'nonrenewable': nonRenew, 'renewable': renew})
        };

        let x = d3.scaleLinear()
            .domain([d3.min(avgDataset, d => d.renewable), d3.max(avgDataset, d => d.renewable)])
            .range([0, width])
            .nice(); //.nice() makes axis values look pretty
        let y = d3.scaleLinear()
            .domain([d3.min(avgDataset, d => d.nonrenewable), d3.max(avgDataset, d => d.nonrenewable)])
            .range([height, 0]) //svg starts with Y axis top equal to 0
            .nice();

        //add group to deal with margins - svg starts with origin (0,0) in the top left corner
        let g = this.svg.append("g")
            .attr("transform", "translate(" + margin_x + "," + margin_y + ")");

        //x-axis
        g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .attr("color", "white");

        //x-axis label
        g.append("text")
            .attr("text-anchor", "middle")
            .attr("color", "white")
            .attr("x", width/2)
            .attr("y", height + 50)
            .style("fill", "white")
            .text("Non-Renewable");

        //y-axis
        g.append("g")
            .call(d3.axisLeft(y))
            .attr("color", "white");
        //y-axis label
        g.append("text")
            .attr("transform","rotate(90)")
            .attr("text-anchor", "middle")
            .attr("x", height/2)
            .attr("y", 50)
            .style("fill", "white")
            .text("Renewable");


        //plot data
        g.selectAll(".dot").data(avgDataset).join("circle")
            .attr("cx", d => x(d.renewable))
            .attr("cy", d=>y(d.nonrenewable))
            .style("fill", "white")
            .style("stroke", "grey")
            .attr("r", 5);
    }
}