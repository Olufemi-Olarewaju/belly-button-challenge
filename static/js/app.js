// URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Get data from url using d3
d3.json(url).then(function(data){
    // Save sample data in variable
    let samples = data["samples"]
    
    // Create function for first visualization the the webpage
    function init(){
        // Save inital sampla data to variables
        let initialSample = samples[0];
        // Given that the data is already sorted in descending order, we can slice the 10 ten data points on each array
        let sample_values = initialSample['sample_values'].slice(0, 10);
        let raw_otu_ids = initialSample['otu_ids'].slice(0, 10);
        let otu_ids = [];
        for(let i = 0; i < raw_otu_ids.length; i++){
            otu_ids.push(`OTU ${raw_otu_ids[i]}`)
        };
        let otu_labels = initialSample['otu_labels'].slice(0, 10);

        // Create a horizontal bar graph using Plotly
        let trace = {
            x: sample_values.reverse(),
            y: otu_ids.reverse(),
            text: otu_labels.reverse(),
            type: "bar",
            orientation: "h"
        };

        let data = [trace];

        let layout = {
            xaxis: {
                dtick: 50
            },
            margin: {
                l: 200,
                r: 200,
                b: 100,
                t: 5,
                pad: 4
            }
        }

        Plotly.newPlot("plot", data, layout);
    };

    // Call the fuction to display plot
    init()

    
});







































