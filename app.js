function init_reveal() {
            Reveal.initialize({
              math: {
                //mathjax: "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js",
                mathjax: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js',
                config: 'TeX-AMS_HTML-full', // See http://docs.mathjax.org/en/latest/config-files.html
                // pass other options into `MathJax.Hub.Config()`
                TeX: { Macros: { RR: "{\\bf R}" } },
                tex2jax: {
                  //inlineMath: [ ["\\(","\\)"] ],
                  inlineMath: [ ['$','$'], ["\\(","\\)"] ],
                  displayMath: [ ['$$','$$'], ["\\[","\\]"] ],
                  processEscapes: true
                },
              },
    broadcast: {
      secret: '$2a$05$hhgakVn1DWBfgfSwMihABeYToIBEiQGJ.ONa.HWEiNGNI6mxFCy8S',
      // Configure RTCMultiConnection
      connection: {
        socketURL: 'https://revealjs-broadcast.herokuapp.com/',
        session: {
        audio: true,
        video: true,
        oneway: true
        },
      },
    }, 
    keyboard: {
        83: function() {
            var password = prompt("Please enter broadcast password", "");
            RevealBroadcast.start( { id: 'aashjkxcvyiuqwbljdv', password: password } );
        },  // create broadcast when 's' is pressed
        65: function() {
            RevealBroadcast.connect( { id: 'aashjkxcvyiuqwbljdv' } );
        },  // connect to broadcast when 'a' is pressed
    },
    anything: [ 
        {
          className: "question", 
        }],

              dependencies: [
		        { src: './reveal.js/plugin/math/math.js', async: true },
                { src: './reveal.js-plugins/anything/anything.js' },
                { src: './reveal.js/plugin/markdown/marked.js' },
                { src: './reveal.js/plugin/markdown/markdown.js' },
                  /*
                { src: './reveal.js-plugins/broadcast/RTCMultiConnection.min.js'},
                { src: './reveal.js-plugins/broadcast/socket.io.js'},
                { src: './reveal.js-plugins/broadcast/bCrypt.js'},
                { src: './reveal.js-plugins/broadcast/broadcast.js'},
                */
                //{ src: './reveal.js/plugin/highlight/highlight.js' },
                //{ src: '/static/js/reveal.js/plugin/notes/notes.js', async: true },
              ],
              hash: true,
              loop: false,
              //transition: Reveal.getQueryHash().transition || 'none',
            });
}
var app = angular.module('slides', [
    'btford.socket-io',
    'slides.services.sockets',
    'ngRoute',
]);
app.controller("myctrl", ["$scope", "$location", "$http", "$routeParams", function($scope, $location, $http, $routeParams) {
    console.log("main controller");
    //do nothing
}]);
app.config([ '$locationProvider' , function ($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: true
    });
}]);
app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/#:deck', {
            templateUrl: 'index.html',
            controller: 'myctrl'
            });
}]);
app.config([ '$httpProvider' , function ($httpProvider) {
  $httpProvider.defaults.useXDomain = true ;
  delete $httpProvider.defaults.headers.common[ 'X-Requested-With' ];
}]);
app.directive('slideshow', ['$compile', function($compile) {
  return {
    bindToController: {
      sections: '@',
      src: '@',
      collection: '@'
    },
    replace: true,
    template: '<slide-section ng-replace="section in sections"></slide-section>',
    controller: ["$scope", "$location", "$http", function($scope, $location, $http) {
      console.log("slideshow controller");
      $scope.slides = [];
      var hash_parts = $location.hash().split("/");
      var deck = hash_parts[0] ? hash_parts[0] : hash_parts[1];
      $scope.deck = deck;
      console.log(deck);
      setTimeout(function() {
        $http({
          method: 'GET',
          url: "./decks/"+$scope.deck+".json?raw=true"
        }).then(function success(response) {
            console.log(response);
            console.log($scope.slides);
            if (typeof(response.data.collection) !== 'undefined') {
              $scope.collection = response.data.collection;
            }
            $scope.sections = response.data.slides;
            $scope.src = $scope.sections.map(function(section) {return section.map(function(slide) {return get_slide_src(slide,$scope.collection)})});
            console.log($scope.sections);
            console.log($scope.src);
            //$compile(element)($scope);
        }, function error(response) {
            $scope.slides = [];
            console.error(response);
        });
      },1000);
    }],
    link: ["$location", function(scope, elem, attr, $location) {
      //elem.addClass('slides');
    }],
  };
}]);
app.directive("slidesSection", function() {
  return {
    templateUrl: './templates/section.html',
    replace: true,
    scope: { section='@'},
    controller: ["$scope", function($scope) {
        console.log("slides-section directive called");
        console.log($scope.slides);
        console.log($scope.collection);
    }],
  };
})
app.directive("slide", function() {
  return {
    templateUrl: './templates/slide.html',
    replace: true,
    require: '^slidesSection',
    scope: true,
    controller: ["$scope", function($scope) {
        console.log("slide directive called");
        console.log($scope.slides);
        console.log($scope.collection);
    }],
  };
})
