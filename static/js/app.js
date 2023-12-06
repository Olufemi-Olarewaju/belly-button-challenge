// URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Get data from url using d3
d3.json(url).then(function(data){
    // Save sample data in variable
    let samples = data["samples"]

    let sampleID_List = samples.map(data => data['id']);
    let sample_value_List = samples.map(data => data['sample_values']);
    let raw_otu_ids_list = samples.map(data => data['otu_ids']);
    let otu_ids_list = [];

        for(let i = 0; i < raw_otu_ids_list.length; i++){
            let raw_otu_ids = raw_otu_ids_list[i];
            let changed_otu_ids_list = [];
            for(let j = 0; j < raw_otu_ids.length; j++){
                changed_otu_ids_list.push(`OTU ${raw_otu_ids[j]}`)
            };
            otu_ids_list.push(changed_otu_ids_list)
        };
    let otu_labels_list = samples.map(data => data['otu_labels']);
    
    let dropdownOptions = d3.select("#selDataset");

    for(let i = 0; i < sampleID_List.length; i++){
        let sampleID = sampleID_List[i];
        let option = dropdownOptions.append("option").text(sampleID);
        option.attr("value", sampleID);
        }

    // Create function for first visualization the the webpage
    function init(){
        // Save inital sampla data to variables
        let initialSample = samples[0];
        // Given that the data is already sorted in descending order, we can slice the 10 ten data points on each array
        let initialSample_values = initialSample['sample_values'].slice(0, 10);
        let intialRaw_otu_ids = initialSample['otu_ids'].slice(0, 10);
        let initialOtu_ids = [];
        for(let i = 0; i < intialRaw_otu_ids.length; i++){
            initialOtu_ids.push(`OTU ${intialRaw_otu_ids[i]}`)
        };
        let initialOtu_labels = initialSample['otu_labels'].slice(0, 10);

        // Create a horizontal bar graph using Plotly
        let trace = {
            x: initialSample_values.reverse(),
            y: initialOtu_ids.reverse(),
            text: initialOtu_labels.reverse(),
            type: "bar",
            orientation: "h"
        };

        let data = [trace];

        let layout = {
            xaxis: {
                dtick: 50
            },
            margin: {
                l: 100,
                r: 0,
                b: 50,
                t: 0,
                pad: 4
            }
        }

        Plotly.newPlot("bar", data, layout);
    };

    d3.selectAll("#selDataset").on("change", updatePlotly);

    function updatePlotly(){

        let dropdownMenu = d3.select("#selDataset");
        let thissampleID = dropdownMenu.property("value");

        let x = [];
        let y = [];
        let text = [];

        for(let i = 0; i < sampleID_List.length; i++){
            if (thissampleID === sampleID_List[i]){
                x = sample_value_List[i].slice(0, 10).reverse();
                y = otu_ids_list[i].slice(0, 10).reverse();
                text = otu_labels_list[i].slice(0, 10).reverse();
            };
        };
        Plotly.restyle("bar", "x", [x]);
        Plotly.restyle("bar", "y", [y]);
        Plotly.restyle("bar", "text", [text]);
    };

    // Call the init fuction to display initial plot
    init()
});








































