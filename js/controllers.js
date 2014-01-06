'use strict';

/* Controllers */
angular.module('chronicles.controllers', [])
.controller('GoToCtrl', function($scope, Chronicles) {
    $scope.previous = function(){
        Chronicles.previous();
    }
    $scope.next = function(){
        Chronicles.next();
    }
    $scope.showPrevious = function(){
        return Chronicles.index != 0;
    }
    $scope.showNext = function(){
        return Chronicles.index != (Chronicles.all.length - 1);
    }
})           
.controller('ChronicleCtrl', function($scope, angulargmContainer, $location, $routeParams, Chronicles, Channels) {
    $scope.chronicles = Chronicles;
    $scope.channels = Channels;
    
    /* Default to the bio */
    var current = 'bio';

    /* Should we be using something other than bio? */
    if($scope.chronicles.current.id == undefined && $location.path() != ''){
            current = $location.path().replace('/','');
    }
    
    /* Fetch the current chronicle */
    $scope.fetch = function(chronicle_id){
        $scope.chronicles.fetch(chronicle_id);
        $scope.view = 'partials/' + $scope.chronicles.current.layout + '.html';
    }
    
    /* grabs what we determiend to be the current chronicle. */
    $scope.fetch(current);
    
    /* fetch all the channels */
    $scope.channels.fetch();
    
    /* If we have a map, that needs zooming, panning or whatever, lets do it here */
    if($scope.chronicles.current.map != undefined){
        var lat = $scope.chronicles.current.map.center == undefined ? 0 : $scope.chronicles.current.map.center.lat;
        var lon = $scope.chronicles.current.map.center == undefined ? 0 : $scope.chronicles.current.map.center.lon;
        $scope.angulargmContainer = angulargmContainer;
        $scope.map = {
              center: new google.maps.LatLng(lat, lon),
              mapTypeId: google.maps.MapTypeId.ROADMAP,
              zoom: $scope.chronicles.current.map.zoom,
              disableDefaultUI: true
        };
        
        var gmapPromise = $scope.angulargmContainer.getMapPromise('myMap');
        gmapPromise.then(function(gmap) {
          gmap.whatever = 'woot';
        });    
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    $scope.whatever = function(){
      var gmapPromise = $scope.angulargmContainer.getMapPromise('myMap');
      gmapPromise.then(function(gmap) {
        console.log(gmap.center);
        console.log('lat:' + gmap.center.ob, 'Long:' + gmap.center.pb);
        return true;
        var pov = {
            heading: 34,
            pitch: 10
        };
        var panorama = new google.maps.StreetViewPanorama(document.getElementById('myMap'),pov);
        gmap.setStreetView(panorama);    
        console.log(gmap.streetView.heading, gmap.streetView.pitch);
      });    
    }
});