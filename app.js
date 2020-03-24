var app = angular.module('slides', [
    'btford.socket-io',
    'slides.services.sockets',
]);
app.config([ '$locationProvider' , function ($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);
/*
app.config([ '$httpProvider' , function ($httpProvider) {
  $httpProvider.defaults.useXDomain = true ;
  delete $httpProvider.defaults.headers.common[ 'X-Requested-With' ];
}]);
*/
app.directive('slideshow', ['$compile', function($compile) {
  return {
    scope: {
      slides: '=slideshow'
    },
    link: function(scope, elem, attrs) {
      elem.addClass('slides');
      scope.$watch('slides', function(slides) {
        if (slides.length) {
          console.log("updating slides");
          for (var i = 0; i < scope.slides.length; i++) {
            var section = angular.element("<section>");
            section.attr("data-markdown", '');
            section.attr("data-separator", '^---$');
            var steps = scope.slides[i];
    
            if (steps.length == 1) {
              section.attr('ng-include', "'./slides/"+steps[0]+".html?raw=true'");
              $compile(section)(scope);
            } else {
              for (var j = 0; j < steps.length; j++) {
                var subSection = angular.element("<section>");
                if (j < steps.length - 1)
                  subSection.attr('data-autoslide', '1000');
                subSection.attr("data-markdown", '');
                subSection.attr("data-separator", '^---$');
                subSection.attr("ng-include", "'./slides/"+steps[j]+".html?raw=true'");
                $compile(subSection)(scope);
                section.append(subSection);
              }
            }
            elem.append(section);
          }
          if(Reveal.isReady()) {
            Reveal.sync();
          } else {
            Reveal.initialize({
              math: {
                //mathjax: "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js",
                mathjax: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js',
                config: 'TeX-AMS_HTML-full', // See http://docs.mathjax.org/en/latest/config-files.html
                // pass other options into `MathJax.Hub.Config()`
                TeX: { Macros: { RR: "{\\bf R}" } },
                tex2jax: {
                  inlineMath: [ ["\\(","\\)"] ],
                  displayMath: [ ['$$','$$'], ["\\[","\\]"] ],
                  //processEscapes: true
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
              dependencies: [
		        { src: './reveal.js/plugin/math/math.js', async: true },
                { src: './reveal.js/plugin/markdown/marked.js' },
                { src: './reveal.js/plugin/markdown/markdown.js' },
                { src: './reveal.js-plugins/broadcast/RTCMultiConnection.min.js'},
                { src: './reveal.js-plugins/broadcast/socket.io.js'},
                { src: './reveal.js-plugins/broadcast/bCrypt.js'},
                { src: './reveal.js-plugins/broadcast/broadcast.js'},
                //{ src: './reveal.js/plugin/highlight/highlight.js' },
                //{ src: '/static/js/reveal.js/plugin/notes/notes.js', async: true },
              ],
              hash: true,
              loop: false,
              transition: Reveal.getQueryHash().transition || 'none',
            });
          }
        }
      });
    }
  };
}]);

app.controller("MyController", ["$scope", "$location", "$http", function($scope, $location, $http) {
  $scope.slides = [];
  deck = $location.search().deck;
  console.log(deck);
  $http({
    method: 'GET',
    url: "./decks/"+deck+".json?raw=true"
  }).then(function success(response) {
      console.log(response);
      $scope.slides = response.data;
      console.log($scope.slides);
  }, function error(response) {
  });
}]);
