

	var source = [] , dataset = [] , teamsets = [], players = [] , daily = [] , weekly = [] , users = [] ; 
	var y , x ; 

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
	   			var class_day 	= ( today.day > day[0] && today.month == (day[1]) ) ? 'active' : 'inactive' ; 

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
	   			sub_days_html 	+= ' <div class="col-md-2 '+col_offset+'"><a href="javascript:void(0);" attr-day="'+cpt+'" class="day_stat '+class_day+' '+class_active+'">Day '+cpt+'</a></div>' ;
	   			cpt++ ; 
	   		}

	   		var week_html = '<div class="col-md-3"><h3>'+timelines[i].name+'</h3><div class="row">'+sub_days_html+'</div></div>' ;
	   		$('.weeks').append( week_html ) ; 
	   	}


	   	$('#daily_stat').html('Statistics on '+today.day+'/0'+today.month) ;

	   	$('a.day_stat').click( function(){

	   		if ( $(this).hasClass('inactive') == true ) return ; 

	   		$('a.day_stat').removeClass('current') ; 
	   		$(this).addClass('current') ;

	   		var num_day = $(this).attr('attr-day') ; 
	   		var dataset = daily[num_day-1] ; 

	   		var d = dataset.key.split('-') ; 

	   		$('#daily_stat').html('Statistics on '+d[0]+'/0'+d[1]) ;

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
			daily_team = daily_team.slice(0,10); 

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
						"total": d3.sum(team, function(d) {
							return parseFloat(d.step);
						})
					} 
				})
				.entries( dataset.values ) ;

			daily_participants.sort(function(a, b) { return b.values.total - a.values.total; });
			daily_participants = daily_participants.slice(0,10); 

			$('#top_participant_svg table').html('<thead><th>Position</th><th>Participant</th><th>Entries</th><th>Steps</th></thead>');
			for ( var t in daily_participants )
			{
				$('#top_participant_svg table').append('<tr><td>'+(Math.abs(t)+1)+'</td><td>'+users[daily_participants[t].key].title+'</td><td>'+daily_participants[t].values.length+'</td><td>'+formatNum(daily_participants[t].values.total)+'</td></tr>') ;
			}

			// multiple pie charts
			var pie_data = [
			  [ 11975,  5871, 8916, 2868],
			  [ 1951, 10048, 2060, 6171],
			  [ 8010, 16145, 8090, 8045],
			  [ 1013,   990,  940, 6907]
			];

			// Define the margin, radius, and color scale. The color scale will be
			// assigned by index, but if you define your data using objects, you could pass
			// in a named field from the data object instead, such as `d.name`. Colors
			// are assigned lazily, so if you want deterministic behavior, define a domain
			// for the color scale.
			var m = 10,
			    r = 25,
			    z = d3.scale.category20c();

			// Insert an svg element (with margin) for each row in our dataset. A child g
			// element translates the origin to the pie center.
			var svg = d3.select("body #proportions_pie").selectAll("svg")
			    .data( pie_data )
			  	.enter().append("svg")
			    .attr("width", (r + m) * 2)
			    .attr("height", (r + m) * 2)
			  	.append("g")
			    .attr("transform", "translate(" + (r + m) + "," + (r + m) + ")");

			// The data for each svg element is a row of numbers (an array). We pass that to
			// d3.layout.pie to compute the angles for each arc. These start and end angles
			// are passed to d3.svg.arc to draw arcs! Note that the arc radius is specified
			// on the arc, not the layout.
			svg.selectAll("path")
			    .data(d3.layout.pie())
			  	.enter().append("path")
			  	.attr('class','pie')
			    .attr("d", d3.svg.arc()
			    .innerRadius(r / 2)
			    .outerRadius(r))
			    .style("fill", function(d, i) { return z(i); });

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
	       	.defer( d3.xml, "/data/data.xml")
		    .defer( d3.xml, "/data/users.xml")
		    .defer( d3.xml, "/data/participants.xml")
		    //.defer( d3.xml, "/data/participants_list.xml")

		    .await(function( error , xml_data , xml_users , xml_participants ) {

		  	var x2js     		= new X2JS();

			var xmlString 		= (new XMLSerializer()).serializeToString(xml_data);
			var json  			= x2js.xml_str2json( xmlString );
			var source 			= json.feed.entry ;

			var xmlString_u 	= (new XMLSerializer()).serializeToString(xml_users);
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
			}

			console.info( source ) ;  

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
					'date_entry' : the_day.getUTCDate() +'-'+ ( the_day.getMonth() + 1 )
				
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

			players  = d3.nest()
				.key(function(d){ return d.id })
				.entries( dataset ) ;

			daily = d3.nest()
				.key(function(d){ return d.date_entry ; })
				.entries( dataset ) ; 

			// console.info( teamsets ) ; console.info( daily ) ; 

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

			var bar = svg.selectAll("g.bar")
			  .data(teamsets)
			.enter().append("g")
			  .attr("class", "bar")
			  .attr("transform", function(d,i) { return "translate(0," + y(rank(i)+d.key) + ")"; });

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
			  //.attr("transform","translate(-150,0)")
			  .call(yAxis)
			  /*.selectAll("text")
    		  .attr("x", 6)
              .style("text-anchor", "start")*/
			;


		});

	}) ; 

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