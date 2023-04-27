        let map; // map instance variable
        let user_lat = 27.0844; //default coordinates
        let user_long = 93.6053;
        //to get user's current location, but only works in https doesn't work in http
        if(navigator.geolocation){navigator.geolocation.getCurrentPosition(function(pos){
            loadMap(pos.coords.latitude,pos.coords.longitude);
        }, function(err){
            console.log(err.message);//if error display default position
            loadMap(user_lat,user_long);
        }
        )}
        else{
            loadMap(user_lat,user_long);// if not able to get user's current position display default position
        }
        //function to initialize map
        function loadMap(lat,long){
           let user_lat = lat;
           let user_long = long;
           mapboxgl.accessToken = 'pk.eyJ1IjoiZ2ljaGlrdGF0dW0iLCJhIjoiY2xlazM2ZjJ3MDczMTNycXNob2xub3N3cCJ9.tDwsGaQ3aQBleQvctaqffQ';
            map = new mapboxgl.Map({
            container: 'map', // container ID
            style: 'mapbox://styles/mapbox/satellite-streets-v12', // style URL
            center: [user_long, user_lat], // starting position [lng, lat]
            zoom: 14, // starting zoom
            })
        }
        let trackerId; // this id is to stop the setInterval function
        let mp = false;// to remove if marker already exists
       
        async function initTracking(){
            // to remove if marker already exists
            if(mp){
                marker.remove();
            }
            //to make button unclickable/clickable
            document.getElementById("stop").disabled = false;
            document.getElementById("start").disabled = true;
            
            //row  as an array
            let row =  await fetchData();
            // console.log(row["lng"]);
            let lat = row["lat"];
            let long = row["lng"];
            let dt = row["dt"];
            //adds the marker to the map
            marker = new mapboxgl.Marker().setLngLat([long,lat]).addTo(map);
            mp = true;
            map.flyTo({
                center: [long,lat],
                speed : 0.5
            });
            showText(lat,long,dt);
             //updates the location every 10 seconds
            trackerId = setInterval(async() => {
                let row = await fetchData();
                let long =row["lng"];
                let lat = row["lat"];
                let dt = row["dt"];
                marker.setLngLat([long,lat]).addTo(map);
                map.setCenter([long,lat]);
                showText(lat,long,dt);
            }, 10000);
        }
        //async/await basically to stop the loading of script and wait for fetch() results
        async function fetchData(){
            try{
                let response = await fetch("process.php");
                let arr = await response.json();
                // console.log(arr);
                return arr;
            }
            catch(err){
                document.getElementById("info").innerHTML = err.message;
            }
        }
        
        async function fetchData1() {
            try {
                let response = await fetch("trail.php");
                let arr = await response.json();
                // console.log(arr);
                return arr;
            }
            catch (err) {
                document.getElementById("info").innerHTML = err.message;
            }
        }
        
        function stopTracking(){
            //stops setInterval function
            clearInterval(trackerId);
            document.getElementById("stop").disabled = true;
            document.getElementById("start").disabled = false;
        }
        function showText(lat,long,dt){
            let text = "latitude :"+ lat +"<br>"+"longitude :"+ long +"<br>"+"The bus was here at "+ dt;
            let element = document.getElementById("info");
            element.innerHTML = text; 
        }
        async function trail() {
            let row = await fetchData1();
            let l = row.length;
            
            //it needs to be inverted
            map.flyTo({
                center: row[l - 1],
                speed: 1
            });
            mrker(row);
            
            map.addSource('route', {
                'type': 'geojson',
                'data': {
                    'type': 'Feature',
                    'properties': {},
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': row
                    }
                }
            });
            map.addLayer({
                'id': 'route',
                'type': 'line',
                'source': 'route',
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                'paint': {
                    'line-color': '#FFFF00',
                    'line-width': 8
                }
            });
        }
        // trail marker
        function mrker(row) {

            // Add an image to use as a custom marker
            map.loadImage(
                'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
                (error, image) => {
                    if (error) throw error;
                    map.addImage('custom-marker', image);
                    // Add a GeoJSON source with 2 points
                    map.addSource('points', {
                        'type': 'geojson',
                        'data': {
                            'type': 'FeatureCollection',
                            'features': [
                                {
                                    // feature for Mapbox DC
                                    'type': 'Feature',
                                    'geometry': {
                                        'type': 'Point',
                                        'coordinates': row[0]
                                    },
                                    'properties': {
                                        'title': 'Starting Position'
                                    }
                                },
                                {
                                    // feature for Mapbox SF
                                    'type': 'Feature',
                                    'geometry': {
                                        'type': 'Point',
                                        'coordinates': row[row.length-1]
                                    },
                                    'properties': {
                                        'title': 'Current Position'
                                    }
                                }
                            ]
                        }
                    });

                    // Add a symbol layer
                    map.addLayer({
                        'id': 'points',
                        'type': 'symbol',
                        'source': 'points',
                        'layout': {
                            'icon-image': 'custom-marker',
                            // get the title name from the source's "title" property
                            'text-field': ['get', 'title'],
                            'text-font': [
                                'Open Sans Semibold',
                                'Arial Unicode MS Bold'
                            ],
                            'text-offset': [0, 1.25],
                            'text-anchor': 'top'
                        }
                    });
                }
            );
        }