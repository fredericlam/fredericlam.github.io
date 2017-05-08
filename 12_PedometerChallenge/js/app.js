

	var source = [] , dataset = [] , teamsets = [], players = [] , daily = [] , weekly = [] , users = [] ; 
	var y , x , tooltip ; 
	var total_pie = 0 ; 


	var myDay = new Date();
	var today = { 'day' : myDay.getUTCDate() , 'month' : myDay.getMonth() + 1  }
		
	var numDayToday = 0 ;

	var timelines = [
		{
			'name' : 'Week 1' , 
			'days' : [[13,3],[14,3],[15,3],[16,3],[17,3]]
		},
		{
			'name' : 'Week 2', 
			'days' : [[20,3],[21,3],[22,3],[23,3],[24,3]]
		},
		{
			'name' : 'Week 3', 
			'days' : [[27,3],[28,3],[29,3],[30,3],[31,3]]
		},
		{
			'name' : 'Week 4', 
			'days' : [[3,4],[4,4],[5,4],[6,4],[7,4]]
		}
	] ; 

	// console.info( timelines ); 

	$(document).ready( function(){

		var makeBaseAuth =  function(user, pswd){ 
	      var token = user + ':' + pswd;
	      var hash = "";
	      if (btoa) {
	         hash = btoa(token);
	      }
	      return "Basic " + hash;
	   	}

	   	$('[data-toggle="tooltip"]').tooltip() ; 

	   	// Weekds
	   	var cpt = 1 ; 

	   	for ( var i in timelines )
	   	{	
	   		var sub_days_html = '' ; 

	   		for( var j in timelines[i].days )
	   		{
	   			var day =  timelines[i].days[j] ; 

	   			if ( today.month == 3 )
	   			{
	   				var class_day 	= ( today.day > day[0] && today.month == (day[1]) ) ? 'active' : 'inactive' ; 
	   			}
	   			else
	   			{
	   				// var class_day 	= ( today.day > day[0] && today.month == (day[1]) ) ? 'active' : 'inactive' ; 
	   			}

	   			if( (today.day-1) == day[0] && today.month == (day[1])) 
	   			{
	   				var class_active = 'current' ;
	   				numDayToday = cpt ; 
	   			}
	   			else
	   			{
	   				var class_active = '' ;
	   			} 

	   			var col_offset 	= ( j == 0 ) ? 'col-md-offset-1' : '' ; 
	   			sub_days_html 	+= ' <div class="col-md-2 '+col_offset+'"><a href="javascript:void(0);" attr-day="'+cpt+'" attr-date-entry="'+day[0]+'-'+day[1]+'" class="day_stat '+class_day+' '+class_active+'">Day '+cpt+'</a></div>' ;
	   			cpt++ ; 
	   		}

	   		var week_html = '<div class="col-md-3"><h3>'+timelines[i].name+'</h3><div class="row">'+sub_days_html+'</div></div>' ;
	   		$('.weeks').append( week_html ) ; 
	   	}

        queue()
	       	.defer( d3.xml, "data/data.xml")
		    //.defer( d3.xml, "/data/users.xml")
		    //.defer( d3.xml, "/data/participants.xml")
		    .defer( d3.json , "data/users.json")

		    .await(function( error , xml_data , users_json ) {

		  	var x2js     		= new X2JS();

			var xmlString 		= (new XMLSerializer()).serializeToString(xml_data);
			var json  			= x2js.xml_str2json( xmlString );
			var source 			= json.feed.entry ;

			
			for ( var u in users_json ) 
				users[ users_json[u].ID ] = users_json[u].name ; 

			for ( var i in source )
			{
				var item = source[i] ; 				
				// console.info( item.content.properties.Date_x0020_of_x0020_measurement.__text ) ; 
				
				var the_day = new Date( item.content.properties.Date_x0020_of_x0020_measurement.__text ) ; 

				var row = {
					
					'src'  : item , 
					'link' : item.link[1].inline.entry ,

					'id'   : Math.round(item.link[1].inline.entry.content.properties.Id.__text) , 
					'team' : item.link[1].inline.entry.content.properties.Team.__text , 
					'week' : Math.round(item.content.properties.Week.__text.replace('Week #','')) , 
					'step' : Math.round( item.content.properties.Nb_x0020_steps.__text ) , 
					'date' : { 'day' : the_day.getUTCDate() , 'month' : the_day.getMonth() + 1  } ,
					'date_entry' : the_day.getUTCDate() +'-'+ ( the_day.getMonth() + 1 ) , 	
					'timestamp' : item.content.properties.Date_x0020_of_x0020_measurement.__text	
				} ;

				// console.info( the_day.getUTCDate() , the_day.getMonth() + 1 ) ; 

				dataset.push( row ) ;  
				
				// break ; 
			}

			// console.info( dataset ); 

			var sum = d3.sum( dataset , function(d){ return d.step }) ; 

			teamsets = d3.nest()
				.key(function(d){ return d.team })
				.rollup(function(team) { 
					return {
						"length": team.length, 
						"total": d3.sum(team, function(d) {
							return parseFloat(d.step);
						}),
						"team" : team 
					} 
				})
				.entries( dataset ) ;


			var teamsets_weeks = d3.nest()
				.key(function(d){ return d.week })
				.key(function(d){ return d.team; })
	   			.rollup(function(player) { 
					return {
						"length": player.length, 
						"team" : player[0].team, 
						"total": d3.sum(player, function(d) {
							return parseFloat(d.step);
						})
					} 
				})
				.entries( dataset ) ;

			var data_pie_multi = [] ; 

			for ( var tw in teamsets_weeks )
			{
				var week = { key : 'Week '+(Math.abs(tw)+1) , 'values' : [] } ; 
				var values = [] ; 

				for ( var row in teamsets_weeks[tw].values )
				{
					week.values.push( {
						'label' : teamsets_weeks[tw].values[row].values.team , 
						'value' : teamsets_weeks[tw].values[row].values.total 
					} ) ; 
				}

				data_pie_multi.push( week ) ; 
			}

			console.info( data_pie_multi ) ; 

			nv.addGraph(function() {
			    var chart = nv.models.multiBarHorizontalChart()
			    	.height(800)
			        .x(function(d) { return d.label })
			        .y(function(d) { return d.value })
			        .margin({top: 30, right: 20, bottom: 20, left: 200})
			        .showValues(true)           //Show bar value next to each bar.
			        //.tooltips(true)             //Show tooltips on hover.
			        //.transitionDuration(350)
			        .stacked(true)
			        .showControls(true);        //Allow user to switch between "Grouped" and "Stacked" mode.

			    chart.yAxis
			        .tickFormat(d3.format("s"));

			    d3.select('#multibars svg')
			        .datum(data_pie_multi)
			        .call(chart);

			    nv.utils.windowResize(chart.update);

			    return chart;
			  });

			var teamsets_pie = d3.nest()
				.key(function(d){ return d.team })
				.key(function(d){ return d.id; })
	   			.rollup(function(player) { 
					return {
						"length": player.length, 
						"src" : player , 
						"total": d3.sum(player, function(d) {
							return parseFloat(d.step);
						})
					} 
				})
				.entries( dataset ) ;

			// console.info( teamsets ) ; 

			teamsets_pie.sort(function(a, b) { 
				if(a.key < b.key) return -1;
			    if(a.key > b.key) return 1;
			    return 0;
			});

			var pie_data = [] ; 

			var toPercent = d3.format("0.1%");

			for ( var t in teamsets_pie )
			{
				var team = [] ;
				var total = d3.sum( teamsets_pie[t].values , function(d){ return d.values.total ; }) 
				for ( var p in teamsets_pie[t].values )
				{
					team.push({ 
						'team' : teamsets_pie[t].key , 
						'step' : teamsets_pie[t].values[p].values.total , 
						'id' : teamsets_pie[t].values[p].key , 
						'user' : users[ teamsets_pie[t].values[p].key ] , 
						'percent' : toPercent( teamsets_pie[t].values[p].values.total / total ) 
					})
				}

				team.sort(function(a, b) { 
					if(a.user < b.user) return -1;
				    if(a.user > b.user) return 1;
				    return 0;
				});

				pie_data.push( team ) ; 
			}

			// Define the margin, radius, and color scale. The color scale will be
			// assigned by index, but if you define your data using objects, you could pass
			// in a named field from the data object instead, such as `d.name`. Colors
			// are assigned lazily, so if you want deterministic behavior, define a domain
			// for the color scale.
			var m = 40,
			    r = 75 ,
			    z = d3.scale.category10();

			// z = colorbrewer['Set1'][6] ; 

			// Insert an svg element (with margin) for each row in our dataset. A child g
			// element translates the origin to the pie center.
			d3.select("body #proportions_pie").html(" ");

			var svg_pies = d3.select("body #proportions_pie").selectAll("svg")
			    .data( pie_data )
			  	.enter().append("svg")
			  	.attr("id",function(d,i){ return "svg-"+i; })
			    .attr("width", ( (r + m) * 2 ) + 123 )
			    .attr("height", (r + m) * 2)
			  	.append("g")
			    .attr("transform", "translate(" + (r + m) + "," + (r + m) + ")")
			
			svg_pies
				.append("text")
			    .attr("transform", "translate(50," + -((r + m)-15) + ")")
			    .attr("text-anchor","middle")
			    .attr("class","title-pie")
			    .style("font-size","16px")
			    .style("font-weight","bold")
			    .text(function(d){ return formatTeam(d[0].team) ; })
			;

			svg_pies
				.append("text")
			    .attr("transform", "translate(50," + -((r + m)-30) + ")")
			    .attr("text-anchor","middle")
			    .attr("class","title-pie")
			    .style("font-size","13px")
			    .text(function(d){ 
			    	var total = formatNum( d3.sum( d , function(i){ return i.step ; }) ) ; 
			    	return total+" steps" ; 
			    })
			;

			// The data for each svg element is a row of numbers (an array). We pass that to
			// d3.layout.pie to compute the angles for each arc. These start and end angles
			// are passed to d3.svg.arc to draw arcs! Note that the arc radius is specified
			// on the arc, not the layout.
			svg_pies.selectAll("path")
			    .data( d3.layout.pie().value( function(d){ return d.step ; }) )
			  	.enter().append("path")
			  	.attr('class','pie')
			  	.attr("data-legend",function(d) { return d.data.user + " ("+d.data.percent+')'; })
			    .attr("d", d3.svg.arc()
			    .innerRadius(r / 2)
			    .outerRadius(r))
			    .attr("fill-opacity",0.7)
			    .style("fill", function(d, i) { return z(i); })
			  ;

			 var padding = 20,
			    legend = svg_pies.append("g")
			    .attr("class", "legend")
			    .attr("transform", "translate(" + (r+20) + ", 0)")
			    .style("font-size", "11px")
			    .call(d3.legend);

			var participants_total = d3.nest()
				.key(function(d){ return d.id })
				.rollup(function(team) { 
					return {
						"name" : users[team.id] , 
						"length": team.length, 
						"team" : team 
					} 
				})
				.entries( dataset ) ;
			participants_total.sort(function(a, b) { return b.values.length - a.values.length; });

			/*var p_tot = [] ; 
			for ( var p in participants_total )
			{
				console.info( users[ participants_total[p].key ] , participants_total[p].values.length ) ; 
			}*/


			players  = d3.nest()
				.key(function(d){ return d.id })
				.entries( dataset ) ;

			var time_day = daily = d3.nest()
				.key(function(d){ return d.timestamp ; })
				.entries( dataset ) ; 

			daily = d3.nest()
				.key(function(d){ return d.date_entry ; })
				.entries( dataset ) ; 

			$('a.day_stat[attr-day="1"]').trigger('click');

			$("#total_steps span").prop('Counter', 0 ).animate({
				Counter: sum
			}, {
				duration: 5000 ,
				easing: 'linear',
				step: function (now) {
				    $(this).text( formatNum( Math.ceil(now) ) ) ;
				}
			});

			var width = ( $(window).width() - 50 )  ;

			var m = [30, 10, 10, 230],
			    w = width - m[1] - m[3],
			    h = 800 - m[0] - m[2];

			var format = d3.format(",.0f");

			x = d3.scale.linear().range([0, w]) ; 
			y = d3.scale.ordinal().rangeRoundBands([0, h], .1);

			var xAxis = d3.svg.axis().scale(x).orient("top").tickSize(-h).tickFormat( d3.format(".2s") ),
			    yAxis = d3.svg.axis().scale(y).orient("left").tickSize(0);

			var svg = d3.select("body #bars").append("svg")
			    .attr("width", w + m[1] + m[3])
			    .attr("height", h + m[0] + m[2])
			  	.append("g")
			    .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

			// Parse numbers, and sort by value.
			//teamsets.forEach(function(d) { d.values.total = +d.values.total; });
			teamsets.sort(function(a, b) { return b.values.total - a.values.total; });

			var rank = function(i){
				i++ ; 
				if(i == 1) return '1st: ' ; 
				if(i == 2) return '2nd: ' ; 
				if(i == 3) return '3rd: ' ; 
				return i+'th: '; 
			}

			// Set the scale domain.
			x.domain([0, d3.max(teamsets, function(d) { return d.values.total; })]);
			y.domain(teamsets.map(function(d,i) { return rank(i)+d.key; }));

			tooltip = d3.select('body')            
	          .append('div')                             
	          .attr('class', 'tooltip_pedo');                 
	        ;  

			var bar = svg.selectAll("g.bar")
			  	.data(teamsets)
			  	.enter().append("g")
			  	.attr("class", "bar")
			  	.attr("transform", function(d,i) { return "translate(0," + y(rank(i)+d.key) + ")"; })
			  	.on("mousemove", function(d){

			  		var mousePos = getMousePos();

			  		var team_values = d3.nest()
			  			.key(function(d){ return d.id; })
			  			.rollup(function(team) { 
							return {
								"length": team.length, 
								"total": d3.sum(team, function(d) {
									return parseFloat(d.step);
								})
							} 
						})
			  			.entries( d.values.team ) ; 

	                team_values.sort(function(a, b) { return b.values.total - a.values.total; });

	                tooltip.style('display', 'block');
	                tooltip.html(" ");

	                tooltip.append("h5").text(d.key) ;
	                var table = tooltip.append("table").attr('class','table_bars').attr('border',1).attr('border-collapse','collapse');
	                var table_inside = '' ; 

	                for ( var t in team_values )
	                {
	                	table_inside += "<tr><td align='right'>"+users[team_values[t].key]+"</td><td align='right'>"+formatNum(team_values[t].values.total)+"</td></tr>" ;
	                }

	                $('.tooltip_pedo table').append("<tr><td align='right'>Participant</td><td align='right'>Total steps</td></tr>" + table_inside ) ;


	                tooltip
	                	.style('left', (mousePos.x ) + 'px')
	                	.style('top', (mousePos.y + 20 ) + 'px');

		        })
		        // mouseout function            
		        .on("mouseout", function(d){

		            document.body.style.cursor = 'auto';
		            tooltip.style('display','none');
		            d3.select(this).style('fill-opacity',1) ; 

		        })    
			;

			bar.append("rect")
			  .attr("width", function(d) { return x(d.values.total); })
			  .attr("height", y.rangeBand());

			bar.append("text")
			  .attr("class", "value")
			  .attr("x", function(d) { return x(d.values.total); })
			  .attr("y", y.rangeBand() / 2)
			  .attr("dx", -3)
			  .attr("dy", ".35em")
			  .attr("text-anchor", "end")
			  .text( function(d,i) { return formatNum(d.values.total); });

			svg.append("g")
			  .attr("class", "x axis")
			  .call(xAxis);

			svg.append("g")
			  .attr("class", "y axis")
			  .call(yAxis);

			// ranking / progression 
			// Set the dimensions of the canvas / graph
			var margin = {top: 30, right: 20, bottom: 30, left: 50},
			    width_line = width - margin.left - margin.right,
			    height = 270 - margin.top - margin.bottom;

			// Parse the date / time
			var parseDate = d3.time.format("%b %Y").parse;

			// Set the ranges
			var x = d3.time.scale().range([0, width_line]);
			var y = d3.scale.linear().range([height, 0]);

			// Define the axes
			var xAxis = d3.svg.axis().scale(x)
			    .orient("bottom").ticks(5);

			var yAxis = d3.svg.axis().scale(y)
			    .orient("left").ticks(5);

			// Define the line
			var priceline = d3.svg.line()	
			    .x(function(d) { return x(d.date); })
			    .y(function(d) { return y(d.price); });
			    
			// Adds the svg canvas
			var svg_lines = d3.select("body #lines")
			    .append("svg")
			        .attr("width", width_line + margin.left + margin.right)
			        .attr("height", height + margin.top + margin.bottom)
			    	.append("g")
			        .attr("transform", 
			              "translate(" + margin.left + "," + margin.top + ")");

		});

	}) ; 

function getMousePos(){
	var mousePos ; 

	event = event || window.event; // IE-ism
    if (event.pageX == null && event.clientX != null) {
        eventDoc = (event.target && event.target.ownerDocument) || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;

        event.pageX = event.clientX +
          (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
          (doc && doc.clientLeft || body && body.clientLeft || 0);
        event.pageY = event.clientY +
          (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
          (doc && doc.clientTop  || body && body.clientTop  || 0 );
    }

    return mousePos = {
        x: event.pageX,
        y: event.pageY
    };
}
function sortTeams(type){

	switch( type )
	{
		case "step" : 
			teamsets.sort(function(a, b) { return b.values.total - a.values.total; });
			break ; 
		case "team" : 
			teamsets.sort(function(a, b) { 
				if(a.key < b.key) return -1;
			    if(a.key > b.key) return 1;
			    return 0;
			});
			break ; 
	}

	var bars = d3.selectAll("g.bar")
	  .data(teamsets) ; 

	bars
	  .transition()
	  .duration(750)
	  .attr("transform", function(d) { console.info(d.key,y(d.key)); return "translate(0," + y(d.key) + ")"; });
	
	bars.transition()
	  .duration(300)
	  .attr("x", function(d) { return x(d.values.total); })
	  .attr("y", y.rangeBand() / 2) ;

}

function formatTeam( team_name )
{
	if ( team_name == undefined ) return ""; 

	if ( team_name.length >= 10 )
		return team_name.substr(0,10) + '.' ; 

	return team_name ; 
}

function clone(obj){
    try{
        var copy = JSON.parse(JSON.stringify(obj));
    } catch(ex){
      
    }
    return copy;
}

function formatNum( val )
{	
	if ( val == undefined ) 
		return "[error]"; 
	else
	{		
		if ( typeof( VAL_ROUNDED ) != 'undefined' ) 
		{
			if ( Math.abs( val ) == 0 ) return 0 ; 
			
			if ( VAL_ROUNDED != undefined && VAL_ROUNDED == true )
			{
				// val rounded 
				val 	= Math.round( val ) ; 
			    
			    var ln 	= val.toString().length ; 

			    if ( ln > 2 )
			    {
				    var first_number = 2 ; 

				    // divide number into 2 sub values
				    var first = val.toString().substr( 0 , first_number ) ;
				    var last  = val.toString().substr( first_number, ln ) ;
				    var first_rounded = last.substr( 0 , 1 ) ; 

				    var end_of_number = 0 ; 
				    for ( var j = 0 ; j < (last.length-1) ; j++ ) end_of_number += '0'; 

				    // if first number rounded is upper to 5, then the 2 first number ar 
				    if ( first_rounded >= 5 ) first++ ; 

				    val = first.toString() + end_of_number.toString() ; 

				    // console.info( val , last.length , first , end_of_number ); 

				}
				else
				{
					 
				}
			}
		}
		
		return val.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1\xa0") ; 
	}
}