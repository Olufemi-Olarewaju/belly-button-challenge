// URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Get data from url using d3
d3.json(url).then(function(data){

    // Initializing Array Variables
    let metadata = data['metadata'];
    let metaData_keys = [];
    let metaData_values = [];

    // For loop to split Object keys and values to respective Arrays
    for(let i = 0; i < metadata.length; i++){
    metaData_keys.push(Object.keys(metadata[i]));
    metaData_values.push(Object.values(metadata[i]));
    };

    // Save sample data in variable
    let samples = data["samples"];

    // Save Sample IDs, Values and OTU IDs in their respective arrays
    let sampleID_List = samples.map(data => data['id']);
    let sample_value_List = samples.map(data => data['sample_values']);
    let raw_otu_ids_list = samples.map(data => data['otu_ids']);
    let otu_ids_list = [];

        // For loop to change OTU IDs to string as required and save result in array otu_ids_list
        for(let i = 0; i < raw_otu_ids_list.length; i++){
            let raw_otu_ids = raw_otu_ids_list[i];
            let changed_otu_ids_list = [];
            for(let j = 0; j < raw_otu_ids.length; j++){
                changed_otu_ids_list.push(`OTU ${raw_otu_ids[j]}`)
            };
            otu_ids_list.push(changed_otu_ids_list)
        };

    // Save OTU Labels in array otu_labels_list
    let otu_labels_list = samples.map(data => data['otu_labels']);

    // Use d3 to select Dropdown Menu
    let dropdownOptions = d3.select("#selDataset");

    // For loop to add Dropdown menu options and values
    for(let i = 0; i < sampleID_List.length; i++){
        let sampleID = sampleID_List[i];
        let option = dropdownOptions.append("option").text(sampleID);
        option.attr("value", sampleID);
        }
    
    // Function that calls other functions to update visualizations when the dropdown menu values are changed
    d3.selectAll("#selDataset").on("change", function(){
        updateBar();
        updateBubble();
        updateMetaData();
        updateGauge();
    });

    // Function for the initial bar chart visualization on the webpage
    function initBar(){
        // Save initial sample data to variables
        let initialSample = samples[0];
        // Given that the data is already sorted in descending order, we can slice the 10 ten data points on each array
        let initialSample_values = initialSample['sample_values'].slice(0, 10);
        let intialRaw_otu_ids = initialSample['otu_ids'].slice(0, 10);
        let initialOtu_ids = [];
        for(let i = 0; i < intialRaw_otu_ids.length; i++){
            initialOtu_ids.push(`OTU ${intialRaw_otu_ids[i]}`)
        };
        let initialOtu_labels = initialSample['otu_labels'].slice(0, 10);

        // Initialize Horizontal Bar chart parameters
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

        // Create plotly Horizontal Bar chart
        Plotly.newPlot("bar", data, layout);
    };

    // Function that updates horizontal bar chart when drop down menu value is changed
    function updateBar(){

        // Get selected dropdown value from the dropdown menu
        let dropdownMenu = d3.select("#selDataset");
        let thissampleID = dropdownMenu.property("value");

        // Initialize empty array for x, y, and text
        let x = [];
        let y = [];
        let text = [];

        // For loop that set updated values for x, y and text when a new Sample ID
        // has been selected from the drop down menu
        for(let i = 0; i < sampleID_List.length; i++){
            if (thissampleID === sampleID_List[i]){
                x = sample_value_List[i].slice(0, 10).reverse();
                y = otu_ids_list[i].slice(0, 10).reverse();
                text = otu_labels_list[i].slice(0, 10).reverse();
            };
        };

        // Restyle plotly
        Plotly.restyle("bar", "x", [x]);
        Plotly.restyle("bar", "y", [y]);
        Plotly.restyle("bar", "text", [text]);
    };

    // Create function for the initial Bubble chart on the webpage
    function initBubble(){
        // Save initial sample data to variables
        let initialSample = samples[0];
        let initialSample_values = initialSample['sample_values'];
        let intialRaw_otu_ids = initialSample['otu_ids'];
        let initialOtu_labels = initialSample['otu_labels'];

        // Initialize bubble chart parameters
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

        // Create Bubble chart using Plotly
        Plotly.newPlot("bubble", data, layout);
    };

    // Function that updates Bubble chart when drop down menu value is changed
    function updateBubble(){
        // Get selected dropdown value from the dropdown menu
        let dropdownMenu = d3.select("#selDataset");
        let thissampleID = dropdownMenu.property("value");
        // Initialize empty array for x, y, size, color and text
        let x = [];
        let y = [];
        let size = [];
        let color = [];
        let text = [];
        // For loop that set updated values for x, y, size, color and text when a new Sample ID
        // has been selected from the drop down menu
        for(let i = 0; i < sampleID_List.length; i++){
            if (thissampleID === sampleID_List[i]){
                x = raw_otu_ids_list[i];
                y = sample_value_List[i];
                size = sample_value_List[i];
                color = raw_otu_ids_list[i];
                text = otu_labels_list[i];
            };
        };

        // Restyle plotly
        Plotly.restyle("bubble", "x", [x]);
        Plotly.restyle("bubble", "y", [y]);
        Plotly.restyle("bubble", "size", [size]);
        Plotly.restyle("bubble", "color", [color]);
        Plotly.restyle("bubble", "text", [text]);
    };

    // Function for the initial Demographic Info Section on the webpage
    function initMetaData(){
        // Save initial meta data to variables
        let intialMetaData_keys = metaData_keys[0];
        let intialMetaData_values = metaData_values[0];

        // Get selected dropdown value from the dropdown menu
        let demoInfoBox = d3.select("#sample-metadata");
        // For loop to create Table Row for each metadata key value pair
        for(let i = 0; i < intialMetaData_keys.length; i++){
            demoInfoBox.append("tr").text(`${intialMetaData_keys[i]}: ${intialMetaData_values[i]}`);
        };
    };

    // Function that uodates Demographic Info Section on the webpage 
    // when drop down menu value is changed
    function updateMetaData(){
        let dropdownMenu = d3.select("#selDataset");
        let thissampleID = dropdownMenu.property("value");

        // Get selected dropdown value from the dropdown menu
        let demoInfoBox = d3.select("#sample-metadata");
        
        // Remove any existing rows on Demographic Info Section
        d3.selectAll("tr").remove()

        // For loop to update/add rows when drop down menu value is changed
        for (let i = 0; i < metaData_values.length; i++){
            if (thissampleID === metaData_values[i][0].toString()){
                for(let j = 0; j < metaData_values[i].length; j++){
                    demoInfoBox.append("tr").text(`${metaData_keys[i][j]}: ${metaData_values[i][j]}`);
                };
            };
        };
    };
    
    // Function for the initial Gauge Chart  
    function initGauge(){
        // Save Belly Button Washing Frequency in variable
        let washFrequencies = metadata[0]['wfreq'];
        let degree_per_section = 20
        let level = washFrequencies * degree_per_section;

        // Trig to calculate meter point
        let degrees = 180 - level,
        radius = .55;
        let radians = degrees * Math.PI / 180;
        let x = radius * Math.cos(radians);
        let y = radius * Math.sin(radians);

        // Path to draw triangle for the guage pointer
        let mainPath = 'M -.0 -0.025 L .0 0.025 L ',
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';
        let path = mainPath.concat(pathX,space,pathY,pathEnd);

        // Initialize Guage Chart Parameters
        let trace1 = {
            type: 'scatter', 
            x: [0], 
            y: [0],
            marker: {size: 28, color:'850000'},
            showlegend: false,
            name: 'Scrubs',
            text: washFrequencies,
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
        // Create Guage chart using parameters above
        Plotly.newPlot('gauge', data, layout);
    }

    // Function to update Gauge Chart
    function updateGauge(){
        // Get selected dropdown value from the dropdown menu
        let dropdownMenu = d3.select("#selDataset");
        let thissampleID = dropdownMenu.property("value");

        // Reinitialize variables
        let washFrequencies = 0;
        let degree_per_section = 20;
        let level = 0;
        let path = '';
        let washFrequencies_list = [];

        // Assign wash frequencies into washFrequencies_list array
        for(let i = 0; i < metadata.length; i++){
            washFrequencies_list.push(metadata[i]['wfreq'])
        };

        // For loop to calculate guage parameters: guage pointer, path, x and y, etc
        for(let i = 0; i < washFrequencies_list.length; i++){
            if (thissampleID === sampleID_List[i]){
                washFrequencies = washFrequencies_list[i];
                level = washFrequencies * degree_per_section;

                // Trig to calculate meter point
                let degrees = 180 - level,
                radius = .55;
                let radians = degrees * Math.PI / 180;
                let x = radius * Math.cos(radians);
                let y = radius * Math.sin(radians);

                // Path
                let mainPath = 'M -.0 -0.025 L .0 0.025 L ',
                pathX = String(x),
                space = ' ',
                pathY = String(y),
                pathEnd = ' Z';
                path = mainPath.concat(pathX,space,pathY,pathEnd);

                console.log(path)
            };
        };

        // Set new paraments based on new value selected in dropdown menu
        let trace1 = {
            type: 'scatter', 
            x: [0], 
            y: [0],
            marker: {size: 28, color:'850000'},
            showlegend: false,
            name: 'Scrubs',
            text: washFrequencies,
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
        // Update to new plot based on dropdown value
        Plotly.newPlot('gauge', data, layout);
    };

    // Call the initBar fuction to display initial Bar Plot
    initBar()
    // Call the initBubble fuction to display initial Bubble Chart
    initBubble();
    // Call the initMetaData fuction to display initial metadata for Demographic Info
    initMetaData();
    // Call the initGauge fuction to display initial wash frequency
    initGauge();
});

