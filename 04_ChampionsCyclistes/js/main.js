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

  	var distance_chart = c3.generate({
	    bindto: '#distance',
	    size: {
		  height: 550
		},
	    data: {
	      columns: [
	        [ 'distance', 50 ]
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
	    }
	});

	var gauge_chart = c3.generate({
		bindto: '#speed',
	    data: {
	        columns: [
	            ['speed', 91]
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

	$('select[name="year"]').click(function(){
		var max = 100 , min = 50 ; 
		var random = Math.random() * (max - min) + min ; 
		gauge_chart.load({
	        columns: [['speed', random ]]
	    });
	})

  }); // end func

}(window.jQuery)); // end func
