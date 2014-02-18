'use strict';

/* Directives */


angular.module('chronicles.directives', [])
.directive('markdown', function () {
    var converter = new Showdown.converter();
    return {
        restrict: 'AE',        
        link: function (scope, element, attrs) {
            attrs.$observe('markdown', function(value){
                var htmlText = converter.makeHtml(value);
                element.html(htmlText);
            });
        }
    };

})
.directive('newlines', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.html(element.text().replace(/\n/g, '<br />'));
        }
    };

});

