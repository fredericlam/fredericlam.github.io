<template>

	<div class="container">

		<h1>Reducing social inequalities in cancer: evidence and priorities for research</h1>
		
		<div class="row">

			<div class="col-md-2">

				<form>
					<h3>Search by</h3>
					<div class="input-group mb-3">
					  <span class="input-group-text" id="basic-addon1">@</span>
					  <input type="text" class="form-control" placeholder="Search a country" aria-label="Search a country" aria-describedby="basic-addon1">
					</div>

					<h3>View by</h3>

					<div class="list-group">
						<button type="button" class="list-group-item list-group-item-action active" aria-current="true">
						Overall 
						</button>
						<button type="button" class="list-group-item list-group-item-action">Region</button>
						<button type="button" class="list-group-item list-group-item-action">A third button item</button>
						<button type="button" class="list-group-item list-group-item-action">A fourth button item</button>
						<button type="button" class="list-group-item list-group-item-action" disabled>A disabled button item</button>
					</div>


				</form>

			</div>

			<div class="col-md-8">

				<p>This is the age-standardized rate per 100 000, all cancers excluding non-melanoma skin cancer</p>

				<div id="graphic"></div>

			</div>

			<div class="col-md-2">

				<p>This volume summarizes the current scientific evidence and identifies research priorities needed to decrease social inequalities in cancer. The publication, based on the expert knowledge of more than 70 international scientists from multiple disciplines, undertakes a populations-within-populations approach, highlighting the large variations in cancer incidence, survival, and mortality that exist between countries and, within countries, between social groups. </p>

			</div>

		</div>


	</div>

</template>

<script>

// from https://github.com/MartinHeinz/charts/blob/master/beeswarm/beeswarm.js

import { reactive,computed,onMounted } from "vue";
import { useStore } from 'vuex' ;
import axios from 'axios'

export default {
	name : 'Home' , 
	components : { } , 
	setup(){ 
		onMounted(() => {

   	})
   	
   	const store = useStore()
  	
  	return {
	  
	  }
	},
	data() {
	    return {

	    	// svg conf
	    	width: 0 ,
	    	height : 500 , 
	    	margin : {top: 0, right: 40, bottom: 40, left: 40} ,

	    	x_scale : [] , 
	    	x_axis : [] ,

	    	y_scale : [] , 
	    	y_axis : [] ,

	    	// options 
	    	scales : {
			    lin: "scaleLinear",
			    log: "scaleLog"
			},

			// Data structure describing volume of displayed data
			count : {
			    total: "total",
			    perCap: "perCapita"
			},

			// Data structure describing legend fields value
			legend : {
			    total: "Total Deaths",
			    perCap: "Per Capita Deaths"
			},

			dataset : [] ,

			chartState : {}
	    }
	},
	created(){	
	},
	mounted(){

		this.width = $('#graphic').width() ; 
			
		// create svg
		this.svg = d3.select('#graphic').append("svg")
			.attr('id','graphic')
	      	.attr("width", this.width )
	      	.attr("height", this.height )
	      	.attr("viewBox", [0, 0, this.width, this.height])
	      	.attr("style", "max-width: 100%; height: auto;");

	    this.x_scale = d3.scaleLinear()
    		.range([this.margin.left, this.width - this.margin.right]);

    	this.svg.append("g")
		    .attr("class", "x axis")
		    .attr("transform", "translate(0," + (this.height - this.margin.bottom) + ")");

		this.xLine = this.svg.append("line")
		    .attr("stroke", "rgb(96,125,139)")
		    .attr("stroke-dasharray", "1,2");

		this.chartState.measure = this.count.total ;
		this.chartState.scale 	= this.scales.lin ;
		this.chartState.legend 	= this.legend.total ;


		let promise = axios.get( "../data/incidence-all.json" ) ; 

		axios.all( [promise] )
			.then( axios.spread(( incidence_promise ) => {

				this.dataset = incidence_promise.data ;

				this.redraw();

				
			}))
	        
	        // eslint-disable-next-line
	        .catch( error => {
	            console.error("Error catched",error) ; 
	            this.error = true
	        })
	        .finally(() => {
	        
	        })

		

	},

	unmounted(){

	},

	methods : {

		/**
		* Redraw graphic
		* @param (no param)
		* @return (no return )
		*/
		redraw : function(){

			console.info("start redraw",new Date().getTime())

			// Set scale type based on button clicked
	        if (this.chartState.scale === this.scales.lin) {
	            this.x_scale = d3.scaleLinear().range([ this.margin.left, this.width - this.margin.right ])
	        }

	        if (this.chartState.scale === this.scales.log) {
	            this.x_scale = d3.scaleLog().range([ this.margin.left, this.width - this.margin.right ]);
	        }

	        this.domains = d3.extent(this.dataset, (d)=> {
            	return +d.asr ;
        	}); 
        	

	        this.x_scale.domain( [0,this.domains[1]] );

	        // Set X axis based on new scale. If chart is set to "per capita" use numbers with one decimal point
	        if (this.chartState.measure === this.count.perCap) {
	            this.x_axis = d3.axisBottom(this.x_scale)
	                .ticks(10, ".1f")
	                .tickSizeOuter(0);
	        }
	        else {
	            this.x_axis = d3.axisBottom(this.x_scale)
	                .ticks(10, ".1s")
	                .tickSizeOuter(0);
	        }

	        d3.transition(this.svg).select(".x.axis")
	            .transition()
	            .duration(1000)
	            .call(this.x_axis);

	        this.g_circles = this.svg.append('g')
	        	.attr('class','group_circles') 

	        // Create simulation with specified dataset
	        let simulation = d3.forceSimulation(this.dataset)
	            // Apply positioning force to push nodes towards desired position along X axis
	            .force("x", d3.forceX((d) =>{
	                // Mapping of values from total/perCapita column of dataset to range of SVG chart (<margin.left, margin.right>)
	                return this.x_scale(+d.asr);  // This is the desired position
	            }).strength(10))  // Increase velocity
	            .force("y", d3.forceY(( this.height / 2) - this.margin.bottom / 2))  // // Apply positioning force to push nodes towards center along Y axis
	            .force("collide", d3.forceCollide(9)) // Apply collision force with radius of 9 - keeps nodes centers 9 pixels apart
	            .stop();  // Stop simulation from starting automatically

		 	for (let i = 0; i < this.dataset.length; ++i) {
	        	simulation.tick(1);
	        }

	        this.circles = this.g_circles.selectAll(".countries")
	            .data(this.dataset, d => d.country );

	        this.circles.exit()
	            .transition()
	            .duration(250)
	            .attr("cx", 0)
	            .attr("cy", (this.height / 2) - this.margin.bottom / 2)
	            .remove();

	        this.circles.enter()
	            .append("circle")
	            .attr("class", "countries")
	            .attr("cx", this.width/2)
	            .attr("cy", (this.height / 2) - this.margin.bottom / 2)
	            .attr("r", 6)
	            .attr("fill", "green") //function(d){ return colors(d.continent)})
	            .merge(this.circles)
	            .transition()
	            .duration(250)
	            .attr("cx", d => d.x )
	            .attr("cy", d => d.y )
	        ;

          	d3.selectAll(".countries")
          		.on("mousemove", (d)=> {
            	/*tooltip.html(`Country: <strong>${d.country}</strong><br>
                          ${chartState.legend.slice(0, chartState.legend.indexOf(","))}: 
                          <strong>${d3.format(",")(d[chartState.measure])}</strong>
                          ${chartState.legend.slice(chartState.legend.lastIndexOf(" "))}`)
                .style('top', d3.event.pageY - 12 + 'px')
                .style('left', d3.event.pageX + 25 + 'px')
                .style("opacity", 0.9);*/

                //console.info("d3.select(`circle#${d.country}`)",d3.select(`circle#${d.country}`)) ;
                //return ; 

            	this.xLine.attr("x1", d=>d.x)
	                .attr("y1", d=>d.y)
	                .attr("y2", (this.height - this.margin.bottom))
	                .attr("x2", d=>d.x)
	                .attr("opacity", 1);

            }).on("mouseout", (_)=> {
	            
	            //tooltip.style("opacity", 0);
	            this.xLine.attr("opacity", 0);

        	});




	        console.info("end redraw",new Date().getTime())
			


	    } // end redraw

	}

}

</script>

<style lang="scss">
h1{
	padding: 10px 0;
}
</style>