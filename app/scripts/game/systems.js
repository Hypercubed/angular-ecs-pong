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
  			}); // todo: move to system.$added signal

        doc.keyup(function(e) {
  				self.changeKey(e||window.event, false);
  			});

  		}
  	});

  	ngEcs.$s('size', {
  		$require: ['dom','size'],
  		$addEntity: function(e) {
  			var ee = $(e.dom.element);
  			e.size.width = ee.outerWidth();
  			e.size.height = ee.outerHeight();
  		}
  	});

  	ngEcs.$s('impulse', {
  		$require: ['impulse','position'],
  		$updateEach: function(e, dt) {
  			e.position.x += e.impulse.x*dt;
        e.position.y += e.impulse.y*dt;
  		}
  	});

  	ngEcs.$s('updatePosition', {
  		$require: ['position','dom'],
  		$addEntity: function(e) {

  			var c = $('.jumbotron');

  			var width = c.width();
  			var height = c.height();
  			c.width(width);
  			c.height(height);

  			//console.log(c.height());

  			var ee = $(e.dom.element);
  			var p = ee.position();
  			var w = ee.width();
  			var h = ee.height();

  			e.position.x = width/2-w/2;
  			e.position.y = p.top;

  			ee.css('top', 0);
  			ee.css('left', 0);
  			ee.css('right', 'auto');
  			ee.css('bottom', 'auto');
  			ee.width(w);
  			ee.height(h);
  			ee.css('position', 'absolute');

  			this.$render();
  		},
  		$render: function() {  // todo: render each?
  			this.$family.forEach(function(e) {
  	          $(e.dom.element).css('Transform', 'translate3d('
                  + ~~(e.position.x) + 'px, '
                  + ~~(e.position.y) + 'px, 0)');
  			});
  		}
  	});

  	ngEcs.$s('collision', {
  		score: 0,
      screen: null,
      width: null,
      height: null,
      $added: function() {
        this.balls = ngEcs.families['impulse::position'];
        this.players = ngEcs.families['control::position'];
      },
  		$started: function() {
  			this.screen = $('#canvas');
  			this.width = this.screen.outerWidth();
  			this.height = this.screen.outerHeight();
  		},
  		$update: function() {

  			var miss = false;

  			var ball = this.balls[0];
  			var player = this.players[0];

        // paddle bounds
        var leftWall = 10;
        var rightWall = this.width - 10;

  			var paddleLeft = player.position.x;
  			var paddleRight = player.position.x + player.size.width;
        var paddleTop = player.position.y;

        //console.log(paddleLeft, paddleRight, this.width);

  			// paddle LR bounds
  			if (paddleRight > rightWall ) {
  				player.position.x = rightWall - player.size.width;
  			} else if (paddleLeft < 10) {
  				player.position.x = 10;
  			}

        var ballLeft = ball.position.x;
        var ballRight = ball.position.x + ball.size.width;
        var ballTop = ball.position.y;
        var ballBottom = ball.position.y+ball.size.height;

        var overlapY = ballBottom - paddleTop;
  			if (overlapY > 0) {
  				if (ballRight > paddleLeft && ballLeft < paddleRight) {

  					ball.impulse.y = -1.1*Math.abs(ball.impulse.y);
  					ball.impulse.x = 1.2*ball.impulse.x;

  					ball.position.y -= overlapY;
  					this.score++;
  				}
  			}

  			if (ballTop < 10) {
  				ball.impulse.y = Math.abs(ball.impulse.y);
  			} else if (ballBottom > this.height) {
  				ball.impulse.y = -Math.abs(ball.impulse.y);
  				miss = true;
  			}

  			if (ballRight > rightWall) {
  				ball.impulse.x = -Math.abs(ball.impulse.x);
  			} else if (ballLeft < 10) {
  				ball.impulse.x = Math.abs(ball.impulse.x);
  			}

  			this.screen.css('background-color', miss ? '#FF5858' : '#eee');
  			if (miss) {
  				this.misses++;
  				this.score = 0;
  				miss = false;
  				var r = Math.sqrt(ball.impulse.x*ball.impulse.x+ball.impulse.y*ball.impulse.y);
  				ball.impulse.x = 500*ball.impulse.x/r;
  				ball.impulse.y = 500*ball.impulse.y/r;
  			}

  		}
  	});

  });
