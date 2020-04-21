"use strict";

// Обработка доставки:
//  - По клику по области на карте область подкрашивается 
//    и справа отображаются улицы, входящие в неё;
//  - При введении адреса в поле поиска, подкрашивается подходящая область на карте 
//    отображаются улицы, входящие в неё;
//  - При переключении времени (дневное/ночное) меняются карты;
function mapDelivery(argsObj) {
  // argsObj = {
  //     mapsId: [
  //         'mapElId', ... // id элемента для вставки карты
  //     ],
  //     searchInputId: '' // id поля поиска 
  // }
  var deliveryObj = this;
  deliveryObj.delivery = null;
  deliveryObj.classes = {
    mapTab: 'delivery__map-tab',
    mapTabActive: 'delivery__map-tab--active',
    areaDataActive: 'delivery__area-data--active',
    viewOpts: {
      viewActive: 'delivery__view--active',
      rowViewActive: 'delivery__row--view-active'
    }
  };
  deliveryObj.mapActiveObj = null; // Активная карта

  deliveryObj.mapTabs = null; // Блоки-вкладки с картами

  deliveryObj.deliveryOpts = null; // Переключатели блоков-вкладок с картами

  deliveryObj.activeAddrObj = null; // Активный адрес, введённый в поле поиска

  deliveryObj.activeDeliveryTime = argsObj.activeDeliveryTime;
  deliveryObj.viewOpts = null; // Переключатели отображения "карты/список/etc." блоков с информацией о доставке

  deliveryObj.viewBlocks = null; // Блоки отображения "карты/список/etc." с информацией о доставке
  // Служебный объект

  var deliveryData = {
    maps: {} // Данные для карт

  };

  function initDelivery() {
    deliveryObj.delivery = document.querySelector(argsObj.delivery);
  }

  function selectorClass(classArg) {
    return '.' + classArg;
  }

  function setActiveDeliveryTime(deliveryTime) {
    // Установка активного времени доставки
    deliveryObj.activeDeliveryTime = deliveryTime; // Отображаем данные по активному адресу доставки

    if (deliveryObj.activeAddrObj) {
      var polygons = deliveryData.maps[deliveryObj.activeDeliveryTime].polygons;
      toggleAddrData(deliveryObj.activeAddrObj, polygons);
    }
  }

  function setActiveAddrObj(addrObj) {
    // Установка объекта активного адреса доставки
    deliveryObj.activeAddrObj = addrObj;
  }

  function setActiveMap(mapObj) {
    // Установка активной карты
    deliveryObj.mapActiveObj = mapObj;
  }

  function getPolygonBounds(polygon) {
    // Получаем точки плоигона
    var polygonBounds = new google.maps.LatLngBounds();
    var latLngArr = polygon.getPath().getArray();
    latLngArr.forEach(function (latLng) {
      polygonBounds.extend(latLng);
    });
    return polygonBounds;
  }

  function scaleMapToPolygon(polygon, addrLatLng) {
    // Масштабируем карту по полигону
    var mapBounds = polygon.map.getBounds();
    var polygonBounds = getPolygonBounds(polygon); // polygon.map.panTo(addrLatLng);

    polygon.map.fitBounds(polygonBounds);
  }

  ;

  function toggleAddrData(addrLatLng, polygons) {
    // Отображаем данные по активному адресу доставки - область, районы.
    // addrLatLng - объект адреса (активного) 
    // polygons - области доставки на активной карте
    polygons.forEach(function (polygon) {
      if (google.maps.geometry.poly.containsLocation(addrLatLng, polygon)) {
        colorizePolygon(polygon, 'active');
        var areaId = polygon.rId; // Отображаем данные областей доставки

        toggleAreaData(areaId); // Масштабируем карту по подошедшему полигону

        scaleMapToPolygon(polygon, addrLatLng);
      } else {
        colorizePolygon(polygon, 'default');
      }
    });
  }

  ;

  function addListenersOnPolygon(polygon) {
    google.maps.event.addListener(polygon, 'click', function (event) {
      var areaId = polygon.rId;
      toggleAreaData(areaId); // this.setMap(null); // - remove polygon from map
      // console.log(event.latLng.lat());

      var polygons = deliveryData.maps[deliveryObj.activeDeliveryTime].polygons;
      polygons.forEach(function (polygon) {
        colorizePolygon(polygon, 'default');
      });
      colorizePolygon(polygon, 'active');
    });
  }

  function colorizePolygon(polygon, styles) {
    // Окрашивание полигона при его разных состояниях, подсветке адреса и т.п.
    switch (styles) {
      case 'active':
        polygon.setOptions(polygon.activeStyles);
        polygon.zIndex = 2;
        break;

      case 'default':
        polygon.setOptions(polygon.passiveStyles);
        polygon.zIndex = 1;
        break;

      default:
        return;
    }
  }

  function toggleMapTabs(ddtime, deliveryTime, mapTabsArr, classMTActive) {
    // Переключаем блоки с картами (дневная/ночная/etc)
    var mapTabActive = mapTabsArr.filter(function (tab) {
      return tab.getAttribute(ddtime) == deliveryTime;
    })[0];
    mapTabsArr.forEach(function (tab) {
      tab.classList.remove(classMTActive);
    });
    mapTabActive.classList.add(classMTActive);
  }

  function bindToggleMaps() {
    // Привязываем переключение карт
    deliveryObj.deliveryOpts.forEach(function (option) {
      var ddtime = 'data-delivery-time',
          deliveryTime = option.getAttribute(ddtime),
          mapTabsArr = Array.from(deliveryObj.mapTabs),
          classMTActive = deliveryObj.classes.mapTabActive;
      option.addEventListener('click', function () {
        // Переключаем карты
        toggleMapTabs(ddtime, deliveryTime, mapTabsArr, classMTActive); // Устанавливаем активную карту

        setActiveDeliveryTime(deliveryTime);
      });
    });
  }

  function toggleViews(view, viewAttr) {
    // Переключение отображения "карта/список"
    var classViewActive = deliveryObj.classes.viewOpts.viewActive,
        classRowViewActive = deliveryObj.classes.viewOpts.rowViewActive,
        // viewOptsArr = Array.from(deliveryObj.viewOpts),
    viewBlocksArr = Array.from(deliveryObj.viewBlocks),
        viewBlockActive = viewBlocksArr.filter(function (block) {
      return block.getAttribute(viewAttr) == view;
    })[0];
    viewBlocksArr.forEach(function (block) {
      block.classList.remove(classViewActive);
      var rowsView = block.querySelectorAll('.js--delivery__row--view');

      if (rowsView) {
        Array.from(rowsView).forEach(function (row) {
          row.classList.remove(classRowViewActive);
        });
      }
    });
    viewBlockActive.classList.add(classViewActive);
    var rowsViewActive = viewBlockActive.querySelectorAll('.js--delivery__row--view');

    if (rowsViewActive) {
      Array.from(rowsViewActive).forEach(function (row) {
        row.classList.add(classRowViewActive);
      });
    }
  }

  function bindViewOpts() {
    // Привязываем переключение отображений блоков с инфо о доставке
    deliveryObj.viewOpts.forEach(function (optsItem) {
      optsItem.addEventListener('click', function () {
        var viewAttr = 'data-view',
            view = optsItem.getAttribute(viewAttr); // Переключаем отображение

        toggleViews(view, viewAttr);
      });
    });
  }

  function initViewOpts() {
    // Инициализация пепреключателей блоков с инфо о доставке
    if (argsObj.viewOpts && argsObj.viewBlocks) {
      var viewOpts = deliveryObj.delivery.querySelectorAll(argsObj.viewOpts),
          viewBlocks = deliveryObj.delivery.querySelectorAll(argsObj.viewBlocks);

      if (viewOpts && viewBlocks) {
        deliveryObj.viewOpts = viewOpts;
        deliveryObj.viewBlocks = viewBlocks;
        bindViewOpts();
      } else {
        console.log('Переданы неверные селекторы для опций и/или блоков отображения инфо о доставке или таких элементов нет на странице');
      }
    }
  }

  function initMapSelection() {
    // Инициализация переключателя карт
    var deliveryOpts = deliveryObj.delivery.querySelectorAll('.js--delivery-opts'),
        mapTabs = deliveryObj.delivery.querySelectorAll('.js--delivery__map-tab');

    if (deliveryOpts && mapTabs) {
      deliveryObj.deliveryOpts = deliveryOpts;
      deliveryObj.mapTabs = mapTabs;
      bindToggleMaps();
    } else {
      console.log('Не переданы селекторы для переключателей карт и вкладок карт или таких элементов нет на странице');
    }
  }

  function initMaps() {
    // Инициализация карт, отрисовка полигонов
    // 
    try {
      var mapsId = argsObj.mapsId;
      var deliveryRegions = argsObj.deliveryRegions;
      mapsId.forEach(function (id) {
        var mapElement = document.getElementById(id);
        var dataDeliveryTime = mapElement.closest(selectorClass(deliveryObj.classes.mapTab)).getAttribute('data-delivery-time');
        var colorScheme = deliveryRegions[dataDeliveryTime].colorScheme; // стили для карты

        deliveryData.maps[dataDeliveryTime] = {}; // Массив для полигонов

        var mapDayInstance = new google.maps.Map(mapElement, {
          zoom: 10,
          center: {
            lat: argsObj.cityCoords.lat,
            lng: argsObj.cityCoords.lng
          },
          fullscreenControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          zoomControl: false,
          styles: colorScheme
        });
        var polygons = [];
        var regions = deliveryRegions[dataDeliveryTime].items;
        regions.forEach(function (region) {
          var style = region.style;
          var regionPolygon = new google.maps.Polygon({
            paths: region.coords,
            strokeColor: style.strokeColor,
            strokeOpacity: style.strokeOpacity,
            strokeWeight: style.strokeWeight,
            fillColor: style.fillColor,
            fillOpacity: style.fillOpacity,
            rId: region.id,
            map: mapDayInstance,
            passiveStyles: {
              strokeColor: '#f57c00',
              strokeOpacity: 0.5,
              fillColor: '#adb2b8',
              zIndex: 1,
              fillOpacity: 0.5
            },
            activeStyles: {
              strokeColor: '#d43701',
              strokeOpacity: 1,
              zIndex: 2,
              fillColor: '#d43701',
              fillOpacity: 0.5
            }
          });
          polygons.push(regionPolygon); //regionPolygon.setMap(mapDayInstance);

          addListenersOnPolygon(regionPolygon); // Складываем полигоны в служебный объект

          deliveryData.maps[dataDeliveryTime].polygons = polygons;
        });
      });
    } catch (e) {
      if (e.name == 'TypeError') {
        console.log("Отсутствуют элементы для вставки карт или переданы неверные id элементов.", e);
      } else if (e.name == 'ReferenceError') {
        console.log("Сервис карт не подключен.", e);
      } else {
        throw e;
      }
    }
  }

  ;

  function initAreaData() {
    // Инициализация данных по областям доставки
    var areaDatas = deliveryObj.delivery.querySelectorAll('.js--delivery-area-data');

    if (areaDatas) {
      areaDatas.forEach(function (area) {
        var areaDistricts = area.querySelectorAll('.js--delivery__area-district');

        if (areaDistricts.length < 12) {
          areaDistricts.forEach(function (district) {
            district.classList.add('delivery__area-district--wide');
          });
        }
      });
      deliveryObj.areaDatas = areaDatas;
    } else {
      console.log('Не переданы селекторы для блоков данных по областям доставки или их нет на странице');
    }
  }

  function toggleAreaData(areaId) {
    // Переключение блоков с данными по областям доставки
    var areasArr = Array.from(deliveryObj.areaDatas),
        areaActive = areasArr.filter(function (area) {
      return area.getAttribute('data-area-id') == areaId;
    })[0],
        classActive = deliveryObj.classes.areaDataActive;
    areasArr.forEach(function (area) {
      area.classList.remove(classActive);
    });
    areaActive.classList.add(classActive);
  }

  function initSearch() {
    // Используем DaData API - https://dadata.ru 
    // С подключаемым скриптом (js/plugins/jquery.suggestions.min.js)
    var searchId = argsObj.searchId;

    if (searchId) {
      $(searchId).suggestions({
        token: "da1500d4c7f51de3a80ff01c6e6fcd555003178a",
        type: "ADDRESS",
        count: 20,
        // кол-во подсказок
        headers: {
          "locations_boost": [{
            "kladr_id": "3800000300000"
          }, {
            "kladr_id": "3800100000000"
          }]
        },
        // Вызывается, когда пользователь выбирает одну из подсказок
        onSelect: function onSelect(suggestion) {
          // console.log(suggestion.data.geo_lat, suggestion.data.geo_lon)
          var polygons = deliveryData.maps[deliveryObj.activeDeliveryTime].polygons;
          var dataGeo = {
            lat: suggestion.data.geo_lat,
            lng: suggestion.data.geo_lon
          };
          var addrLatLng = new google.maps.LatLng(dataGeo.lat, dataGeo.lng); // Прописываем активный адрес

          setActiveAddrObj(addrLatLng); // Отображаем данные по данному адресу

          toggleAddrData(addrLatLng, polygons);
        }
      });
    }
  }

  function init() {
    // Инициализация объекта доставки
    initDelivery();

    if (deliveryObj.delivery) {
      initMaps(); // Инициализация карт

      initSearch(); // Инициализация поля поиска

      initMapSelection(); // Инициализация переключателя карт

      initAreaData(); // Инициализация данных областей доставки

      initViewOpts(); // Инициализация переключателей блоков отображения инфо о доставке
    } else {
      console.log('Элемента "' + argsObj.delivery + '" для объекта delivery нет в документе');
    } // 

  }

  ;
  init(); // Инициализируем объект
  // return deliveryObj;
}