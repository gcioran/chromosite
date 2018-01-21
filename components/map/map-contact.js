function mapContactController($document) {
  var myCenter = new google.maps.LatLng(45.715836, 21.138463);
  var mapProp = {
    center: myCenter,
    zoom: 15,
    scrollwheel: false,
    draggable: false,
    mapTypeId: google.maps.MapTypeId.ROADMAP
    };
  var map = new google.maps.Map($document[0].getElementById('googleMap'),mapProp);
  var marker = new google.maps.Marker({
    position: myCenter,
    label: {
      color: 'black',
      fontWeight: 'bold',
      text: 'Chromosome Studio',
    },
    icon: {
      labelOrigin: new google.maps.Point(11, 50),
      url: 'images/marker_black.png',
      size: new google.maps.Size(22, 40),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(11, 40),
    }
  });

  marker.setMap(map);
}

angular.module('picdemoLightbox').component('mapContact', {
  templateUrl: 'components/map/map.html',
  controller: mapContactController
});
