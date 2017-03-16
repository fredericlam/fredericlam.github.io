	

	var source = [] , dataset = [] , teamsets = [] ; 
	var y , x ; 

	var myDay = new Date();
	var today = { 'day' : myDay.getUTCDate() , 'month' : myDay.getMonth() + 1  }
	

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
	   			var col_offset 	= ( j == 0 ) ? 'col-md-offset-1' : '' ; 
	   			sub_days_html 	+= ' <div class="col-md-2 '+col_offset+'"><span class="'+class_day+'">Day '+cpt+'</span></div>' ;
	   			cpt++ ; 
	   		}

	   		var week_html = '<div class="col-md-3"><h3>'+timelines[i].name+'</h3><div class="row">'+sub_days_html+'</div></div>' ;
	   		$('.weeks').append( week_html ) ; 
	   	}

		$.ajax({
         
          url		: "http://intra.iarc.fr/vie-pratique/healthandsafety/_api/lists('%7B1adfaedf-0985-473d-bac0-a435aa0ca88f%7D')/items?$select=Participant/Id,Participant/Team,Week,Nb_x0020_steps&$expand=Participant&$top=10000",
          url 		: "/data/data.xml" , 
          headers	: { "Accept": "application/json; odata=verbose" },
          beforeSend: function (xhr) {
          	xhr.setRequestHeader("Authorization", "Basic username:password in encode form");
          },
          type 		: "GET" 

        }).done( function( xml ) {
		  
			var xmlString = (new XMLSerializer()).serializeToString(xml);
			var x2js      = new X2JS();
			var json  	= x2js.xml_str2json( xmlString );

			var source = json.feed.entry ;

			

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
					'date' : { 'day' : the_day.getUTCDate() , 'month' : the_day.getMonth() + 1  }
				
				} ;

				dataset.push( row ) ;  
				
				// break ; 

			}

			console.info( dataset ) ; 

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


			$("#total_steps span").prop('Counter', 0 ).animate({
				Counter: sum
			}, {
				duration: 5000 ,
				easing: 'linear',
				step: function (now) {
				    $(this).text( formatNum( Math.ceil(now) ) ) ;
				}
			});

			var m = [30, 10, 10, 180],
			    w = 1480 - m[1] - m[3],
			    h = 930 - m[0] - m[2];

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

			// Set the scale domain.
			x.domain([0, d3.max(teamsets, function(d) { return d.values.total; })]);
			y.domain(teamsets.map(function(d) { return d.key; }));

			var bar = svg.selectAll("g.bar")
			  .data(teamsets)
			.enter().append("g")
			  .attr("class", "bar")
			  .attr("transform", function(d,i) { return "translate(0," + y(d.key) + ")"; });

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
			  .text( function(d) { return formatNum(d.values.total); });

			svg.append("g")
			  .attr("class", "x axis")
			  .call(xAxis);

			svg.append("g")
			  .attr("class", "y axis")
			  .call(yAxis);


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