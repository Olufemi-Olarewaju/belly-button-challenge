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
            },
            margin: {
                l: 100,
                r: 100,
                b: 200,
                t: 5
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

    function initGauge(){
        // Enter Belly Button Washing Frequency
        let washFrequencies = metadata[0]['wfreq'];
        let degree_per_section = 20
        let level = washFrequencies * degree_per_section;

        // Trig to calc meter point
        let degrees = 180 - level,
        radius = .55;
        let radians = degrees * Math.PI / 180;
        let x = radius * Math.cos(radians);
        let y = radius * Math.sin(radians);

        // Path: may have to change to create a better triangle
        let mainPath = 'M -.0 -0.025 L .0 0.025 L ',
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';
        let path = mainPath.concat(pathX,space,pathY,pathEnd);

        let trace1 = {
            type: 'scatter', 
            x: [0], 
            y:[0],
            marker: {size: 28, color:'850000'},
            showlegend: false,
            name: 'speed',
            text: level,
            hoverinfo: 'text+name'
        };
        
        let trace2 = {
            values: [20/9, 20/9, 20/9, 20/9, 20/9, 20/9, 20/9, 20/9, 20/9, 20],
            rotation: 90,
            text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
            textinfo: 'text',
            textposition:'inside',    
            marker: {colors:['rgba(5, 127, 0, .5)', 'rgba(30, 127, 0, .5)', 'rgba(50, 127, 0, .5)',
                    'rgba(110, 154, 22, .5)', 'rgba(170, 202, 42, .5)',
                    'rgba(202, 209, 95, .5)', 'rgba(210, 206, 145, .5)',
                    'rgba(220, 216, 180, .5)', 'rgba(232, 226, 202, .5)',
                    'rgba(255, 255, 255, 0)']},
            labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
            hoverinfo: 'label',
            hole: .5,
            type: 'pie',
            showlegend: false
        };


        let data = [trace1, trace2];

        let layout = {
            shapes:[{
                type: 'path',
                path: path,
                fillcolor: '850000',
                line: {
                    color: '850000'
                    }}],
            title: '<b>Belly Button Washing Frequency</b> <br> Scrubs per Week',
            height: 500,
            width: 500,
            xaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]},
            yaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]}
        };

        Plotly.newPlot('gauge', data, layout);
    }

    // Call the initBar fuction to display initial Bar Plot
    initBar()
    // Call the initBubble fuction to display initial Bubble Chart
    initBubble();
    // Call the initMetaData fuction to display initial metadata for Demographic Info
    initMetaData();
    // Call the initGauge fuction to display initial wash frequency
    initGauge();
});








































