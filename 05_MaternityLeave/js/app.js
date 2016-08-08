	
	var width = $(window).width() ,
    	height = $(window).height() ;

    var svg, projection, path, zoom;

    var radius = d3.scale.sqrt()
	    .domain([ 0, 25 ])
	    .range([ 0, 15 ]);

    projection = d3.geo.mercator()
        .scale(height/3.5)
        .translate([width / 2, height / 1.6]);

    path = d3.geo.path()
        .projection(projection);

    zoom = d3.behavior.zoom()
        .translate([0, 0])
        .scale(1)
        .scaleExtent([1, 100]) ; 

    queue()
        .defer(d3.json, 'data/map.json')
        .defer(d3.json, 'data/countrycodes.json')
        .defer(d3.csv, 'data/maternity.csv')
        .await(function( error, map , countrycodes , maternity ){
        	console.log( maternity ) ; 
        	var countries_shapes = grabData( map.objects.countries , maternity ) ; 
		    mapcountries = topojson.feature( map, countries_shapes ) ;

		    svg = d3.select('#map svg')
		    	.attr('width',width) 
		    	.attr('height',height)
		    ; 
		    	
		    var countries = svg.append('g').attr('id', 'countries');
		    countries.selectAll('.country')
		        .data(mapcountries.features)
		        .enter()
		        .append('path')
		        .attr('id', function(d) {
		            return d.id;
		        })
		        .attr('class', 'country')
		        .attr('d', path)
		        /*.on('mouseover', mapMousedOver)
		        .on('mouseout', mapMousedOut)
		        .on('click', mapClicked)
		        .on('touchstart', function() {
		            mapClicked();
		            d3.event.preventDefault();
		        })*/
		    ;

		    var circles = svg.append("g")
	            .selectAll("circle")
	            .data(mapcountries.features)
	            .enter().append("circle")
	            .attr("class","bubble")
	            .attr("title",function(d){ 
	            	return d.properties.name + ' : '+getWeeks(d)+' weeks \n'+ d.properties.desc + ' '+d.properties.misc ; 
	            })
	            .style('fill-opacity', '0.6')
	            .style('stroke','#ffffff')
	            .style('stroke-width','.5px')
	            .attr("transform", function(d) { 
	            	if ( d.properties.name == 'South Africa')
	            		return "translate(" + path.centroid(d) + ")"; 
	            	else
	            		return "translate(" + path.centroid(getMaxFeature(d)) + ")"; 
	            })
	           	.attr('r',0)
	        ; 

	        $('.bubble').tooltip({title:'some title', container:'body'});

	        circles.transition().duration(7000)
	        	.attr("r", function(d){
	            	return radius(d.properties.value);
	            }) ;
        });

    /**
    * Grab data to geometries
    * @param (array) list of shapres
    * @param (array) maternity data
    * @return (array)
    */ 
    var grabData = function( countries_shapes  , maternity ){

    	for( var item in countries_shapes.geometries ){

    		var base_name = countries_shapes.geometries[item].properties.name ; 
    		
    		for ( var m in maternity ) {

    			if ( maternity[m].Country == base_name ){

    				// 
    				// console.log( maternity[m] );
    				countries_shapes.geometries[item].properties.value = maternity[m].value ; 
    				countries_shapes.geometries[item].properties.metric = maternity[m].metric ;
    				countries_shapes.geometries[item].properties.percent = maternity[m].percent ; 
    				countries_shapes.geometries[item].properties.desc = maternity[m].desc ;  
    				break ; 
    			}

    		} // end for 

    		//if ( countries_shapes.geometries[item].properties.value == undefined ) console.error(base_name);

    	} // end for 

    	return countries_shapes ; 
    } ; 

    /**
    * GetMaxFeature to position centroid
    * @param (string) country code
    * @return (object)
    */
    var getMaxFeature = function(country) {
	    var parent = country;

	    if (parent.geometry == undefined) {
	        return false;
	    }

	    if (parent.geometry.coordinates.length > 1) {
	        var largestChild = {
	            'type': 'Feature',
	            'id': country.id + '-0',
	            'properties': {
	                'name': country.id + '-0'
	            },
	            'geometry': {
	                'type': 'Polygon',
	                'coordinates': [(parent.geometry.coordinates[0].length == 1) ? parent.geometry.coordinates[0][0] : parent.geometry.coordinates[0]]
	            }
	        };

	        for (var i = 1; i < parent.geometry.coordinates.length; i++) {
	            var child = {
	                'type': 'Feature',
	                'id': country.id + '-' + i,
	                'properties': {
	                    'name': country.id + '-' + i
	                },
	                'geometry': {
	                    'type': 'Polygon',
	                    'coordinates': [(parent.geometry.coordinates[i].length == 1) ? parent.geometry.coordinates[i][0] : parent.geometry.coordinates[i]]
	                }
	            };

	            if (path.area(child) > path.area(largestChild))
	                largestChild = child;
	        }
	        return largestChild;
	    } else {
	        return parent;
	    }
	}

	/**
	* Calculate number of weeks 
	* @param (object)
	*/
	var getWeeks = function(d){

		// ignore wrong value
    	if ( isNaN(d.properties.value) ) d.properties.value = 0 ; 
    	// check metric
    	if ( d.properties.metric != 'weeks' && d.properties.metric != undefined )
    	{
    		d.properties.source = d.properties.value ; 
    		switch( d.properties.metric )
    		{
    			case 'days' : 
    			case 'calendar days' :
    			case 'working days' :
    				d.properties.value = Math.round( d.properties.value / 7 ) ;
    				break ; 
    			
    			case 'months' :
    				d.properties.value = Math.round( d.properties.value / 4 ) ;
    				break ; 

    			case 'year' :
    				d.properties.value = Math.round( (d.properties.value * 365) / 7 ) ;
    				break ; 

    			default : 
    				// console.log( d.properties.metric , d.properties.value ) ; 
    				break ; 
    		}
    	}
    	return d.properties.value ; 
	}



    