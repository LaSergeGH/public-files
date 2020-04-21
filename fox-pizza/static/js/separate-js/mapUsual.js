// Карта для контактов
function mapUsual(argsObj){

    let mapObj = this;
    mapObj.mapData = null;
    mapObj.map = null;

    function initMap(){
        try{
            // Если никаких данных для карты не передаётся, то берутся данные по умолчанию
            // separate-js/mapsData/mapUsualDefaultData 
            mapObj.mapData = argsObj.mapData || mapUsualDefaultData;
            mapObj.mapElem = document.getElementById(argsObj.mapId);
            mapObj.map = new google.maps.Map(mapObj.mapElem, {
                zoom: mapObj.mapData.zoom,
                center: mapObj.mapData.center,
                fullscreenControl: mapObj.mapData.fullscreenControl,
                mapTypeControl: mapObj.mapData.mapTypeControl,
                streetViewControl: mapObj.mapData.streetViewControl,
                zoomControl: mapObj.mapData.zoomControl,
                // styles: colorScheme
            });
        } catch(e){
            if(e.name == 'TypeError'){
                console.log("Отсутствуют элементы для вставки карт или переданы неверные id элементов.", e);
            } else if(e.name == 'ReferenceError'){
                console.log("Сервис карт не подключен.", e);
            } else {
                throw e;
            }
        }
    }

    function addMarkersToMap(){
        // Добавляем маркеры на карту
        let markersObjs = mapObj.mapData.markersObjs;
        markersObjs.forEach(function(markersObj){
            marker = new google.maps.Marker({
                position: markersObj.position, 
                map: mapObj.map,
                title: 'Маркер',
                iconStyle: markersObj.iconSet.default.style,
                icon: markersObj.iconSet.default,
                iconSet: markersObj.iconSet,
            });
            // Добавляем изменение стилей иконки при событиях (клик, ховер, etc.)
            addStyleEventsOnMarker(marker);
            // Добавляем инфоокно для маркера
            if(markersObj.infoWindow){
                addInfoWindowToMarker(marker, markersObj);
            }
        });
    }

    function addStyleEventsOnMarker(marker){
        // ховер маркера
        google.maps.event.addListener(marker, 'mouseover', function () {
            //marker.setIcon(marker.iconSet.hover);
        });
        // клик маркера
        google.maps.event.addListener(marker, 'click', function () {
            marker.setIcon(marker.iconSet.active);
        });
        // убрали указатель с маркера
        google.maps.event.addListener(marker, 'mouseout', function () {
            // marker.setIcon(marker.iconSet.default);
        });
    }

    function addInfoWindowToMarker(marker, markersObj){
        // Добавление инфоокна
        let closeDelayed = false,
            closeDelayHandler = function() {
                $(infoWindow.getWrapper()).removeClass('active');
                setTimeout(function() {
                    closeDelayed = true;
                    infoWindow.close();
                }, 300);
            };

        //var template = Handlebars.compile($('#marker-content-template').html());

        let infoWindowData = markersObj.infoWindow,
            infoWindowTemplateObj = '<div class="info-window__content">' + 
                infoWindowData.content.text +
                '</div>' +
                '<div class="info-window__btn-block">' + 
                '<a class="btn btn--small" href="' + infoWindowData.content.btnHref + '">' + 
                '<span class="btn__title">' + 
                infoWindowData.content.btnTitle + 
                '</span>' + 
                '</a>' + 
                '</div>',
            infoWindow = new SnazzyInfoWindow({
                marker: marker,
                content: infoWindowTemplateObj,
                placement: infoWindowData.placement,
                offset: infoWindowData.offset,
                maxWidth: infoWindowData.maxWidth,
                wrapperClass: infoWindowData.wrapperClass,
                callbacks: {
                    open: function() {
                        $(this.getWrapper()).addClass('open');
                        let curInfoWindow = this;
                    },
                    afterOpen: function() {
                        var wrapper = $(this.getWrapper());
                        wrapper.addClass('active');
                        wrapper.find('.custom-close').on('click', closeDelayHandler);
                    },
                    beforeClose: function() {
                        if (!closeDelayed) {
                            closeDelayHandler();
                            return false;
                        }
                        return true;
                    },
                    afterClose: function() {
                        marker.setIcon(marker.iconSet.default);
                        var wrapper = $(this.getWrapper());
                        wrapper.find('.custom-close').off();
                        wrapper.removeClass('open');
                        closeDelayed = false;
                    }
                }
            });
        marker.infoWindow = infoWindow;
    }

    function init(){
        initMap();
        if(mapObj.mapData.markersObjs){
            addMarkersToMap();
        }
    }

    init();

}