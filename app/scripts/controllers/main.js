'use strict';

angular.module('angularEcsPongApp')
  .controller('MainCtrl', function ($scope, ngEcs) {
    
    var main = this;
    
    main.game = ngEcs;
    
    main.click = function() {
      if (ngEcs.$playing) {
        console.log('stop');
        ngEcs.$stop();
      } else {
        console.log('start');
        ngEcs.$start();
      }
    }
    
    var angle = Math.PI * Math.random(), power = 500;
    
    ngEcs.$e({
      dom: {
        element: $('#paddle')
      },
      size: {},
      position: {
        x: 0,
        y: 0
      },
      control: {}
    });
    
    ngEcs.$e({
        dom: {
          element: $('#ball')
        },
        size: {},
        impulse: {
            x: power * Math.cos(angle), y: power * Math.sin(angle)
        },
        position: {
          x: 0,
          y: 0
        }
    });
    
  });
