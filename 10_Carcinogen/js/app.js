	
	var width 	= 1024;
	var height 	= 850 ;


	d3.dsv(';')( 'data/classifications-carcinogens.csv' , function( error , csv ){


		var groups 	= d3.nest().key(function(d) { return d.group; }).entries( csv );
		var years 	= d3.nest().key(function(d) { return d.year; }).entries( csv );

		console.info( groups ) ;
		console.info( years ) ;
		
	}) ; 
	