mapboxgl.accessToken = mapToken;
        const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/streets-v11', // style URL
        center: room.geometry.coordinates, // starting position [lng, lat]
        zoom: 11 // starting zoom
        });

     const marker1 = new mapboxgl.Marker()
        .setLngLat(room.geometry.coordinates)
        .setPopup(
            new mapboxgl.Popup({offset:25})
                         .setHTML(
                             `<h4>${room.title}</h4><p>${room.location}</p>`
                         )
        )
        .addTo(map);
        map.addControl(new mapboxgl.NavigationControl())