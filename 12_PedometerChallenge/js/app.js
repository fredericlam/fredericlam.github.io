

	var source = [] , dataset = [] , teamsets = [], players = [] , daily = [] , weekly = [] , users = [] ; 
	var y , x , tooltip ; 
	var total_pie = 0 ; 


	var myDay = new Date();
	var today = { 'day' : myDay.getUTCDate() , 'month' : myDay.getMonth() + 1  }
		
	var numDayToday = 0 ;

	var timelines = [
		{
			'name' : 'Week 1' , 
			'days' : [[12,3],[13,3],[14,3],[15,3],[16,3]]
		},
		{
			'name' : 'Week 2', 
			'days' : [[19,3],[20,3],[21,3],[22,3],[23,3]]
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


	   	$('#daily_stat').html('Statistics the '+(today.day-1)+'/0'+today.month) ;

	   	$('a.day_stat').click( function(){

	   		if ( $(this).hasClass('inactive') == true ) return ; 

	   		$('a.day_stat').removeClass('current') ; 
	   		$(this).addClass('current') ;

	   		var num_day = $(this).attr('attr-day') ; 
	   		var the_date = $(this).attr('attr-date-entry') ; 

	   		// console.info( num_day-1 , daily ) ; 
	   		// var dataset = daily[num_day-1] ; 

	   		for ( var d in daily )
	   		{
	   			if( daily[d].key == the_date )
	   			{
	   				//console.info( daily[d] );
	   				var dataset = daily[d] ; 
	   				break ; 
	   			}
	   		}

	   		var d = dataset.key.split('-') ; 

	   		$('#daily_stat').html('Statistics the '+(Math.abs(d[0])+1)+'/0'+d[1]) ;

	   		// top 10 team
	   		var daily_team = d3.nest()
	   			.key(function(d){ return d.team; })
	   			.rollup(function(team) { 
					return {
						"length": team.length, 
						"total": d3.sum(team, function(d) {
							return parseFloat(d.step);
						})
					} 
				})
				.entries( dataset.values ) ;
			daily_team.sort(function(a, b) { return b.values.total - a.values.total; });
			// daily_team = daily_team.slice(0,10); 

			var total_team = d3.nest()
	   			.key(function(d){ return d.team; })
	   			.rollup(function(team) { 
					return {
						"length": team.length, 
						"src" : team , 
						"total": d3.sum(team, function(d) {
							return parseFloat(d.step);
						})
					} 
				})
				.entries( dataset.values ) ; ; 
			total_team.sort(function(a, b) { return b.values.total - a.values.total; });

			$('#top_team_svg table').html('<thead><th>Position</th><th>Team</th><th>Entries</th><th>Steps</th></thead>');
			for ( var t in daily_team )
			{
				$('#top_team_svg table').append('<tr><td>'+(Math.abs(t)+1)+'</td><td>'+daily_team[t].key+'</td><td>'+daily_team[t].values.length+'</td><td>'+formatNum(daily_team[t].values.total)+'</td></tr>') ;
			}

			// top 10 participants
	   		var daily_participants = d3.nest()
	   			.key(function(d){ return d.id; })
	   			.rollup(function(team) { 
					return {
						"length": team.length, 
						"team": team[0].team , 
						"total" : parseFloat(team[0].step)
					} 
				})
				.entries( dataset.values ) ;

			daily_participants.sort(function(a, b) { return b.values.total - a.values.total; });
			daily_participants = daily_participants.slice(0,10); 

			// console.info( users );
			$('#top_participant_svg table').html('<thead><th>Position</th><th>Participant</th><th>Steps</th></thead>');
			for ( var t in daily_participants )
			{
				$('#top_participant_svg table').append('<tr><td>'+(Math.abs(t)+1)+'</td><td>'+users[daily_participants[t].key]+' ('+daily_participants[t].values.team+')</td><td>'+formatNum(daily_participants[t].values.total)+'</td></tr>') ;
			}

			// multiple pie charts
			var pie_data = [] ;
			total_pie = 0 ; 
			for ( var t in total_team )
			{
				pie_data.push( total_team[t].values.src ) ;
			}

			// Define the margin, radius, and color scale. The color scale will be
			// assigned by index, but if you define your data using objects, you could pass
			// in a named field from the data object instead, such as `d.name`. Colors
			// are assigned lazily, so if you want deterministic behavior, define a domain
			// for the color scale.
			var m = 10,
			    r = 45,
			    z = d3.scale.category10();

			// z = colorbrewer['Set1'][6] ; 

			// Insert an svg element (with margin) for each row in our dataset. A child g
			// element translates the origin to the pie center.
			d3.select("body #proportions_pie").html(" ");

			var svg_pies = d3.select("body #proportions_pie").selectAll("svg")
			    .data( pie_data )
			  	.enter().append("svg")
			    .attr("width", ( (r + m) * 2 ) )
			    .attr("height", (r + m) * 2)
			  	.append("g")
			    .attr("transform", "translate(" + (r + m) + "," + (r + m) + ")")
			
			svg_pies
				.append("text")
			    .attr("transform", "translate(0," + (r + m) + ")")
			    .attr("text-anchor","middle")
			    .attr("class","title-pie")
			    .text(function(d){ return formatTeam(d[0].team) ; })
			;

			// The data for each svg element is a row of numbers (an array). We pass that to
			// d3.layout.pie to compute the angles for each arc. These start and end angles
			// are passed to d3.svg.arc to draw arcs! Note that the arc radius is specified
			// on the arc, not the layout.
			svg_pies.selectAll("path")
			    .data( d3.layout.pie().value(function(d){ return d.step ; }) )
			  	.enter().append("path")
			  	.attr('class','pie')
			    .attr("d", d3.svg.arc()
			    .innerRadius(r / 2)
			    .outerRadius(r))
			    .attr("fill-opacity",0.7)
			    .style("fill", function(d, i) { return z(i); })
			    .on("mousemove", function(d){

			  		var mousePos = getMousePos();

			  		// console.info(d , (100 * d.value) , total_pie );

	                tooltip.style('display', 'block');
	                tooltip.html(" ");
	                tooltip.append("div").attr('class','tooltip_pie');

	                var html = '<h5>'+users[d.data.id]+'</h5><p><span> '+formatNum( d.value )+' steps </span></p>' ;

	                $('div.tooltip_pie').append( html ) ; 


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


			
	   	});


		/*$.ajax({
         
          // url		: "http://intra.iarc.fr/vie-pratique/healthandsafety/_api/lists('%7B1adfaedf-0985-473d-bac0-a435aa0ca88f%7D')/items?$select=Participant/Id,Participant/Team,Week,Nb_x0020_steps&$expand=Participant&$top=10000",
          url 		: "/data/data.xml" , 
          headers	: { "Accept": "application/json; odata=verbose" },
          beforeSend: function (xhr) {
          	xhr.setRequestHeader("Authorization", "Basic username:password in encode form");
          },
          type 		: "GET" 

        }).done( function( xml ) {*/

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

			/*var xmlString_u 	= (new XMLSerializer()).serializeToString(xml_users);
			var json_u  		= x2js.xml_str2json( xmlString_u );
			var source_users 	= json_u.feed.entry ; 
			for ( var u in source_users )
			{
				var user 	= source_users[u] ; 
				var user_id = Math.abs( user.content.properties.Id.__text ) ; 

				var row 	= {
					'id' : user_id , 
					'title' : user.content.properties.Title.__text
				} ; 

				users[ user_id ] = row  ; 
			}*/

			
			for ( var u in users_json ) 
				users[ users_json[u].ID ] = users_json[u].name ; 

			for ( var i in source )
			{
				var item = source[i] ; 
				
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

				dataset.push( row ) ;  
				
				// break ; 
			}

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

			var teamsets_lines = d3.nest()
				.key(function(d){ return d.team })
				.key(function(d){ return d.date_entry })
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

			// for each team, each day, calculate

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

			// Get the data
			d3.csv("data/stocks.csv", function(error, data) {

			    data.forEach(function(d) {
					d.date = parseDate(d.date);
					d.price = +d.price;
			    });

			    // Scale the range of the data
			    x.domain(d3.extent(data, function(d) { return d.date; }));
			    y.domain([0, d3.max(data, function(d) { return d.price; })]);

			    // Nest the entries by symbol
			    var dataNest = d3.nest()
			        .key(function(d) {return d.symbol;})
			        .entries(data);

			    var color = d3.scale.category20b();  // set the colour scale

			    // Loop through each symbol / key
			    dataNest.forEach(function(d) {

			        svg_lines.append("path")
			            .attr("class", "line")
			            .style("stroke", function() { // Add dynamically
			                return d.color = color(d.key); })
			            .attr("d", priceline(d.values));

			    });

			    // Add the X Axis
			    svg_lines.append("g")
			        .attr("class", "x axis")
			        .attr("transform", "translate(0," + height + ")")
			        .call(xAxis);

			    // Add the Y Axis
			    svg_lines.append("g")
			        .attr("class", "y axis")
			        .call(yAxis);

			});

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