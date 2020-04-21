// Доставка на странице доставки (delivery.html)
// Координаты для центров городов доставки см. в mapsSettings.js - объект deliveryCities
if (document.querySelectorAll('.js--delivery').length) {
    let deliveryOptions = {
        cityCoords: {
            // Иркутск - по умолчанию
            lat: 52.3493181, 
            lng: 104.23467540000001
        },
        delivery: '.js--delivery',
        deliveryRegions: deliveryRegions, // см. separate-js/mapsData.js
        mapsId: [
            'map-delivery-day',
            'map-delivery-night',
        ],
        searchId: "#map-search", // Требует обязательного указания activeDeliveryTime (см. ниже)
        activeDeliveryTime: "day", // data-delivery-time etc. - отображаемая карта
        viewOpts: ".js--delivery-view-opts", // переключатели отображения "карта/список/etc.".
        viewBlocks: '.js--delivery__view', // ^ Блоки отображения обязательны к указанию.
    };
    let delivery = new mapDelivery(deliveryOptions);
}

// Доставка в попапе на главной
if (document.querySelectorAll('.js--delivery-short').length) {
    let deliveryOptionsShort = {
        cityCoords: {
            // Иркутск - по умолчанию
            lat: 52.3493181, 
            lng: 104.23467540000001
        },
        delivery: '.js--delivery-short',
        deliveryRegions: deliveryRegions, // см. separate-js/mapsData.js
        activeDeliveryTime: "day",
        mapsId: [
            'map-delivery-day',
            'map-delivery-night',
        ],
    };
    let deliveryShort = new mapDelivery(deliveryOptionsShort);
}

