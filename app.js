// Initial function to generate the different types of graphs that will be utilized during the project

function getPlot(id) {
    // Command to grab data from json file. 
    
    d3.json("Data/samples.json").then((data)=> {
  
        // Establish variables that have aligned key values in json version of data to capture this specific characteristic and display it. 
        
        var wfreq = data.metadata.map(d => d.wfreq)
        
        console.log(`Washing Frequency: ${wfreq}`)
        
        // Similar to above we need an additional filter for 'samples' from our json data set. 
        
        var samples = data.samples.filter(s => s.id.toString() === id)[0];
        
        console.log(samples);
  
        //One of our tasks is to capture the top 10 samples. The code below does that
        
        var sampVals = samples.sample_values.slice(0, 10).reverse();
  
        //We had to perform the same task with the otu ids in terms of finding the top 10 values 
        
        var OTU_topTen = (samples.otu_ids.slice(0, 10)).reverse();
        
        // Establishing an additional variable that get's our otu_ids in the correct format
       
        var OTU_id = OTU_topTen.map(d => "OTU " + d)
  
        console.log(`OTU IDS: ${OTU_id}`)
  
  
        // This will grab the top 10 for the plot 
        
        var labels = samples.otu_labels.slice(0, 10);
  
        console.log(`Sample Values: ${sampVals}`)

        console.log(`Id Values: ${OTU_topTen}`)
        
        // In JS traces are what are used for plots. My first trace can be found below 
        
        var trace = {
            x: sampVals,
            y: OTU_id,
            text: labels,
            marker: {
              color: 'rgb(68,42,242)'},
            type:"bar",
            orientation: "h",
        };
  
        // For every plotly graph you need data and layout configurations. Below is my variable for data established as a closed list 
        var data = [trace];
  
        var layout = {
            title: "Top 10 OTU",
            yaxis:{
                tickmode:"linear",
            },
            margin: {
                l: 90,
                r: 90,
                t: 90,
                b: 30
            }
        };
  
        // Now it's time to create official plotly graph using the data, layout and type parameters
        
        Plotly.newPlot("bar", data, layout);
  
        console.log(`ID: ${samples.otu_ids}`)
      
        // Rinse and repeat this process for the bubble chart
        
        var trace_bubble = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text: samples.otu_labels
  
        };
  
        
        var layout_bubble = {
            xaxis:{title: "OTU ID"},
            height: 600,
            width: 1000
        };
  
        var data1 = [trace_bubble];
  
        Plotly.newPlot("bubble", data1, layout_bubble); 
  
        // Rinse and repeat for gauge plot. 
  
        var data_gauge = [
          {
          domain: { x: [0, 1], y: [0, 1] },
          value: parseFloat(wfreq),
          title: { text: `Weekly Washing Frequency ` },
          type: "indicator",
          
          mode: "gauge+number",
          gauge: { axis: { range: [null, 9] },
                   steps: [
                    { range: [0, 1], color: 'rgb(232,229,215)' },
                    { range: [1, 2], color: 'rgb(219,217,207)' },
                    { range: [2, 3], color: 'rgb(195,186,143)' },
                    { range: [3, 4], color: 'rgb(198,215,129)' },
                    { range: [4, 5], color: 'rgb(179,228,106)' },
                    { range: [5, 6], color: 'rgb(152,201,78)' },
                    { range: [6, 7], color: 'rgb(110,193,86)' },
                    { range: [7, 8], color: 'rgb(102,204,0)' },
                    { range: [8, 9], color: 'rgb(0,204,0)' },
                  ]}
              
          }
        ];
        var layout_gauge = { 
            width: 700, 
            height: 600, 
            margin: { t: 20, b: 40, l:100, r:100 } 
          };
        Plotly.newPlot("gauge", data_gauge, layout_gauge);
      });
  }  
// create the function to get the necessary data
function getInfo(id) {
    // read the json file to get data
    d3.json("Data/samples.json").then((data)=> {
        
        // get the metadata info for the demographic panel
        var metadata = data.metadata;

        console.log(metadata)

        // filter meta data info by id
        var result = metadata.filter(meta => meta.id.toString() === id)[0];

        // select demographic panel to put data
        var demographicInfo = d3.select("#sample-metadata");
        
        // empty the demographic info panel each time before getting new id info
        demographicInfo.html("");

        // grab the necessary demographic data data for the id and append the info to the panel
        Object.entries(result).forEach((key) => {   
                demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
        });
    });
}

// create the function for the change event
function optionChanged(id) {
    getPlot(id);
    getInfo(id);
}

// create the function for the initial data rendering
function init() {
    // select dropdown menu 
    var dropdown = d3.select("#selDataset");

    // read the data 
    d3.json("Data/samples.json").then((data)=> {
        console.log(data)

        // get the id data to the dropdwown menu
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        // call the functions to display the data and the plots to the page
        getPlot(data.names[0]);
        getInfo(data.names[0]);
    });
}

init();