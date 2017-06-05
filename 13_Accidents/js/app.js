	
	$(document).ready( function(){

		var lumieres = {
			1 : 'Plein jour', 
			2 : 'Crepuscule' , 
			3 : 'Nuit sans eclairage public', 
			4 : 'Nuit avec eclairage public non allumé', 
			5 : 'Nuit avec eclairage public allumé'
		}; 

		var categories_routes = {
			1 : 'Autoroute',
			2 : 'Route Nationale',
			3 : 'Route Départementale',
			4 : 'Voie Communale',
			5 : 'Hors réseau public',
			6 : 'Parc de stationnement ouvert à la circulation publique',
			9 : 'autre'
		} ; 

		var circulation = {
			1 : 'A sens unique',
			2 : 'Bidirectionnelle',
			3 : 'A chaussées séparées',
			4 : 'Avec voies d’affectation variable'
		} ; 

		var vosp = {
			1 : 'Piste cyclable',
			2 : 'Banque cyclable',
			3 : 'Voie réservée '
		}

		var situation = {
			1 : 'Sur chaussée',
			2 : 'Sur bande d’arrêt d’urgence',
			3 : 'Sur accotement',
			4 : 'Sur trottoir',
			5 : 'Sur piste cyclable'
		}

		var gravite = {
			1  : 'Indemne',
			2  : 'Tué',
			3  : 'Blessé hospitalisé',
			4  : 'Blessé léger',
		}

		var obstacles_m = {
			1 : 'Piéton' , 
			2 : 'Véhicule' , 
			4 : 'Véhicule sur rail' , 
			5 : 'Animal domestique', 
			6 : 'Animal sauvage', 
			9 : 'Autre'
		}

		var cat_usagers = {
			1 : 'Conducteur', 
			2 : 'Passager', 
			3 : 'Piéton', 
			4 : 'Piéton en roller ou en trottinette'
		}

		queue()
	       	.defer( d3.csv, "data/caracteristiques_2015.csv" )
	       	.defer( d3.csv, "data/lieux_2015.csv" )
	       	.defer( d3.csv, "data/usagers_2015.csv" )
	       	.defer( d3.csv, "data/vehicules_2015.csv" )
	       	// .defer( d3.csv, "data/dataset.csv" )
	       	.await( function( error , caracteristiques_csv , lieux_csv , usagers_csv , vehicules_csv ) {

	       		var vehicules = vehicules_csv.filter( function(d){ return d.catv == '01' ; }); 

	       		var accidents = d3.nest()
	       			.key( function(d){ return d.Num_Acc ; })
	       			.entries( vehicules )

	       		var lieux = [] , usagers = [] ; 

	       		for ( var l in lieux_csv )
	       		{
	       			lieux[ lieux_csv[l].Num_Acc ] = lieux_csv[l] ; 
	       		}

	       		var usagers = d3.nest()
	       			.key( function(d){ return d.Num_Acc ; })
	       			.entries( usagers_csv ) ; 

	       		var usagers_per_key = [] ; 

	       		for ( var u in usagers )
	       		{
	       			usagers_per_key[ usagers[u].key ] = usagers[u] ; 
	       		}

	       		for ( var v in accidents )
	       		{
	       			accidents[v].lieu 		= lieux[ accidents[v].values[0].Num_Acc ] ; 
	       			accidents[v].usagers 	= usagers_per_key[ accidents[v].values[0].Num_Acc ].values ; 
	       		}

	       		// console.info( accidents ) ; 

	       	
	       		for ( var c in accidents ) 
	       		{
	       			var row = accidents[c] ;
	       			
	       			// console.info( row.usagers ) ; 

	       			var line = '<tr>' ; 
	       			line += '<td>'+row.key+'</td>'; // row.key
	       			line += '<td>'+row.values[0].num_veh+'</td>'; // row.key
	       			line += '<td>'+situation[ row.lieu.situ ]+'</td>'; 
	       			line += '<td>'+categories_routes[row.lieu.catr]+'</td>'; 
	       			line += '<td>'+circulation[ row.lieu.circ ]+'</td>'; 
	       			line += '<td>'+obstacles_m[ row.values[0].obsm ]+'</td>'; 

	       			// usagers 
	       			var usager_html = '<ol>';
	       			for ( var u in row.usagers )
	       			{
	       				usager_html += '<li>'+cat_usagers[row.usagers[u].catu]+' - '+row.usagers[u].num_veh+' - ('+gravite[row.usagers[u].grav]+')</li>'
	       			}
	       			usager_html += '</ol>';

	       			line += '<td>'+usager_html+'</td>'; 

	       			line += '</tr>'; 

	       			$('tbody').append( line ) ;
	       			
	       			// if ( c == 10000 ) break ; 

	       		}

	       		$('#accidents').DataTable();

	       	} ); 	
	    ; 

	}) ; 