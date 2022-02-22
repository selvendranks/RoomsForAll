mapboxgl.accessToken = mapToken;
const coordinates = document.getElementById('coordinates');
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [parseFloat(long), parseFloat(lat)],
    zoom: 4,
});

const marker = new mapboxgl.Marker({
    draggable: true
})
    .setLngLat([parseFloat(long), parseFloat(lat)])
    .addTo(map);

function onDragEnd() {
    const lngLat = marker.getLngLat();
    coordinates.style.display = 'block';
    // coordinates.innerHTML = `Longitude: ${lngLat.lng}<br />Latitude: ${lngLat.lat}`;
    const markedCordinates = [lngLat.lng, lngLat.lat]

    const longi = document.querySelector('#longitude');
    longi.value = lngLat.lng;

    const lati = document.querySelector('#latitude');
    lati.value = lngLat.lat;


}

marker.on('dragend', onDragEnd);

map.addControl(new mapboxgl.NavigationControl())