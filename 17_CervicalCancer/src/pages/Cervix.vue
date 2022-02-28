<template>

	<div class="container">

		<h1>Social inequalities</h1>
		<h2 style="text-align: center;">Cervical cancer, Age-Standardized Rate, Females, by Level of Education</h2>
		
		<div class="model" id="model1">
			<div class="row">

				<div class="col-md-2">

					<div class="filters">
						<form>
							<div class="mb-3">
								<label class="form-label">Sort by level of education</label>
								<select id="sort_by" v-model="sort_by" placeholder="Sort by" class="form-select" v-on:change="redraw">
									<option v-for="f in filters.educations" :value="f.edu">{{ f.edu }}</option>
								</select>
							</div>

							<div class="mb-3">
								<label class="form-label">Sort direction</label>
								<select id="sort_dir" v-model="sort_dir" placeholder="Sort direction" class="form-select" v-on:change="redraw">
									<option value="asc">Ascending</option>
									<option value="desc">Descending</option>
								</select>
							</div>
						</form>

						<ul class="list-group" id="countries_list">
							<li class="list-group-item" v-for="population in filters.populations_ordered">
								<a href="javascript:void(0)" class="country_button">
									<img :src="'../img/flags/'+population.iso+'.svg'">
									{{ population.label }}	
								</a>
							</li>
						</ul>

					</div>

				</div>

				<div class="col-md-10">

					<div class="story">
						<div class="row">

							<div class="col-md-6">
								<p class="step1">
									<a href="#" class="link_step" v-on:mouseover="mouseOver(['Higher'])" v-on:mouseout="mouseOut">
										For <span class="step_marker" style="background-color: #ffc300">high-education countries</span>, cancer rates is low almost everywhere
									</a>
								</p>
							</div>

							<div class="col-md-6">
								<p class="step2">
									<a href="#" class="link_step" v-on:mouseover="mouseOver(['Intermediate','Lower'])" v-on:mouseout="mouseOut">
									Whereas for <span class="step_marker step_marker_white" style="background-color: #571845">low-education</span> and <span class="step_marker step_marker_white" style="background-color: #c70039">intermediate-education</span> countries, cancer rates are much more variable and disparate.
									</a>
								</p>
							</div>
								
						</div>
					</div>

					<div id="graphic"></div>

				</div>

			</div><!-- end row -->

		</div><!-- end model1 -->


	</div>

</template>

<script>

// from https://github.com/MartinHeinz/charts/blob/master/beeswarm/beeswarm.js

import { reactive,computed,onMounted } from "vue";
import { useStore } from 'vuex' ;
import axios from 'axios'

export default {
	name : 'Cervix' , 
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
	    	height : 600 , 
	    	margin : {top: 10, right: 40, bottom: 80, left: 40} ,

	    	x_scale : [] , 
	    	x_axis : [] ,

	    	y_scale : [] , 
	    	y_axis : [] ,

	    	color_scale : {} , 
	    	colors : ["#571845","#C70039","#FFC300"] ,

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

			chartState : {} , 

			filters : {} , 

			sort_by : 'Higher',
			sort_dir : 'asc'
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
	      	//.attr("style", "max-width: 100%; height: auto;")

	    this.tooltip = d3.select('#graphic').append('div')
			.attr('class','tooltip_viz') 
			.style('opacity',0)
		; 

	    // this.y_scale = d3.scaleLinear()
    		//.range([this.margin.top, this.height - this.margin.bottom- this.margin.top]);

    	this.svg.append("g")
		    .attr("class", "y axis")
		   	.attr("transform", `translate(${this.margin.left},0)`) 
		   	.attr("text-anchor","end")
		   	// + (this.height - this.margin.bottom) + ")");
		
		this.g_circles = this.svg.append('g')
	        .attr('class','group_circles') 
		    //.attr("transform", `translate(${this.margin.left},0)`) 
		   	// ${this.margin.top})`) 

		this.svg.append("g")
		    .attr("class", "x axis")
		    .attr("transform", `translate(0,${this.height-this.margin.bottom})`) 

		this.xLine = this.svg.append("line")
		    .attr("stroke", "rgb(96,125,139)")
		    .attr("stroke-dasharray", "1,2");

		this.chartState.measure = this.count.total ;
		this.chartState.scale 	= this.scales.lin ;
		this.chartState.legend 	= this.legend.total ;

		let promise = axios.get( "../data/dataset.json" ) ; 

		axios.all( [promise] )
			.then( axios.spread(( dataset_promise ) => {

				this.dataset = dataset_promise.data.map( d => {
					return {
						id : `dot-${d.country_iso2}-${d.edu_3cat}` , 
						iso : d.country_iso2 , 
						country : d.country , 
						year : parseFloat(d.midyear) , 
						edu : d.edu_3cat , 
						asr : ( d.asmr == 'NA') ? 'NA' : parseFloat(d.asmr.replace(',','.'))
					}
				}) ;

				// console.table(this.dataset) ; 
				this.filters.years = Array.from( d3.group( this.dataset , d => d.year ) )
					.map( m =>{ 
						return { year : m[0] } 
					})

				this.filters.populations_ordered = Array.from( d3.group( this.dataset , d => d.iso ) )
					.map( m =>{ 
						return { iso : m[0] , label : m[1][0].country } 
					})
					.sort((a, b)=> {
						if(a.iso < b.iso) { return -1; }
    					else if(a.iso > b.iso) { return 1; }
					})

				this.filters.educations = Array.from( d3.group( this.dataset , d => d.edu ) )
					.map( m =>{ 
						return { edu : m[0] } 
					})

				this.color_scale = d3.scaleOrdinal()
					.range(this.colors)
					.domain(this.filters.educations)

				this.filters.colors = [] ; 	
				this.colors.forEach((c,i)=>{
					this.filters.colors.push({ color : c , edu : this.filters.educations[i].edu }) ; 
				})
				this.filters.colors.reverse() ;	

				console.table(this.filters.colors) ;

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

		setLegend : function( legends ){

			this.svg.select('g.legend').remove();
			
			this.g_legend = this.svg.append('g')
				.attr('class','legend')
				.attr('transform',`translate(40,${this.height-(this.margin.bottom/2)})`)

			// this.legend = 
			// .data(this.dataset, d => d.id );
			this.legends = this.g_legend.selectAll(".color")
	            .data( legends , d => d.color );

	        this.legends_subgroups = this.legends
	        	.enter()
	            .append("g")
	            .attr("class", "group") ; 

	        let l_width = 110 ; 

	        this.legends_subgroups
	        	.append('circle')
	            .attr("r",6)
	            .attr("cx",(c,i)=>{
	            	let width = ( i == 1 ) ? 90 : l_width ;
	            	return width*i;
	            })
            	.attr("cy",10) 
            	.attr("fill",f=>f.color)
            	.style("stroke","#000")
	            .style("stroke-width","0.5px")
            ; 

            this.legends_subgroups
            	.append('text')
            	.attr("x",(c,i)=>{
            		let width = ( i == 1 ) ? 90 : l_width ;
	            	return (width*i)+20;
	            })
            	.attr("y",15) 
            	.attr("text-anchor","start")
	            .text( t => t.edu )
		},

		mouseOver : function( edu ){

			this.g_circles.selectAll(".country")
				.style('opacity', o => {
					if ( o.asr == 'NA') return 0 ; 
					let opacity = 0 ;
					if ( edu.includes(o.edu) ) opacity = 1 ; 
					return opacity ; 
				})
				.transition()
	            .duration(500)
	            .attr("cy",this.height-this.margin.bottom)
				.transition()
	            .duration(2000)
	            .attr("cy",d=>this.y_scale(d.asr))
				.style('opacity', o => {
					if ( o.asr == 'NA') return 0 ; 
					let opacity = 0 ;
					if ( edu.includes(o.edu) ) opacity = 1 ; 
					return opacity ; 
				}) ; 
		},

		mouseOut : function(){

			this.g_circles.selectAll(".country")
				.style('opacity',o => {
					if ( o.asr == 'NA') return 0 ; 
					return 1 ; 
				}) ; 

		} , 

		/**
		* Redraw graphic
		* @param (no param)
		* @return (no return )
		*/
		redraw : function(){

			console.info("Sorting","sort_by",this.sort_by,"sort_dir",this.sort_dir)

			// legend
			this.setLegend( this.filters.colors );

			this.dataset.map( m => {
				m.sort = ( m.edu == this.sort_by ) ? m.asr : 0  ; 
				return m ; 
			})

			this.dataset_sorted = this.dataset
				.sort((a, b)=> {
					if ( this.sort_dir == 'desc') 
						return (b.sort - a.sort) ;
					else
					 	return (a.sort - b.sort) ;
				})
				// .sort((a, b)=> b.asr - a.asr)
            ;

            if ( this.sort_dir == 'asc') 
            	this.dataset_sorted = this.dataset_sorted.filter(f=>f.sort!=0) ; //.reverse() ;

			// console.table(this.dataset_sorted) ; 

			this.filters.populations = Array.from( d3.group( this.dataset_sorted , d => d.iso ) )
				.map( m =>{ 
					return { iso : m[0] , label : m[1][0].country } 
				})

		 	this.x_scale = d3.scaleBand()
			 	.domain( this.filters.populations.map( p => p.iso ) )
	        	.rangeRound([ this.margin.left , this.width - this.margin.right ]) 
	        	//.paddingInner(1)
	        ;
	        	

			// Set scale type based on button clicked
	        if (this.chartState.scale === this.scales.lin) {
	            this.y_scale = d3.scaleLinear().range([this.height-this.margin.bottom,this.margin.top]) //.range([ this.margin.top , this.height - this.margin.bottom ])
	        }

	        if (this.chartState.scale === this.scales.log) {
	            //this.y_scale = d3.scaleLog().range([0,this.height]) //.range([ this.margin.top, this.height - this.margin.bottom ]);
	        }

	        this.domains = d3.extent(this.dataset, (d)=> {
            	return +d.asr ;
        	}); 
        	

	        this.y_scale.domain([0,this.domains[1]] ).nice() ;

	       	//console.log("this.filters.populations.map( p => p.iso )",this.filters.populations.map( p => p.iso )) ;

	        // Set X axis based on new scale. If chart is set to "per capita" use numbers with one decimal point
	        if (this.chartState.measure === this.count.perCap) {
	            this.y_axis = d3.axisLeft(this.y_scale)
	                .ticks(10, ".1f")
	                .tickSizeOuter(0);
	        }
	        else {
	            this.y_axis = d3.axisLeft(this.y_scale)
	                .ticks(10)
	                .tickSize(-(this.width-this.margin.left-this.margin.right))
	                .tickSizeOuter(1)

	            ;

	            this.x_axis = d3.axisBottom(this.x_scale)
	            	.ticks(10)
	            	//.tickFormat("")
	        }
	        // console.info("this.x_scale",this.x_scale)

	        d3.transition(this.svg).select(".y.axis")
	            .transition()
	            .duration(750)
	            .call(this.y_axis);

	        d3.transition(this.svg).select(".x.axis")
	            .transition()
	            .duration(750)
	            .call(this.x_axis);

	        //return ; 

	        this.circles = this.g_circles.selectAll(".country")
	            .data(this.dataset, d => d.id );

	        this.circles.exit()
	            .transition()
	            .duration(250)
	            .remove();

	        this.circles.enter()
	            .append("circle")
	            .attr("class", "country")
	            .attr("cx", d=>this.x_scale(d.iso)+ this.x_scale.bandwidth()/2)
            	.attr("cy",this.height-this.margin.bottom)
	            .attr("r", 6)
	            .attr("fill", "#fff") //function(d){ return colors(d.continent)})
	            .style("opacity",d=>{
	            	return (d.asr=='NA')?0:1;
	            })
	            .merge(this.circles)
	            .transition()
	            .duration(1250)
	            .attr("cx", d=>this.x_scale(d.iso)+ this.x_scale.bandwidth()/2)
            	.attr("cy",d=>this.y_scale(d.asr))
	            .style("opacity",d=>{
	            	return (d.asr=='NA')?0:1;
	            })
	            .attr('attr-edu', e => e.edu )
	            .attr("fill", d=>{ 
	            	return this.color_scale(d.edu) 
	            })
	            .style("stroke","#000")
	            .style("stroke-width","0.5px")
	            
	        this.g_circles.selectAll(".country")
	        	.on("mousemove", (event, d) => {

	        		let pointer = d3.pointer(event,this.g_circles.node())

		        	this.tooltip.html(`
		        		<table>
		        			<tr>
		        				<td class="metric">Population</td>
		        				<td class="value">${d.country}</td>
		        			</tr>
		        			<tr>
		        				<td class="metric">Education</td>
		        				<td class="value">${d.edu}</td>
		        			</tr>
		        			<tr>
		        				<td class="metric">ASR</td>
		        				<td class="value">${d.asr.toFixed(2)}</td>
		        			</tr>
		        		</table>
		        		`)
		            .style('top', pointer[1] - 100 + 'px')
		            .style('left', pointer[0] - 120  + 'px')
		            .style('display','block')
		            .style("opacity", 0.9);
		    	})

	            .on("mouseout", (_)=> {
		        	this.tooltip
		        		.style("top", 0)
		        		.style("left", 0)
		        		.style("opacity", 0);
		            //this.xLine.attr("opacity", 0);
	        	});

	            //.attr("cx", d => d.x )
	            //.attr("cy", d => d.y )
	        ;

	    } // end redraw

	}

}

</script>

<style lang="scss">
h1{
	padding: 10px 0;
	text-align: center ;
	font-weight: 900;
	text-transform: uppercase; 
}

.model{
	padding-bottom: 40px ;
	.story{
		padding-left: 40px;
		a.link_step{
			display: block ; 
			font-size: 1.2em;
			padding: 20px;
			width: 100%;
			height: 100%;
			min-height: 120px;
			&:hover{
				background: #f0f0f0 ; 
				text-decoration: none!important;
			}
			span.step_marker_white{
				color: #fff ; 
			}
		}
	}
}

#countries_list{
	.list-group-item{
		&:hover{
			background: #f0f0f0 ; 
		}
		a.country_button{
			text-decoration: none!important;
			display: block;
			&:hover{
				text-decoration: none!important;
			}
			img{
				width: 20px;
			}
		}
	}
}

#graphic{
	position: relative ; 
}


g.x.axis{
	.tick{
		text{
			font-size: 1.2em;
		}
	}
}

g.y.axis{
	.tick{
		line{
			stroke: #ccc ;
		}
	}
}

.filters{
	.legend{
		padding-left:0 ;
	}
}


</style>