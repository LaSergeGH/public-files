// Доставка на странице доставки (delivery.html)
document.addEventListener("DOMContentLoaded", function () {
    if (document.querySelectorAll('.js--map-network').length) {
        let mapNetworkOptions = {
            mapNetwork: '.js--map-network',
            mapId: 'map-pizzeries',
            searchId: "#map-search", // Требует обязательного указания activeDeliveryTime (см. ниже)
            mapData: mapNetworkData,
        };
        mapNetworkObj = new mapNetwork(mapNetworkOptions);
        if(mapNetworkData.markersObjs.length <= 1){
            mapNetworkObj.map.setCenter(mapNetworkData.markersObjs[0].position);
            mapNetworkObj.map.setZoom(14);
        } else {
            mapNetworkObj.fitMapBounds('all')
        }
    }
});