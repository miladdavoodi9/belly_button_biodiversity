function getMetaData(sample) {

    var url = "/metadata/" + sample;

    var result = d3.json(url).then((data) => {
        console.log(data)

        // grab sample-metadata with d3
        var demoInfo = d3.select("#sample-metadata");

        demoInfo.html("");

        Object.entries(data).forEach(([key, value]) => {
            var row = demoInfo.append("p");
            row.text(`${key}: ${value}`);
        });

    });


}

// Create function to plot bar, gauge, and bubble
function buildCharts(sample) {

    var sampleData = d3.json("/samples/" + sample).then((id) => {
        console.log(id)

        var sample_values = id.sample_values;
        var otu_ids = id.otu_ids;
        var otu_lables = id.otu_labels;
        var OTU_ID = otu_ids.map(d => "OTU " + d)

        // var top10otu = otu_ids.slice(9);


        var bar = [{
            type: 'bar',
            x: sample_values.splice(0, 10).reverse(),
            y: OTU_ID.splice(0, 10).reverse(),
            orientation: 'h',
            text: otu_lables.splice(0, 10).reverse()
        }];

        Plotly.newPlot('bar', bar);


        var trace1 = {
            x: otu_ids,
            y: sample_values,
            mode: 'markers',
            marker: {
                color: otu_ids,
                opacity: [0.6],
                size: sample_values,
                sizeref: 0.4,
                // sizemode: 'area'
            }
        };

        var data = [trace1];

        var layout = {
            showlegend: false,
            xaxis: { title: "OTU ID" }
        };

        Plotly.newPlot('bubble', data, layout);

    });
}


// Grab a refrence to the Dropdown Select Element
function init() {
    var selector = d3.select('#selDataset')

    //use sample names to poplate the select options
    var names = d3.json('/names').then((sampleNames) => {
        console.log(sampleNames)

        sampleNames.forEach((sample) => {
            selector.append("option").text(sample).property("value");
        });

        buildCharts(sampleNames[0]);
        getMetaData(sampleNames[0]);
        console.log(sampleNames[0]);
    });

}

function optionChanged(newSample) {
    buildCharts(newSample);
    getMetaData(newSample);
}

init();