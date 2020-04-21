// Настройки для карт - иконки, разметка балунов и т.д.
let mapsIconsSetDefault,
    mapsIconsSetTracking,
    deliveryCities; 
document.addEventListener("DOMContentLoaded", function () {})
    function getMarkersIconUrl(argStyle) {
        // Разметка для маркера - svg
        var markup = 'data:image/svg+xml;utf-8, <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26.08 36"  width="26.08" height="36"><defs><style>' + argStyle + '</style></defs><g id="Слой_2" data-name="Слой 2"><g id="Слой_1-2" data-name="Слой 1"><path class="map__icon" d="M13,0A13.05,13.05,0,0,0,0,13c0,8.92,11.67,22,12.16,22.57a1.17,1.17,0,0,0,1.75,0C14.41,35.06,26.08,22,26.08,13A13.05,13.05,0,0,0,13,0Zm0,19.6A6.56,6.56,0,1,1,19.6,13,6.57,6.57,0,0,1,13,19.6Z"/></g></g></svg>'
        return markup;
    };

    // Набор иконок для маркеров (стандарт)
    mapsIconsSetDefault = {
        default: { //дефолтная
            style: 'default',
            anchor: new google.maps.Point(40, 40),
            url: getMarkersIconUrl('.map__icon{fill:%23FF5E00;}')
        },
        hover: { // ховер
            style: 'hover',
            anchor: new google.maps.Point(40, 40),
            url: getMarkersIconUrl('.map__icon{fill:%23FF5E00;}')
        },
        active: { // активная
            style: 'active',
            anchor: new google.maps.Point(40, 40),
            url: getMarkersIconUrl('.map__icon{fill:%23202a3a;}')
        }
    }

    function getMarkersTrackingIconUrl(argStyle) {
        // Разметка для маркера - svg
        var markup = 'data:image/svg+xml;utf-8, <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 49.7 49.7" width="50" height="50"><defs><style>' + argStyle + '</style></defs><circle class="circle" cx="24.85" cy="24.85" r="24.85"/><path class="figure" d="M28.43,23a1.28,1.28,0,0,1-.55,1.72,7.38,7.38,0,0,0-2.61,2.71,5.14,5.14,0,0,0-.7,4,1.28,1.28,0,1,1-2.45.74,7.68,7.68,0,0,1,.94-6.05,9.88,9.88,0,0,1,3.64-3.69A1.28,1.28,0,0,1,28.43,23Z"/><path class="figure" d="M14.14,18.38h.81A13.51,13.51,0,0,0,12.51,29h0a2.13,2.13,0,0,0,.56,1l.11.12a9.49,9.49,0,0,0-6,4.49l-.35.62,2.83,1.62a3.54,3.54,0,0,0-.09.81A3.58,3.58,0,1,0,16.62,37H32.1a3.58,3.58,0,1,0,7,0h1.53a.72.72,0,0,0,.71-.64c.27-2.53-.87-8.44-3.48-10.11L37,25.66l-.06,0a2.15,2.15,0,0,0-2-3H27a2.15,2.15,0,0,0-1.08,4l1.17,2.84a1.75,1.75,0,0,1,.13.68,1.81,1.81,0,0,1-.36,1.08,1.83,1.83,0,0,1-1.44.72H22.2a.75.75,0,0,1-.57-.28L18,27.17a2.16,2.16,0,0,1-.36-2l2.26-6.76h2.86a.72.72,0,0,0,0-1.43H20.45a2.15,2.15,0,0,0-2-2.87H14.14a.72.72,0,0,0-.72.72v2.86A.72.72,0,0,0,14.14,18.38Zm4.29-2.86a.72.72,0,0,1,0,1.43H14.85V15.52ZM37.63,37a2.15,2.15,0,1,1-4.05,0ZM11.09,37h4a2.15,2.15,0,1,1-4.17.71A2.1,2.1,0,0,1,11.09,37Z"/><path class="figure" d="M26.15,23.43c.07-5.72,1-6.31,1-8.21l5.19-.93c.67.85,1.89,3.4,1.84,8.33S26.08,29.15,26.15,23.43Z"/><path class="figure" d="M27.67,5.06c.64.93,1.71,2,2.17,2.57-.31.76-2.05.49-2.11.29A4.68,4.68,0,0,1,27.67,5.06Z"/><path class="figure" d="M24.06,14.62c-2.11-.44-2.67-1.31-2.69-1.69l3.58-.76c.69-1.08,1-5.87,6.28-4.12C36,9.62,32.4,14.16,32,14.52,30.26,16,26.7,15.17,24.06,14.62Z"/><path class="figure" d="M29.74,4.7c4.2,2.83,4,5.22,3.85,6.89-.83,0-2.44-1.14-3.34-2C28.93,8.6,29.54,5.67,29.74,4.7Z"/><path class="figure" d="M21.13,16.85a1.28,1.28,0,0,1,1.43-1.11l6.4.8a1.28,1.28,0,0,1-.32,2.54l-6.4-.8A1.28,1.28,0,0,1,21.13,16.85Z"/></svg>'
        return markup;
    };

    // Набор иконок для маркеров (карта отслеживания доставки курьером)
    mapsIconsSetTracking = {
        default: { //дефолтная
            style: 'default',
            anchor: new google.maps.Point(40, 40),
            url: getMarkersTrackingIconUrl('.circle{fill:%23fff;}.figure{fill:%23ff5e00;}')
        },
        hover: { // ховер
            style: 'hover',
            anchor: new google.maps.Point(40, 40),
            url: getMarkersTrackingIconUrl('.circle{fill:%23fff;}.figure{fill:%23ff5e00;}')
        },
        active: { // активная
            style: 'active',
            anchor: new google.maps.Point(40, 40),
            url: getMarkersTrackingIconUrl('.circle{fill:%23fff;}.figure{fill:%23ff5e00;}')
        }
    }

    // Города, в которых работает доставка
    deliveryCities = {
        // Иркутск - по умолчанию (см. mapDeliveryInits.js)
        irk: {
            lat: 52.3493181, 
            lng: 104.23467540000001
        },
        // Усолье
        usl: {
            lat: 52.752605120409, 
            lng: 103.64468240178007
        },
    }

