/**
 * Main application for "Champions cyclistes app"
 *
 * Comment postuler ? 
 * Plutôt qu’une sélection classique, nous vous proposons un exercice de sélection :
 *
 * A partir de données que vous irez récupérer sur le web, saurez-vous concevoir et réaliser un générateur capable de fournir, selon l’année de naissance du lecteur, le vainqueur du tour de france de cette année, le meilleur grimpeur et le meilleur sprinter ? L’objet créé devra être “responsive”, et hébergé sur un serveur dont vous nous communiquerez l’URL. 
 * Si cette offre vous intéresse, n’hésitez pas à nous contacter et à nous envoyer un CV et votre générateur de champions cyclistes, avant le 15 juillet, à l’adresse : lesdecodeursrecrutent@gmail.com
 *
 * @namespace EmberInspector/Shared
 * @class InPageScript
 */
(function($) {
  
  "use strict";
  
  if (!$) { return; }

  $(function() {
  	
  	var main_color = '#fabb00' ; 
  	var current_year = null ; 

  	

	var row = {} ; 
	var dataset = [] ; 

	// load data
	$.getJSON( "data/winners.json", function( data ) {
		dataset = data ; 
	});

	// calculate max
	var max_distance = d3.max( dataset , function(d){ return d.distance ; }) ; 
	var max_speed = d3.max( dataset , function(d){ return d.speed ; }) ; 
	var max_step = d3.max( dataset , function(d){ return d.step ; }) ; 

	// rectange for distance
  	var distance_chart = c3.generate({
	    bindto: '#distance',
	    size: {
		  height: 550
		},
	    data: {
	      columns: [
	        [ 'distance', 0 ]
	      ],
	      type: 'bar'
	    },
	    color: {
		  pattern: [ main_color ]
		}, 
		interaction: {
		  enabled: false
		},
		legend: {
		  show: false
		},
	    bar: {
	        width: 100 
	    }, 
	    axis : {
	    	y : {
	    		max : 5500 
	    	}
	    }
	});

  	// gauge for speed 
	var gauge_chart = c3.generate({
		bindto: '#speed',
	    data: {
	        columns: [
	            ['speed', 0 ]
	        ],
	        type: 'gauge',
	        onclick: function (d, i) { console.log("onclick", d, i); },
	        onmouseover: function (d, i) { console.log("onmouseover", d, i); },
	        onmouseout: function (d, i) { console.log("onmouseout", d, i); }
	    },
	    interaction: {
		  enabled: false
		},
		legend: {
		  show: false
		},
		gauge: {
			label: {
	            format: function(value, ratio) {
	                return value + ' km/h';
	            },
	            show: false // to turn off the min/max labels.
	        }
	    },
	    color: {
	        pattern: [ main_color ], // the three color levels for the percentage values.
	    },
	    size: {
	        height: 180
	    }
	});

	// feed years
	for( var y = 1905 ; y <= 2016 ; y++ ) $('select#select-year').append('<option value="'+y+'">'+y+'</option>') ; 

	// handler on year
	$('select[name="year"]').change(function(){

		$('.main header').addClass('run');
		$('.viz').show();

		current_year = $(this).val();
		
		for( var item in dataset )
		{
		  	if ( current_year == dataset[item].year )
		  	{
		  		row = dataset[item] ; 
		  		break  ;
		  	}
		}

		//console.info(row);
		
		// set winner 
		if ( row.winner != '' ) 
		{	
			$('#winner').text( row.winner ) ; 
			$('#winner').fadeIn();
		}

		if ( row.climber != '' ) 
		{
			$('#climber').text( row.climber ) ; 
			$('#container-climber,#climber').fadeIn();
		}
		else
		{
			$('#container-climber,#climber').fadeOut();
		}

		if ( row.points != '' ) 	
		{		
			$('#sprinter').text( row.points ) ; 
			$('#container-sprinter,#sprinter').fadeIn();
		}
		else
		{
			$('#container-sprinter,#sprinter').fadeOut();
		}

		if ( row.youth != '' ) 	
		{	
			$('#youth').text( row.youth ) ; 
			$('#container-youth,#youth').fadeIn();
		}
		else
		{
			$('#container-youth,#youth').fadeOut();
		}

		gauge_chart.load({
	        columns: [['speed', row.speed ]]
	    });

		distance_chart.load({
	    	columns : [['distance', row.distance ]]	
	    })

		$('#nb-step').text(row.step);
		$('ul#list-nb-step').html(' '); 
		for( var i = 0 ; i < Math.abs(row.step); i++) $('ul#list-nb-step').append('<li><i class="fa fa-flag-checkered" aria-hidden="true"></i></li>');

	    $('#nb-distance').text(row.distance+'m');

	})

	


  }); // end func

}(window.jQuery)); // end func
