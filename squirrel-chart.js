// chart to insert within bootstrap container-row-column environment

    /* CONSTANTS AND GLOBALS */

    

    const margin = { top: 10, bottom: 30, left: 40, right: 10 };
    const width = 300 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;
    
    const staticColor = "salmon";
    const hoverColor = "gold";
    const tipColor = "#e8e8e8e8";
    
    // adding let variables here
    // since we use our scales in multiple functions, they need global scope
    let svg;
    let xScale;
    let yScale;
    let tooltip;
    
    
    // manage interactivity
    /* APPLICATION STATE */
    let state = {
      data: null,
      selection: "all",
      hover: null
    };
    
    
    /* LOAD DATA */
    
    d3.csv('./data/squirrelActivities.csv', d3.autoType)
    .then(raw_data => {
      console.log("data", raw_data);
      // save our data to application state
      raw_data.sort(function(a, b) {
        return a.count - b.count;
      });
      state.data = raw_data;
      init();
    });
    
    
    /* INITIALIZING FUNCTION */
    // this will be run *one time* when the data finishes loading in
    
    function init() {
    
      /* SCALES */
    
      xScale = d3.scaleBand()
      .domain(state.data.map(d=> d.activity))
      .range([margin.left, width-margin.right])
      .paddingInner(.2)
    
      yScale = d3.scaleLinear()
      .domain([0, d3.max(state.data, d=> d.count)])
      .range([height-margin.bottom, margin.top])  
    
      const container = d3.select("#chart").style("position", "relative");
    
      svg = container
        .append("svg")
        //add class for CSS use
        .attr("class", "chart")
        .style('background', "tan")
        .style("position", "relative");
    
      // tooltip = d3.select("body")
      // change the d3.select to SPECIFIC ID for this graph's <div> instead of just the body
      tooltip = d3.select("#chart")
      .append("div")
      .attr("class", "tooltip")
      .attr("class", "tooltip-bar")
       // give a specific ID as well if needed to specify amongst other charts
      .attr("id", "tooltip-bar-chart")
      .style("position", "absolute")
      .style("z-index", "999")
      .style("visibility", "hidden")
      .style("opacity", 0.7)
      .style("padding", "8px")
      .style('background', tipColor)
      .style("border-radius", "4px")
      .style("color", "brown")
      .style("font-size", "0.8em" )
      .text("tooltip");
    
    
    // could add axes code here if desired
    
    
        svg.append("text")
        .attr("class", "x-label")
        .attr("text-anchor", "middle")
        .attr('font-size', '12px')
        .attr('font-family', 'sans-serif')
        .attr("x",  width / 2 )
        .attr("y", height - 6)
        .text("squirrel activity types");
    
        svg.append("text")
        .attr("class", "y-label")
        .attr("text-anchor", "middle")
        .attr('font-size', '12px')
        .attr('font-family', 'sans-serif')
        .attr("x", -(height/2))
        .attr("y", 6)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("sightings in the field");
        // check if additional draw call req'd
        draw(); 
    
        //set up selector
        // if you will have multiples be sure to add number suffix
        const dropdown = d3.select("#dropdown")
    
        dropdown.selectAll("options")
          .data(["all","foraging", "running", "chasing", "climbing", "eating"])
          .join("option")
          .attr("value", d => d)
          .text(d => d)
    
          dropdown.on("change", function () {
            //state.selection = event.target.value
            state.selection = this.value
            console.log(state.selection)
            draw();
          });
    
      draw(); // calls the draw function
    }
    
    // NEW CODE SECTION - contains earlier code sections of data join and draw plus some additions
    /* DRAW FUNCTION */
    // we call this every time there is an update to the data/state
    function draw() {
    
      const filteredData = state.data
      .filter(d => 
        state.selection === d.activity || state.selection === "all")
        console.log(filteredData)
    
      svg.selectAll("rect.bar")
      .data(filteredData)
      .join("rect")
      .attr("class", "bar")
      .attr("width", xScale.bandwidth)
      .attr("height",  d=> height-margin.bottom - yScale(d.count))
      .attr("x", d=>xScale(d.activity))
      .attr("y", d=>yScale(d.count))
      .attr("fill", staticColor)

      .on("mouseover", function(event,d,i){
      tooltip
      .html(`<div>activity: ${d.activity}</div><div>sightings: ${d.count}</div>`)
      .style("class","tooltip-bar")
      .style("visibility", "visible")
      .style("opacity", .8)
      .style("background", tipColor)
      d3.select(this)
          .transition()
          .attr("fill", hoverColor);
      })
       .on("mousemove", function(){
              let x = d3.pointer(event).x,
                   y = d3.pointer(event).y;
             // CHANGE: refer back to specific ID for the 1 chart tooltip div
              d3.select("#tooltip-bar-chart")
              .style("top", y - 10 + "px")
              .style("left", x + 10 + "px");
          })
    .on("mouseout", function(event, d){
      tooltip
      .html(``)
      .style("visibility","hidden");
      d3.select(this)
          .transition()
          .attr("fill", staticColor);
      });

    
    console.log(state)
    }


