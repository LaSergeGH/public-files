// Карта пиццерий:
//  - При выборе опций "Все/Пиццерии/Самовывоз" 
//    карта подстраивается под область, ограниченную соотв. маркерами 
//    и справа отображаются ссылки на отображённые пункты на карте
//  - При клике на ссылку на пункт карта центрируется по выбранному пункту 
//    и открывается соотв. ему инфоокно
//  - При выборе адреса в поле поиска карта центруется по переданным координатам 
//    и устанавливается пин. При вводе нового адреса старый пин удаляется и ставится новый
function mapNetwork(argsObj) {
    // argsObj = {
    //     mapId: [
    //         'mapElId', ... // id элемента для вставки карты
    //     ],
    //     searchInputId: '' // id поля поиска 
    // }
    let mapNetworkObj = this;
    mapNetworkObj.mapNetwork = null;
    // Данные для карты
    mapNetworkObj.mapData = null;
    // Объект слайдера кафе
    mapNetworkObj.map = null;
    // Объект карты
    mapNetworkObj.$container = null;
    // Адрес (маркер) польз-ля на карте
    mapNetworkObj.userMarker = null;
    // Массив маркеров на карте
    mapNetworkObj.markers = [];
    // ссылки-табы по адресам на карте
    mapNetworkObj.placesTabs = [];
    // Типы маркеров на карте
    mapNetworkObj.markersTypes = [
        'customer',
        'pizzeria'
    ];
    // Классы для элементов
    mapNetworkObj.classesElements = {
        placesTabs: {
            active: 'map__places-link--active'
        },
        placesItem: {
            hidden: 'map__places-item--hidden'
        },
    };

    function initMapNetwork() {
        mapNetworkObj.mapNetwork = document.querySelector(argsObj.mapNetwork);
    }

    function initMap() {
        // Инициализация карт, отрисовка полигонов
        // 
        try {
            let mapId = argsObj.mapId;
            mapNetworkObj.mapData = argsObj.mapData;
            let mapElement = document.getElementById(mapId);
            let mapInstance = new google.maps.Map(mapElement, {
                zoom: mapNetworkObj.mapData.zoom,
                center: mapNetworkObj.mapData.center,
                fullscreenControl: mapNetworkObj.mapData.fullscreenControl,
                mapTypeControl: mapNetworkObj.mapData.mapTypeControl,
                streetViewControl: mapNetworkObj.mapData.streetViewControl,
                zoomControl: mapNetworkObj.mapData.zoomControl,
            });
            mapNetworkObj.map = mapInstance;
        } catch (e) {
            if (e.name == 'TypeError') {
                console.log("Отсутствуют элементы для вставки карт или переданы неверные id элементов.", e);
            } else if (e.name == 'ReferenceError') {
                console.log("Сервис карт не подключен.", e);
            } else {
                throw e;
            }
        }
    };

    function addMarkersToMap() {
        // Добавляем маркеры на карту
        let markersObjs = mapNetworkObj.mapData.markersObjs;
        markersObjs.forEach(function (markersObj) {
            marker = new google.maps.Marker({
                position: markersObj.position,
                map: mapNetworkObj.map,
                title: '',
                iconStyle: markersObj.iconSet.default.style,
                icon: markersObj.iconSet.default,
                iconSet: markersObj.iconSet,
                type: markersObj.type,
                id: markersObj.id,
            });
            // Добавляем маркеры в список маркеров объекта
            mapNetworkObj.markers.push(marker);
            // Добавляем события маркеру (клик, ховер, etc.)
            addEventsOnMarker(marker);
            // Добавляем инфоокно для маркера
            if (markersObj.infoWindow) {
                addInfoWindowToMarker(marker, markersObj);
            }
        });
    }

    function toggleMarker(marker) {
        let thisMarker = marker;
        // Центрируем карту по активному маркеру
        mapNetworkObj.map.setCenter(thisMarker.getPosition());
        mapNetworkObj.markers.forEach(function (item) {
            if (item != thisMarker) {
                marker.setZIndex(0);
                item.infoWindow.close();
                item.setIcon(item.iconSet.default);
            } else {
                marker.setZIndex(2);
                item.infoWindow.open();
                item.setIcon(item.iconSet.active);
                let curId = parseInt(marker.id);
                // Если в объекте есть слайдер с кафе, перелистываем его по id активного маркера
                if (mapNetworkObj.$container) {
                    let $slides = mapNetworkObj.$container.find('.js--slider-network-slide');
                    let curSlide = $slides.filter(function (idex, elem) {
                        return parseInt(elem.getAttribute('data-marker-id')) === curId;
                    })[0];
                    mapNetworkObj.$container.slick('slickGoTo', curSlide.getAttribute('data-slick-index'));
                };
                // Если в объекте есть ссылки-табы, переключаем активную
                if (mapNetworkObj.placesTabs) {
                    let tabActive = mapNetworkObj.placesTabs.filter(function (tab) {
                        return parseInt(tab.getAttribute('data-marker-id')) === curId;
                    })[0];
                    toggleActiveTab(tabActive);
                }
            }
        });
    };
    mapNetworkObj.toggleMarker = toggleMarker;

    function addEventsOnMarker(marker) {
        // ховер маркера
        google.maps.event.addListener(marker, 'mouseover', function () {
            //marker.setIcon(marker.iconSet.hover);
        });
        // клик маркера
        google.maps.event.addListener(marker, 'click', function () {
            marker.setIcon(marker.iconSet.active);
            toggleMarker(marker);
        });
        // убрали указатель с маркера
        google.maps.event.addListener(marker, 'mouseout', function () {
            // marker.setIcon(marker.iconSet.default);
        });
    }

    function addInfoWindowToMarker(marker, markersObj) {
        // Добавление инфоокна
        let closeDelayed = false,
            closeDelayHandler = function () {
                $(infoWindow.getWrapper()).removeClass('active');
                setTimeout(function () {
                    closeDelayed = true;
                    infoWindow.close();
                }, 300);
            };

        //var template = Handlebars.compile($('#marker-content-template').html());

        let infoWindowData = markersObj.infoWindow,
            infoWindowTemplateObj = '<div class="info-window__content">' +
                infoWindowData.content.text +
                '</div>'/*  +
                '<div class="info-window__btn-block">' +
                '<a class="btn btn--small" href="' + infoWindowData.content.btnHref + '">' +
                '<span class="btn__title">' +
                infoWindowData.content.btnTitle +
                '</span>' +
                '</a>' +
                '</div>' */,
            infoWindow = new SnazzyInfoWindow({
                marker: marker,
                content: infoWindowTemplateObj,
                placement: infoWindowData.placement,
                offset: infoWindowData.offset,
                maxWidth: infoWindowData.maxWidth,
                wrapperClass: infoWindowData.wrapperClass,
                callbacks: {
                    open: function () {
                        $(this.getWrapper()).addClass('open');
                        let curInfoWindow = this;
                        mapNetworkObj.markers.forEach(function (marker) {
                            if (marker.infoWindow != curInfoWindow) {
                                $(marker.infoWindow.getWrapper()).removeClass('active');
                                setTimeout(function () {
                                    closeDelayed = false;
                                    marker.infoWindow.close();
                                }, 300);
                            }
                        });
                    },
                    afterOpen: function () {
                        var wrapper = $(this.getWrapper());
                        wrapper.addClass('active');
                        wrapper.find('.custom-close').on('click', closeDelayHandler);
                    },
                    beforeClose: function () {
                        marker.setIcon(marker.iconSet.default);
                        if (!closeDelayed) {
                            closeDelayHandler();
                            return false;
                        }
                        return true;
                    },
                    afterClose: function () {
                        var wrapper = $(this.getWrapper());
                        wrapper.find('.custom-close').off();
                        wrapper.removeClass('open');
                        closeDelayed = false;
                    }
                }
            });
        marker.infoWindow = infoWindow;
    }

    mapNetworkObj.fitMapBounds = function (markersType) {
        // Подгоняем карту под массив маркеров, которых нужно отобразить
        // markersType = 'customer/pizzeria'
        // Область, по которой будет масштабироваться карта
        let bounds = new google.maps.LatLngBounds();
        let boundsMarkers = [];
        // Проверка на допустимый тип маркера (если не прошёл - показывается вся сеть)
        if (mapNetworkObj.markersTypes.indexOf(markersType) == -1) {
            boundsMarkers = mapNetworkObj.markers;
        } else {
            mapNetworkObj.markers.forEach(function (marker) {
                if (marker.type == markersType) {
                    boundsMarkers.push(marker);
                } else {
                    marker.infoWindow.close();
                    marker.setMap(null);
                }
            });
        }
        boundsMarkers.forEach(function (marker) {
            marker.setMap(mapNetworkObj.map);
            // Добавляем к области наше место
            bounds.extend(new google.maps.LatLng(marker.position.lat(), marker.position.lng()));
        })
        // Подгоняем карту
        mapNetworkObj.map.fitBounds(bounds);
    };

    function initOpts() {
        // Инициализируем отображение групп маркеров "Все/Пиццерии/Самовывоз"
        // см. переключатель .js--opts над картой
        let opts = mapNetworkObj.mapNetwork.querySelectorAll('.js--map-opts');
        opts.forEach(function (opt) {
            let markerType = opt.getAttribute('data-marker-type');
            opt.addEventListener('click', function () {
                mapNetworkObj.fitMapBounds(markerType);
                // Фильтруем ссылки-табы на места на карте
                togglePlacesTabs(markerType);
            });
        })
    }

    function initSearch() {
        // Используем DaData API - https://dadata.ru 
        // С подключаемым скриптом (js/plugins/jquery.suggestions.min.js)
        let searchId = argsObj.searchId;
        if (searchId) {
            $(searchId).suggestions({
                token: "da1500d4c7f51de3a80ff01c6e6fcd555003178a",
                type: "ADDRESS",
                count: 20, // кол-во подсказок
                headers: {
                    "locations": [
                        {
                            "kladr_id": "3800000300000"
                            // "street_fias_id": "3800000300000",
                        },
                        {
                            "kladr_id": "3800100000000"
                        }
                    ],
                    "locations_boost": [
                        {
                            "kladr_id": "3800000300000",
                        },
                    ],
                },
                // Вызывается, когда пользователь выбирает одну из подсказок
                onSelect: function (suggestion) {
                    let dataGeo = {
                        lat: suggestion.data.geo_lat,
                        lng: suggestion.data.geo_lon,
                    };
                    // let addrLatLng = new google.maps.LatLng(dataGeo.lat, dataGeo.lng);
                    if (mapNetworkObj.userMarker) {
                        mapNetworkObj.userMarker.setMap(null);
                    }
                    marker = new google.maps.Marker({
                        position: {
                            lat: parseFloat(dataGeo.lat),
                            lng: parseFloat(dataGeo.lng),
                        },
                        map: mapNetworkObj.map,
                        title: mapNetworkObj.mapData.userMarkerData.title,
                        iconStyle: mapNetworkObj.mapData.userMarkerData.iconSet.default.style,
                        icon: mapNetworkObj.mapData.userMarkerData.iconSet.default,
                        iconSet: mapNetworkObj.mapData.userMarkerData.iconSet,
                        type: mapNetworkObj.mapData.userMarkerData.type,
                    });
                    mapNetworkObj.userMarker = marker;
                    mapNetworkObj.userMarker.setMap(mapNetworkObj.map);
                    let bounds = new google.maps.LatLngBounds();
                    bounds.extend(new google.maps.LatLng(marker.position.lat(), marker.position.lng()));
                    // Подгоняем карту
                    mapNetworkObj.map.fitBounds(bounds);
                    mapNetworkObj.map.setZoom(12);
                    marker.setIcon(marker.iconSet.active);
                }
            });
        }
    }

    function initPlacesTabs() {
        // Инициализируем ссылки-табы
        // При выборе ссылки карта центрируется по соотв. маркеру, открывается его инфоокно
        // и он переходит в активное состояние
        let tabs = mapNetworkObj.mapNetwork.querySelectorAll('.js--map-places-tab');
        if (tabs) {
            mapNetworkObj.placesTabs = Array.from(tabs);
            mapNetworkObj.placesTabs.forEach(function (tab) {
                tab.addEventListener('click', function () {
                    // toggleActiveTab(tab);
                    let type = this.getAttribute('data-type'),
                        markerId = parseInt(this.getAttribute('data-marker-id'));
                    mapNetworkObj.markers.forEach(function (marker) {
                        if (marker.id == markerId) {
                            toggleMarker(marker)
                        }/*  else {
                            tabItem.classList.remove(classTabActive)
                        } */
                    });
                })
            });
        }
    }

    function initSlider() {
        // Связываем наш объект карты пиццерий со слайдером кафе
        let sliderNetwork = document.querySelector('.js--slider-network-container');
        if (sliderNetwork) {
            let $container = $(sliderNetwork);
            if ($container.slick) {
                $container.on('afterChange', function (event, slick, currentSlide) {
                    let slides = slick.$slides;
                    let curSlideElem = slides.filter(function (index, elem) {
                        return elem.classList.contains('slick-current');
                    })[0];
                    let curMarkerId = curSlideElem.getAttribute('data-marker-id');
                    mapNetworkObj.markers.forEach(function (marker) {
                        if (marker.id == curMarkerId) {
                            mapNetworkObj.toggleMarker(marker)
                        }
                    });
                });
                // Добавляем в mapNetworkObj слайдер, чтобы связать его объектом
                mapNetworkObj.$container = $container;
            }
        }
    }

    function toggleActiveTab(tabActive) {
        // Переключаем активную вкладку
        if (mapNetworkObj.placesTabs) {
            let classTabActive = mapNetworkObj.classesElements.placesTabs.active;
            mapNetworkObj.placesTabs.forEach(function (tabItem) {
                if (tabItem == tabActive) {
                    tabItem.classList.add(classTabActive)
                } else {
                    tabItem.classList.remove(classTabActive)
                }
            });
        }
    }

    function togglePlacesTabs(type) {
        // Прям/показываем списки ссылок на места на карте.
        // type - тип отображаемых маркеров и соотв-щих им ссылок
        let classTabWrapHidden = mapNetworkObj.classesElements.placesItem.hidden;
        mapNetworkObj.placesTabs.forEach(function (tab) {
            let tabType = tab.getAttribute('data-type'),
                tabWrap = tab.closest('.js--map-places-item');
            if (mapNetworkObj.markersTypes.indexOf(type) != -1) {
                if (tabType == type) {
                    tabWrap.classList.remove(classTabWrapHidden);
                } else {
                    tabWrap.classList.add(classTabWrapHidden);
                }
            } else {
                tabWrap.classList.remove(classTabWrapHidden);
            };
        });
    }

    function init() {
        // Инициализация объекта доставки
        initMapNetwork();
        if (mapNetworkObj.mapNetwork) {
            // Инициализация карт
            initMap();
            // Инициализация маркеров
            if (mapNetworkObj.mapData.markersObjs) {
                addMarkersToMap();
                // Инициализация опций отображения маркеров - "Все/Пиццерии/Самовывоз"
                initOpts();
            };
            // Добавляем поиск
            initSearch();
            // Добавляем табы мест на карте
            initPlacesTabs();
            // Добавляем слайдер
            initSlider()
        } else {
            console.log('Элемента "' + argsObj.mapNetwork + '" для объекта mapNetwork нет в документе');
        }
        // 
    };

    init();
}