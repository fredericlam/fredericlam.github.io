

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

       	queue()
	       	.defer( d3.xml, "data/data.xml")
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

			// console.info( dataset ); 

			var sum = d3.sum( dataset , function(d){ return d.step }) ; 

			teamsets = d3.nest()
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

			teamsets.sort(function(a, b) { 
				if(a.key < b.key) return -1;
			    if(a.key > b.key) return 1;
			    return 0;
			});

			var pie_data = [] ; 

			var toPercent = d3.format("0.1%");

			for ( var t in teamsets )
			{
				var team = [] ;
				var total = d3.sum( teamsets[t].values , function(d){ return d.values.total ; }) 
				for ( var p in teamsets[t].values )
				{
					team.push({ 
						'team' : teamsets[t].key , 
						'step' : teamsets[t].values[p].values.total , 
						'id' : teamsets[t].values[p].key , 
						'user' : users[ teamsets[t].values[p].key ] , 
						'percent' : toPercent( teamsets[t].values[p].values.total / total ) 
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

	if ( team_name.length >= 45 )
		return team_name.substr(0,45) + '.' ; 

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