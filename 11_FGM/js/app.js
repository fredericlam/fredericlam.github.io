    
    var width   = 900;
    var height  = 750;
    var scale0 = (width - 1) / 2 / Math.PI; 
    var div_datas = '#datas' ; 
    var cumul ; 

    var projection = d3.geoMercator() 
        .center([2.454071, 46.279229])
        .scale(500)
        .translate([width / 3, -50]);
      
    var svg = d3.select("#map").append("svg")
          .attr("width", width)
          .attr("height", height);

    var path = d3.geoPath( projection ) ;
      
    var json_file = 'general' ; // general , maskline_general

    var deps = svg
        .append("g")
        .attr("id", "fgm_map" )
    ;

    d3.queue()
        .defer( d3.request , "data/map.geojson" )
        .defer( d3.request , "data/daughter-prevalence.csv" )
        .defer( d3.request , "data/women-prevalence.csv" )
        .defer( d3.request , "data/women-attitudes.csv" )
        .await( function( error, geojson , daughter_prevalence , women_prevalence , women_attitudes ) {

            if (error) throw error ;

            console.log( geojson );
            console.log( daughter_prevalence );
            console.log( women_prevalence );
            console.log( women_attitudes );
        }
    );

    d3.json( "data/map.geojson", function(error, geojson) {

        console.info( geojson.features );
        /*
         * On "bind" un élément SVG path pour chaque entrée
         * du tableau features de notre objet geojson
         */
        var features = deps
                .selectAll("path")
                    .data( geojson.features );

        /*
         * On créait un ColorScale, qui va nous
         * permettre d'assigner plus tard une
         * couleur de fond à chacun de nos
         * départements
         */
        // var colorScale = d3.scale.category20c();

        /*
         * Pour chaque entrée du tableau feature, on
         * créait un élément SVG path, avec les
         * propriétés suivantes
         */
        features.enter()
            .append("path")
                .attr('class', 'item')
                .attr('fill', function(d) { 
                    // console.log( d ) ; 
                    return '#ccc'
                })
              .attr("d", path) ; 

    });