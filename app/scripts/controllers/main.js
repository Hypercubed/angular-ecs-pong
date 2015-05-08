/* global $:true */

'use strict';

angular.module('angularEcsPongApp')
  .controller('MainCtrl', function ($scope, ngEcs) {

    var main = this;

    main.game = ngEcs;

    main.message = function() {
      if (main.game.$playing) {
        return main.game.systems.collision.score;
      } else if (main.game.systems.collision.hiscore > 0) {
        return 'High Score: '+main.game.systems.collision.hiscore;
      } else {
        return 'Build using angular-ecs and';
      }
    };

    main.click = function() {
      if (ngEcs.$playing) {
        console.log('stop');
        ngEcs.$stop();
      } else {
        console.log('start');
        ngEcs.$start();
      }
    };

    ngEcs.$e('canvas', {  // canvas
      dom: {
        selector: '#canvas'
      },
      bbox: {}
    });

    ngEcs.$e({  // paddle
      dom: {
        selector: '#paddle'
      },
      bbox: {},
      position: {
        x: 0,
        y: 0
      },
      control: {}
    });

    var angle = Math.PI * Math.random(), power = 500;
    ngEcs.$e({  // ball
        dom: {
          selector: '#ball',
        },
        bbox: {},
        velocity: {
            x: power * Math.cos(angle), y: power * Math.sin(angle)
        },
        position: {
          x: 0,
          y: 0
        }
    });

    var angle = Math.PI * Math.random(), power = 500;
    ngEcs.$e({  // ball
        dom: {
          selector: '#ball2'
        },
        bbox: {},
        velocity: {
            x: power * Math.cos(angle), y: power * Math.sin(angle)
        },
        position: {
          x: 0,
          y: 0
        }
    });





  });
