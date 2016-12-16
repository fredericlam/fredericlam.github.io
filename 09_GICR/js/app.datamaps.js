/**
* @project : GICR
* @team : CSU
* @author : Frédéric LAM
* @date : 08/12/2016
*/

var datamap_g ;
var map_width 	= $(window).width(); 
var map_height 	= $(window).height() - 120 ;
var zoomed 		= false ; 
var current_hub = undefined ; 
var hubs = {
	1 : { 'name' : 'SS-Africa' , 'label' : 'Sub saharian Africa', 'color' : '#31505c' } , 
	2 : { 'name' : 'NA,C-Africa, W.Asia' , 'label' : 'North Africa, Center Af. & Wester Asia', 'color' : '#edc84c' } , 
	3 : { 'name' : 'S,E,SE Asia' , 'label' : 'South, East & Southern East Asia',  'color' : '#fa594d' } , 
	4 : { 'name' : 'Carribean' , 'label' : 'The carribean',  'color' : '#ff8f8f' } , 
	5 : { 'name' : 'Pacific' , 'label' : 'Pacific islands',  'color' : '#731d43' } ,
	6 : { 'name' : 'LatAm' , 'label' : 'Latin America',  'color' : '#ff8800' }
} ; 

var gicr_csv 	= undefined ; 
var fill_countries = {} ; 
var level = 0 ; 
var countries = [] ; 
	
(function() {
	
	// set container height
  	$('#container').height( map_height ) ; 

  	// build legend 
  	for ( var h in hubs )
  	{
  		var span_a = '<span class="hub" style="background-color:'+hubs[h].color+';"></span>'+hubs[h].label ; 
  		var li = '<li><a href="javascript:void(0)" onclick="clickHub('+h+')">'+span_a+'</a></li>' ; 
  		$('ul.hubs-list').append( li ) ; 
  	}

	// loading gicr map
	d3.csv( "/data/gicr.csv" , function( data ){

		gicr_csv = data ; 

	    for( var item in data )
	    { 
	        if ( data[item].UN_Code == '') continue ; 
	        fill_countries[ data[item].UN_Code ] 	= { fillKey : data[item].HUB } ;     
	        countries[ data[item].UN_Code ] 		= data[item] ;     
	    }

	    var fills = {} ; 
	    for ( var h in hubs ) fills[ hubs[h].name ] = hubs[h].color ; 
	    fills['defaultFill'] = 'rgba(255,255,255,0.9)' ; 

	    // loading map
	    var map = new Datamap({

	        // container
	        element: document.getElementById('container') , 

	        // main colors 
	        fills: {
	            "SS-Africa" 			: hubs[1].color ,
	            "NA,C-Africa, W.Asia" 	: hubs[2].color ,
	            "S,E,SE Asia" 			: hubs[3].color ,
	            "Carribean" 			: hubs[4].color ,
	            "Pacific" 				: hubs[5].color ,
	            "LatAm" 				: hubs[6].color ,
	            defaultFill				: '#ffffff' // Any hex, color name or rgb/rgba value
	        }, 

	        // projection 
	        setProjection: function(element) {
	            var projection = d3.geo.equirectangular()
	              .center([0, 20])
	              .rotate([0, 0])
	              .scale(250)
	              .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
	            var path = d3.geo.path()
	              .projection(projection);

	            return {path: path, projection: projection};
	        },

	        done : function( datamap ) {
	        	
	        	datamap_g = datamap ; 

	        	// click event on country
	        	datamap_g.svg.selectAll("path").on( 'click' , function(d){

	        		// zoom on country 
	        		if ( d.id != undefined ) 
	        		{
	        			zoomRegion( d.id , 3 ) ; 
	        			writeCountry( d.id ) ; 
	        		}
	        	}) ; 
	        }, 

	        // config geography 
	        geographyConfig: {
	            dataUrl: null, // If not null, datamaps will fetch the map JSON (currently only supports topojson)
	            hideAntarctica: true,
	            hideHawaiiAndAlaska : false,
	            borderWidth: 1,
	            borderOpacity: 1,
	            borderColor: '#FDFDFD',
	            popupOnHover: true, // True to show the popup while hovering
	            highlightOnHover: true,
	            highlightFillColor: '#cccccc',
	            highlightBorderColor: '#9e9e9e',
	            highlightBorderWidth: 2,
	            highlightBorderOpacity: 1
	        },

	        // fill keys with color + un code
	        data: fill_countries

	    });

	}) ; 

})();

/**
* Find a geometry country with Geometries array and iso code 
* @param (array) list of geometries countries
* @param (string) iso code 
*/
function checkCountry(cnt, value) { 
    var found ; 
    cnt.filter(function(d){
        if( d.id == value ) { found = d ; return ; }
    });
    return found ; 
};

function clickHub( hub_id )
{	

	var scale = 2 ;

	switch( hub_id )
	{
		case 1 : // sub saharian africa
			var codeCountry = "CMR" ; 
			var translateX = map_width / 4 ; 
			break ; 

		case 2 : // northern africa
			var codeCountry = "GEO" ; 
			scale = 2 ; 
			var translateX = map_width / 3 ; 
			break ; 

		case 6 : // latin america
			var codeCountry = "COL" ; 
			scale = 1.8 ; 
			var translateX = map_width / 3.5 ; 
			var translateY = map_height / 3 ; 
			break ; 

		case 3 : // south east southern asia
			var codeCountry = "VNM" ; 
			var translateX = map_width / 2.8 ;
			scale = 1.8 ;  
			break ; 

		case 4 : // carribean
			var codeCountry = "LCA" ; 
			scale = 5 ;
			var translateX = map_width / 3.5 ; 
			var translateY = map_height / 3 ; 
 
			break ; 
		case 5 : 
			var codeCountry = "FJI" ; 
			scale = 10 ; 
			var translateX = map_width / 20 ; 
			break ; 
	}

	zoomRegion( codeCountry , scale , translateX , translateY , hub_id ) ; 

   	writeHub( hub_id ) ; 
}

function zoomRegion( codeCountry , scale , translateX , translateY , hub_id )
{
	var CanGraphMapFeatures = datamap_g.svg.selectAll("path")

	var focusedCountry = checkCountry( CanGraphMapFeatures , codeCountry );

	// 1st case : no focus found
	// 2nd case : click same hub so unzoom
    if ( focusedCountry == undefined || ( hub_id != undefined && current_hub == hub_id ) ) 
    {
    	current_hub = undefined ; 

        var x = 0 ;
        var y = 0 ; 
        scale = 1 ; 
        var stroke_width = 1 ; 
        var translate = "translate(0,0)" ; 
        
        zoomed = false ; 
        level = 0 ; 
    }
    else
    {
    	current_hub = hub_id ; 
    	level = 1 ; 

        var centroid = datamap_g.path.centroid( focusedCountry ) ;
        var x = centroid[0] ;
        var y = centroid[1] ;
        var stroke_width = 1.5 / scale ; 
        var centered = focusedCountry ;
        if ( translateX == undefined ) translateX = map_width / 4 ; 
        if ( translateY == undefined ) translateY = map_height / 2 ; 
        var translate = "translate(" + translateX + "," + translateY + ")" ; 

        zoomed = true ;     
    }

	datamap_g.svg.selectAll("g")
		.transition()
  		.duration( 1500 )
  		.attr("transform", translate + "scale(" + scale + ")translate(" + -x + "," + -y + ")")
  	;

  	datamap_g.svg.selectAll("path")
  		.style("height",function(d){

  			// no hub associated 
  			if ( fill_countries[ d.properties.iso ] == undefined ) return '' ; 

  			// key of current hub
  			for ( var h in hubs )
			{				
  				if( fill_countries[ d.properties.iso ].fillKey == hubs[h].name )  
  				{
  					var base_color 	= hubs[h].color ;
  					var base_key 	= h ;

  					if ( base_key == hub_id )
  					{
  						return base_color ; break ; 
  					}
  					else
  					{
  						return '#ffffff' ; 
  					}
  				}
  			}
  			return '#ffffff' ; 
  		}) ; 
}

function getHubById(hub_id)
{
	return hubs[hub_id]; 
}

function getHubByName(hub_name)
{
	for (var h in hubs)
	{
		if ( hubs[h].name == hub_name )
		{
			return hubs[h] ; 
			break ; 
		}
	}
	return false ; 
}

function writeHub(hub_id)
{	
	if ( hub_id == undefined || hub_id == 0 )
	{
		$('ul.breadcrumb,#hubPanel').removeClass('show') ; 
		$('.hub-name').text( '' ) ; 
	}	
	else
	{
		$('ul.breadcrumb,#hubPanel').addClass('show') ; 
		$('span.hub-name').text( ' > ' + hubs[hub_id].label ) ; 
		$('h2.hub-name').text( hubs[hub_id].label ) ; 

		// add list of countries
		$('ul.hubCountries').html(' ') ; 
		var hub = getHubById(hub_id) ; 

		for ( var g in gicr_csv )
		{
			if( gicr_csv[g].HUB == hub.name ) 
			{
				$('ul.hubCountries').append('<li>'+(gicr_csv[g].Country)+'</li>') ; 
			}
		}
	}
}

function writeCountry(country_id,mode)
{
	if ( country_id == undefined )
	{
		$('ul.breadcrumb,#countryPanel').removeClass('show') ; 
		$('.country-name').text( '' ) ; 
		$('span.hub-name').text( '' ) ; 
	}	
	else
	{
		if ( countries[country_id] == undefined ) return ; 

		var hub = getHubByName(countries[country_id].HUB);

		$('#hubPanel').removeClass('show');
		$('ul.breadcrumb,#countryPanel').addClass('show') ; 
		$('span.hub-name').text( ' > ' + hub.label ) ; 
		$('span.country-name').text( ' > ' + countries[country_id].Country ) ; 
		$('h2.country-name').text( countries[country_id].Country ) ; 
		
		// write more informations for country panel
		$('#collaborators').text( countries[country_id].Collaborators ); 
		$('#description').text( countries[country_id].Description );

		// load nvd3 data
		var chart = nv.addGraph(function() {
		  var chart = nv.models.discreteBarChart()
		      .x(function(d) { return d.label })    //Specify the data accessors.
		      .y(function(d) { return Math.round( d.value ) })
		      .staggerLabels(true)    //Too many bars and not enough room? Try staggering labels.
		      .showValues(true)       //...instead, show the bar value right on top of each bar.
		    ;

		  d3.select('#chart svg')
		      .datum([ 
			    {
			      key: "Cumulative Return",
			      values: [
			      	{ "label" : "Visits" , "value" : rand() , "color" : "#eb9131" } , 
			        { "label" : "Publications" , "value" : rand() , "color" : "#4eccc1"} , 
			        { "label" : "Reports" , "value" : rand() , "color" : "#c7f263"} , 
			        { "label" : "Research" , "value" : rand() , "color" : "#de4949"} , 
			        { "label" : "Training" , "value" : rand() , "color" : "#731d43"} 
			      ]
			    }
			  ])
		      .call(chart);

		  nv.utils.windowResize(chart.update);

		  return chart;
		});

		chart.pie.valueFormat(d3.format('.0'));
	}
}

function rand()
{
	return Math.floor(Math.random() * 20) + 1   ; 
}