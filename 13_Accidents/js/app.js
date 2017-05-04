	
	$(document).ready( function(){

		queue()
	       	.defer( d3.csv, "data/caracteristiques_2015.csv" )
	       	.defer( d3.csv, "data/lieux_2015.csv" )
	       	.defer( d3.csv, "data/usagers_2015.csv" )
	       	.defer( d3.csv, "data/vehicules_2015.csv" )
	       	.await( function( error , caracteristiques , lieux, usagers, vehicules ) {

	       		console.info( caracteristiques ) ;

	       	} ); 	
	    ; 

	}) ; 