	
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

		var obstacles = {
			1 : 'Véhicule en stationnement',
			2 : 'Arbre',
			3 : 'Glissière métallique',
			4 : 'Glissière béton',
			5 : 'Autre glissière',
			6 : 'Bâtiment, mur, pile de pont',
			7 : 'Support de signalisation verticale ou poste d’appel d’urgence',
			8 : 'Poteau',
			9 : 'Mobilier urbain',
			10 : 'Parapet',
			11 : 'Ilot, refuge, borne haute',
			12 : 'Bordure de trottoir',
			13 : 'Fossé, talus, paroi rocheuse',
			14 : 'Autre obstacle fixe sur chaussée',
			15 : 'Autre obstacle fixe sur trottoir ou accotement',
			16 : 'Sortie de chaussée sans obstacle ',
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

		var sexes = {
			1 : 'Homme', 
			2 : 'Femme'
		}

		var trajets = {
			1 : 'Domicile <-> travail',
			2 : 'Domicile <-> école',
			3 : 'Courses <-> achats',
			4 : 'Utilisation professionnelle',
			5 : 'Promenade <-> loisirs',
			9 : 'Autre' 
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
	       		var caracteristiques = [] ; 

	       		for ( var u in usagers )
	       		{
	       			usagers_per_key[ usagers[u].key ] = usagers[u] ; 
	       		}

	       		for ( var c in caracteristiques_csv )
	       		{
	       			caracteristiques[ caracteristiques_csv[c].Num_Acc ] = caracteristiques_csv[c] ; 
	       		}


	       		for ( var v in accidents )
	       		{
	       			accidents[v].lieu 		= lieux[ accidents[v].values[0].Num_Acc ] ; 
	       			accidents[v].usagers 	= usagers_per_key[ accidents[v].values[0].Num_Acc ].values ; 
	       			accidents[v].caracteristiques = caracteristiques[ accidents[v].values[0].Num_Acc ] ; 
	       		}


	       		// console.info( accidents ) ; 

	       	
	       		for ( var c in accidents ) 
	       		{
	       			var row = accidents[c] ;
	       			var values = row.values[0]; 
	       			
	       			// console.info( values ) ; 

	       			var line = '<tr>' ; 
	       			line += '<td>'+row.key+'</td>'; // row.key
	       			line += '<td>'+row.caracteristiques.com+'</td>'; 
	       			line += '<td>'+row.caracteristiques.lat+'</td>';
	       			line += '<td>'+row.caracteristiques.long+'</td>'; 
	       			line += '<td>'+values.num_veh+'</td>'; 
	       			line += '<td>'+situation[ row.lieu.situ ]+'</td>'; 
	       			line += '<td>'+row.caracteristiques.mois+'</td>'; 

	       			var dd = row.caracteristiques.hrmn ; 
	       			if ( dd.length == 3 ) dd ='0'+dd ; 
	       			else if ( dd.length == 2 ) dd ='00'+dd ; 
	       			else if ( dd.length == 1 ) dd = '000'+dd ; 

	       			var tmp =  Array.from(dd) ;
	       			var time = tmp[0]+tmp[1]+':'+tmp[2]+tmp[3]; 

	       			line += '<td>'+time+'</td>'; 
	       			line += '<td>'+circulation[ row.lieu.circ ]+'</td>'; 
	       			line += '<td>'+obstacles[row.values[0].obs] +'</td>'; 
	       			line += '<td>'+obstacles_m[ row.values[0].obsm ]+'</td>'; 

	       			// usagers 
	       			var usager_html = '<ol>';
	       			for ( var u in row.usagers )
	       			{
	       				usager_html += '<li>'+cat_usagers[row.usagers[u].catu]+' - '+row.usagers[u].num_veh+' - '+sexes[row.usagers[u].sexe]+' né en '+row.usagers[u].an_nais+' ['+trajets[row.usagers[u].trajet]+'] - ('+gravite[row.usagers[u].grav]+')</li>'
	       			}
	       			usager_html += '</ol>';

	       			line += '<td>'+usager_html+'</td>'; 

	       			line += '</tr>'; 

	       			$('tbody').append( line ) ;
	       			
	       			// if ( c == 10000 ) break ; 

	       		}

	       		var table = $('#accidents').DataTable({
	       			buttons: ['excel','csv']
	       		});

	       		table.buttons().container().appendTo( "#download" );

	       	} ); 	
	    ; 

	}) ; 