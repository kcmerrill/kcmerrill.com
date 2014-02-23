'use strict';

/* Controllers */
angular.module('chronicles.controllers', [])
.controller('AdminCtrl', function($scope, Chronicles, $http){
    $scope.mode = 'Admin';
    $scope.chronicles = Chronicles;
    $scope.mode = 'Admin';

    $scope.create = function(){
        $scope.mode = 'Create';
        $scope.chronicles.blank();
    };

    $scope.layout = function(layout, icon_class){
        $scope.chronicles.current.layout = layout;
        $scope.chronicles.current.thumbnail.icon.class = icon_class;
    }

    $scope.save = function(){
        $scope.chronicles.save();
    }
})
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
        return Chronicles.index != (Chronicles.timeline.length - 1);
    }
})
.controller('ChronicleCtrl', function($scope, angulargmContainer, $location, $routeParams, Chronicles, Channels) {
    /* Setting up my scope variables */
    $scope.chronicles = Chronicles;
    $scope.channels = Channels;
    $scope.path = $location.path().replace('/','');
    $scope.view = _.isEmpty($scope.chronicles.current) ? 'partials/loading.html' : 'partials/' + $scope.chronicles.current + '.html';

    /* Default to the bio */
    var chronicle_id = $scope.path != 'loading' && !_.isEmpty($scope.path) ? $scope.path.replace('/','') : 'bio';

    /* Fetch the current chronicle */
    $scope.fetch = function(chronicle_id){
        $scope.chronicles.fetch(chronicle_id, true, false, function(){});
    };

    /* Change the channel */
    $scope.nextChannel = function(){
        $scope.chronicles.fetchTimeline($scope.channels.next());
    };

    $scope.previousChannel = function(){
        $scope.chronicles.fetchTimeline($scope.channels.previous());
    };

    /* Giddy up! */
    $scope.chronicles.init(function(){
        $scope.view = 'partials/bio/basic.html';
        $scope.fetch(chronicle_id);
    });

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
        //console.log(gmap.center);
        //console.log('lat:' + gmap.center.ob, 'Long:' + gmap.center.pb);
        return true;
        var pov = {
            heading: 34,
            pitch: 10
        };
        var panorama = new google.maps.StreetViewPanorama(document.getElementById('myMap'),pov);
        gmap.setStreetView(panorama);
        //console.log(gmap.streetView.heading, gmap.streetView.pitch);
      });
    }
});
