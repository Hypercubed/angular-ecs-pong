/* global $:true */

'use strict';

angular
  .module('angularEcsPongApp')
  .run(function (ngEcs) {

  	ngEcs.$s('controls', {
  		keys: {},
  		$require: ['control','position'],
  		changeKey: function(e, v) {
  			this.keys[e.keyCode] = v;
  		},
  		$updateEach: function(e) {
  			if (this.keys[65] || this.keys[37]) {
  				e.position.x -= e.control.speed;
  			} else if (this.keys[68] || this.keys[39]) {
  				e.position.x += e.control.speed;
  			}
  		},
  		$added: function() {
  			var self = this;
        var doc = $(document);

        doc.keydown(function(e) {
  				self.changeKey(e||window.event, true);
  			});

        doc.keyup(function(e) {
  				self.changeKey(e||window.event, false);
  			});

  		}
  	});

    ngEcs.$s('dom', {
      $require: ['dom'],
      $addEntity: function(e) {
        e.dom.select(e.dom.selector);
      }
    });

  	ngEcs.$s('size', {
  		$require: ['dom','bbox'],
  		$addEntity: function(e) {
  			var ee = e.dom.$element;
  			e.bbox.width = ee.outerWidth();
  			e.bbox.height = ee.outerHeight();

        e.bbox.top = 0;
        e.bbox.left = 0;
        e.bbox.right = e.bbox.width;
        e.bbox.bottom = e.bbox.height;
  		}
  	});

    ngEcs.$s('bbox', {
      $require: ['position','bbox'],
      $updateEach: function(e) {
  			e.bbox.top = e.position.y;
        e.bbox.left = e.position.x;
        e.bbox.right = e.position.x+e.bbox.width;
        e.bbox.bottom = e.position.y+e.bbox.height;
  		}
    });

  	ngEcs.$s('velocity', {
  		$require: ['velocity','position'],
  		$updateEach: function(e, dt) {
  			e.position.x += e.velocity.x*dt;
        e.position.y += e.velocity.y*dt;
  		}
  	});

  	ngEcs.$s('updatePosition', {
  		$require: ['position','dom'],
  		$addEntity: function(e) {
  			var ee = e.dom.$element;
  			var p = ee.position();

  			e.position.x = p.left;
  			e.position.y = p.top;
  		},
      $started: function() {
        this.$family.forEach(function(e) {
          var ee = e.dom.$element;
          var w = ee.width();
          var h = ee.height();

          ee.css('top', 0);
          ee.css('left', 0);
          ee.css('right', 'auto');
          ee.css('bottom', 'auto');
          ee.width(w);
          ee.height(h);
          ee.css('position', 'absolute');
        });
      },
  		$render: function() {  // todo: render each?
  			this.$family.forEach(function(e) {
          e.dom.$element.css('Transform', 'translate3d(' + ~~(e.position.x) + 'px, ' + ~~(e.position.y) + 'px, 0)');
  			});
  		}
  	});

  	ngEcs.$s('collision', {
  		score: 0,
      hiscore: 0,
      screen: null,
      balls: null,
      players: null,
      miss: false,
      hit: false,
      $added: function() {
        this.balls = ngEcs.families['position::velocity'];
        this.players = ngEcs.families['control::position'];
      },
  		$started: function() {
        this.screen = ngEcs.entities['canvas'];
  		},
  		$update: function() {

        var screenBox = this.screen.bbox;

        // area bounds
        var leftWall = screenBox.left;
        var rightWall = screenBox.right;

        var ball, i = 0, ilen = this.balls.length;
        var player, j = 0, jlen = this.players.length;

        // player-wall
        for (j = 0;j < jlen; j++) {
          player = this.players[j];

          // paddle LR bounds
          if (player.bbox.right > rightWall ) {
            player.position.x = rightWall - player.bbox.width;
          } else if (player.bbox.left < leftWall) {
            player.position.x = leftWall;
          }
        }

        for (i = 0;i < ilen; i++) {
          ball = this.balls[i];

          var miss = false;

          // ball-players
          for (j = 0;j < jlen; j++) {
            player = this.players[j];

            var hit = false;

            // ball - paddle
            var overlapY = ball.bbox.overlapY(player.bbox);
      			if (overlapY > 0) {
              var overlapX = ball.bbox.overlapX(player.bbox);
      				if (overlapX > 0) {

                ball.velocity.y = -Math.abs(ball.velocity.y);

                var f = overlapX/ball.bbox.width;
                if (f < 1) {
                  if (ball.bbox.left < player.bbox.left) {
                    ball.velocity.x = -Math.abs(ball.velocity.x);
                  } else {
                    ball.velocity.x = Math.abs(ball.velocity.x);
                  }
                }

                if (ball.velocity.mag() < 1200) {
                  ball.velocity.scale(1.1);
                }

      					ball.position.y -= overlapY+10;
      					this.score++;
                this.hiscore = Math.max(this.score, this.hiscore);
                hit = true;
      				}
      			}

            this.hit = hit ? true : this.hit;

          }

          // ball - top/bottom
          if (ball.bbox.top < screenBox.top) {
            ball.velocity.y = Math.abs(ball.velocity.y);
            ball.position.y = screenBox.top;
          } else if (ball.bbox.bottom > screenBox.bottom) {
            ball.velocity.y = -Math.abs(ball.velocity.y);
            ball.position.y = screenBox.bottom-ball.bbox.height;
            miss = true;
          }

          // ball - left/right
          if (ball.bbox.right > rightWall) {
            ball.velocity.x = -Math.abs(ball.velocity.x);
            ball.position.x = screenBox.right-ball.bbox.width;
          } else if (ball.bbox.left < leftWall) {
            ball.velocity.x = Math.abs(ball.velocity.x);
            ball.position.x = screenBox.left;
          }

          if (miss) {
            this.misses++;
            this.score = 0;
            ball.velocity.norm().scale(500);
          }

          this.miss = miss ?  true : this.miss;

        }

  		},
      $render: function() {
        this.screen.dom.$element.css('background-color', this.miss ? '#FF5858' : '#eee');
        this.players[0].dom.$element.css('background-color', this.hit ? '#FF5858' : '#5CB85C');

        this.miss = false;
        this.hit = false;
      }
  	});

  });
