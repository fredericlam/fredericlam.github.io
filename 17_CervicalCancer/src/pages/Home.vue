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
import { reactive,computed,onMounted } from "vue";
import { useStore } from 'vuex' ;
 
export default {
	name : 'about' , 
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
	    	width: 0 ,
	    	height : 500 , 
	    	margin : {top: 0, right: 40, bottom: 40, left: 40} 
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

	},

	unmounted(){

	}

	methods : {

		

	}

}

</script>

<style lang="scss">
h1{
	padding: 10px 0;
}
</style>