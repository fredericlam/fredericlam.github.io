	
	var width 	= 500;
	var height 	= 650;
	var scale0 = (width - 1) / 2 / Math.PI; 
	var provinces = [9,10,19,18,45,47] ;
	var div_datas = '#datas' ; 
	var cumul ; 

	var Populations = { 0 : 5312533.6 , 18 : 740620.4 , 19 : 409312.2 , 47 : 1695922.8 , 9 : 428134.2 , 45 : 884034 , 10 : 1154510 }
	var Cancers = [] ; 

	var projection = d3.geo.mercator()
	    .scale(8500)
	  	// Customize the projection to make the center of Thailand become the center of the map
	  	.rotate([-100, -18.4])
	  	.translate([width/1.7,height/2]);
	  
	var svg = d3.select("#map").append("svg")
	      .attr("width", width)
	      .attr("height", height);
	var path = d3.geo.path()
	      .projection(projection);
	  
	var json_file = 'general' ; // general , maskline_general

	var radius = d3.scale.sqrt()
            .domain([ 0, 100000 ])
            .range([ 0, 15 ]);



	d3.json( "data/regions.topojson", function(error, topology) {

	    var g_general = svg.append("g").attr('class','general') ;
	    g_general.selectAll("path")
	        .data(topojson.object(topology, topology.objects.thailand ).geometries)
	        .enter()
	        .append("path")
	        .attr("d", path)
	        .attr('class',function(d){ return 'province_'+d.properties.ID_1;})
	        .append("title").text(function(d){ return d.properties.NAME_1; })
	    ;


	    var label_regions = svg.selectAll(".place-label")
		    .data(topojson.object(topology, topology.objects.thailand ).geometries)
		  	.enter().append("text")
		    .attr("class", function(d) { return "subunit-label " + d.id; })
		    .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
		    .attr("dy", ".35em")
		    .text(function(d) { return d.properties.NAME_1; });

		svg.append("g")
            .selectAll("circle")
            .data( topojson.object(topology, topology.objects.thailand ).geometries )
            .enter().append("circle")
            .attr("class","bubble")
            .style('fill-opacity', '0.6')
            .style('stroke','#ffffff')
            .style('stroke-width','.5px')
            .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
            .attr("r",0) ; 

        d3.selectAll('.bubble').transition()
            .duration(1500)
            .attr('r',function(d){
                if ( $.inArray( d.properties.ID_1 , provinces ) != -1 ) return radius(  Populations[d.properties.ID_1] ) ; 
            })
        ; 
	});
	

	var datasets = { 'cumulative' : [] , 'pie' : [] } ; // by province
	var barcharts = [] , piecharts = [] ; 

	queue()
	    .defer( d3.csv , "data/cumulative.csv" )
	    .defer( d3.csv , "data/pie_bar.csv" )
	    .await(function(error, cumulative , pie ) { 
	    	
	    	// cumulative risk 
	    	for( var item in cumulative )
	    	{
	    		var cumul = cumulative[item] ; 

	    		if ( datasets.cumulative[ cumul.province ] == undefined ) 
	    			datasets.cumulative[ cumul.province ] = {
	    				'id'		: cumul.province , 
	    				'label' 	: cumul.province_label , 
	    				'cancers'	: [] , 
	    				'males'		: { 'key' : 'Males' , 'color' : '#810F7C'  , 'values' : [] } , 
	    				'females'	: { 'key' : 'Females' , 'color' : '#F781BF'  , 'values' : [] } 
	    			} ; 
	    		datasets.cumulative[ cumul.province ].cancers.push({
		    			'code' : cumul.cancer_code , 
		    			'label' : cumul.cancer_label , 
		    			'cum_risk1' : cumul.cum_risk1 , 
		    			'cum_risk2' : cumul.cum_risk2 , 
		    			'rank' : cumul.rank ,
		    			'tot_cum' : cumul.tot_cum 
	    			}
	    		) ;

	    		datasets.cumulative[ cumul.province ].males.values.push({
		    			'code' : cumul.cancer_code , 
		    			'label' : cumul.cancer_label , 
		    			'value' : -cumul.cum_risk1
	    			}
	    		) ; 
	    		datasets.cumulative[ cumul.province ].females.values.push({
		    			'code' : cumul.cancer_code , 
		    			'label' : cumul.cancer_label , 
		    			'value' : cumul.cum_risk2
	    			}
	    		) ; 
	    	}

	    	for( var item in pie )
	    	{
	    		var line = pie[item] ; 
	    		if ( Cancers[line.cancer_code] == undefined ) Cancers[line.cancer_code] = line.cancer_label ; 
	    			    		
	    		if ( datasets.pie[ line.province ] == undefined ) 
	    			datasets.pie[ line.province ] = {
	    				'id'		: line.province , 
	    				'label' 	: line.province_label , 
	    				'total'		: {} , 
	    				'males'		: { 'key' : 'Males' , 'color' : '#810F7C'  , 'values' : [] } , 
	    				'females'	: { 'key' : 'Females' , 'color' : '#F781BF'  , 'values' : [] } 
	    			} ; 

	    		var keySex = ( line.sex == 1 ) ? 'males' : 'females' ; 
	    		var obj = {
	    			'code' : line.cancer_code , 
	    			'label' : line.cancer_label , 
	    			'value' : Math.round(line.cases)
    			}; 

	    		if ( line.cancer_code == '0' )
	    			datasets.pie[ line.province ][ keySex ].total = obj ; 
	    		else
	    			datasets.pie[ line.province ][keySex].values.push( obj ); 
	    	}

	    	// default build
	    	// buildCumulative( datasets.cumulative ) ; 
	    	// buildPie( datasets.pie ) ; 
	    });

	/**
	* Build cumulative sections
	* @param (array) datasets cumulative risks
	* @return (bool)
	**/ 
	var buildCumulative = function( dataset ){	

		var that = this;

		// build the 7 line 
    	for ( var item in dataset )
    	{
    		cumul = dataset[item] ; 
    		$(div_datas).append('<div class="graph" id="cumulative_'+cumul.id+'"><h3>'+cumul.label+'</h3><svg></svg></div>') ; 
    		
    		cumul.males.values = cumul.males.values.slice(0,5) ; 
    		cumul.females.values = cumul.females.values.slice(0,5) ; 

    		// prepare dataset for each dual bar graph
    		var set = [ cumul.males , cumul.females ] ; 
    		
    		// build the graph
    		nv.addGraph( builNvd3Bars( '#cumulative_'+cumul.id , set) );
    	}
	}

	/**
	* Build cumulative sections
	* @param (string) div of svg with #
	* @param (array) dataset 
	* @return (bool)
	**/ 
	var builNvd3Bars = function( id_div , dataset ) {

	    var chart = nv.models.multiBarHorizontalChart()
	        .x(function(d) { return d.label })
	        .y(function(d) { return d.value })
	        .margin({top: 200, right: 20, bottom: 50, left: 100})
	        .showValues(false)         
	        // .stacked(true)
	        .showControls(false)
	    ;        
	    
	    // chart.xAxis.tickFormat(function(d){ return Math.round(d); });
	    chart.yAxis.tickFormat(function(d){
	    	var val = Math.abs(Math.round(d));
	    	val = val.toString();
          	return val.replace('-','');
          });

	    d3.select( id_div +' svg')
	        .datum(dataset)
	        .call(chart);

	    nv.utils.windowResize(chart.update);

	    barcharts[ id_div ] = chart ; 

	    return chart;
	}

	/**
	* Build cumulative sections
	* @param (array) datasets cumulative risks
	* @return (bool)
	**/ 
	var buildPie = function( dataset ){	

		var that = this;

		// build the 7 line 
    	for ( var item in dataset )
    	{
    		pie = dataset[item] ; 
    		$(div_datas).append('<div class="graph" id="pie_'+pie.id+'"><h3>'+pie.label+'</h3><svg></svg></div>') ; 
    		    		
    		// build the graph
    		nv.addGraph( builNvd3Pie( '#pie_'+pie.id , pie.males.values ) );
    	}
	}

	/**
	* Build cumulative sections
	* @param (string) div of svg with #
	* @param (array) dataset 
	* @return (bool)
	**/
	var builNvd3Pie = function( id_div , dataset ){
		 
	  	var chart = nv.models.pieChart()
	    	.x(function(d) { return d.label })
	      	.y(function(d) { return d.value })
	      	.showLabels(true)     //Display pie labels
	      	.labelType("percent")
	      	.labelThreshold(.05)  //Configure the minimum slice size for labels to show up
	      	.donut(true)          //Turn on Donut mode. Makes pie chart look tasty!
	      	.donutRatio(0.35)     //Configure how big you want the donut hole size to be.
	     ;

	    d3.select(id_div+" svg")
	        .datum(dataset)
	        .transition().duration(350)
	        .call(chart);

	    piecharts[ id_div ] = chart ; 

	  	return chart;
	}