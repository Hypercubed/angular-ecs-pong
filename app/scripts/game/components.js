'use strict';

angular
  .module('angularEcsPongApp')
  .run(function (ngEcs) {

  	function Point() {
  		this.x = 0;
  		this.y = 0;
  	}

  	function Dom() {
  		this.element = null;
  	}

  	ngEcs.$c('position', Point);
  	ngEcs.$c('impulse', Point);

  	ngEcs.$c('dom', Dom);
  	ngEcs.$c('control', {
  		speed: 10
  	});
  	ngEcs.$c('size', {
  		height: 0,
  		width: 0
  	});

  });
