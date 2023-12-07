// URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Get data from url using d3
d3.json(url).then(function(data){

    let metadata = data['metadata'];
    let metaData_keys = [];
    let metaData_values = [];

    for(let i = 0; i < metadata.length; i++){
    metaData_keys.push(Object.keys(metadata[i]));
    metaData_values.push(Object.values(metadata[i]));
    };

    // Save sample data in variable
    let samples = data["samples"];

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
    
    d3.selectAll("#selDataset").on("change", function(){
        updateBar();
        updateBubble();
        updateMetaData();
    });

    // Create function for first visualization the the webpage
    function initBar(){
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

    function updateBar(){

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

    function initBubble(){
        // Save inital sampla data to variables
        let initialSample = samples[0];
        
        let initialSample_values = initialSample['sample_values'];
        let intialRaw_otu_ids = initialSample['otu_ids'];
        let initialOtu_labels = initialSample['otu_labels'];

        // Create a bubble chart using Plotly
        let trace = {
            x: intialRaw_otu_ids,
            y: initialSample_values,
            mode: 'markers',
            marker: {
                size: initialSample_values,
                color: intialRaw_otu_ids
            },
            text: initialOtu_labels
        };

        let data = [trace];

        let layout = {
            height: 600,
            width: 1200,
            xaxis: {
                title: "OTU ID"
            }
        }

        Plotly.newPlot("bubble", data, layout);
    };



    function updateBubble(){

        let dropdownMenu = d3.select("#selDataset");
        let thissampleID = dropdownMenu.property("value");

        let x = [];
        let y = [];
        let size = [];
        let color = [];
        let text = [];

        for(let i = 0; i < sampleID_List.length; i++){
            if (thissampleID === sampleID_List[i]){
                x = raw_otu_ids_list[i];
                y = sample_value_List[i];
                size = sample_value_List[i];
                color = raw_otu_ids_list[i];
                text = otu_labels_list[i];
            };
        };
        Plotly.restyle("bubble", "x", [x]);
        Plotly.restyle("bubble", "y", [y]);
        Plotly.restyle("bubble", "size", [size]);
        Plotly.restyle("bubble", "color", [color]);
        Plotly.restyle("bubble", "text", [text]);
    };

    function initMetaData(){
        let intialMetaData_keys = metaData_keys[0];
        let intialMetaData_values = metaData_values[0];

        let demoInfoBox = d3.select("#sample-metadata");

        for(let i = 0; i < intialMetaData_keys.length; i++){
            demoInfoBox.append("tr").text(`${intialMetaData_keys[i]}: ${intialMetaData_values[i]}`);
        };
    };

    function updateMetaData(){
        let dropdownMenu = d3.select("#selDataset");
        let thissampleID = dropdownMenu.property("value");

        let demoInfoBox = d3.select("#sample-metadata");
        
        d3.selectAll("tr").remove()

        for (let i = 0; i < metaData_values.length; i++){
            if (thissampleID === metaData_values[i][0].toString()){
                for(let j = 0; j < metaData_values[i].length; j++){
                    demoInfoBox.append("tr").text(`${metaData_keys[i][j]}: ${metaData_values[i][j]}`);
                };
            };
        };
    };

    // Call the initBar fuction to display initial Bar Plot
    initBar()
    // Call the initBubble fuction to display initial Bubble Chart
    initBubble();
    // Call the initMetaData fuction to display initMetaData Demographic Info
    initMetaData();
});








































