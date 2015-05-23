"use strict";angular.module("angularEcsPongApp",["ngAnimate","ngRoute","ngSanitize","ngTouch","hc.ngEcs"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl",controllerAs:"main"}).when("/about",{templateUrl:"views/about.html",controller:"AboutCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("angularEcsPongApp").run(["ngEcs",function(a){function b(){this.x=0,this.y=0}function c(){this.selector=null,this.$element=null}function d(){this.width=this.height=0,this.top=this.right=this.bottom=this.left=0}b.prototype.scale=function(a){return this.x*=a,this.y*=a,this},b.prototype.mag=function(){return Math.sqrt(this.x*this.x+this.y*this.y)},b.prototype.norm=function(){var a=this.mag();return this.x/=a,this.y/=a,this},c.prototype.select=function(a){this.selector=a,this.$element=angular.element(a)},d.prototype.overlapY=function(a){return Math.max(0,Math.min(this.bottom,a.bottom)-Math.max(this.top,a.top))},d.prototype.overlapX=function(a){return Math.max(0,Math.min(this.right,a.right)-Math.max(this.left,a.left))},a.$c("position",b),a.$c("velocity",b),a.$c("bbox",d),a.$c("dom",c),a.$c("control",{speed:10})}]),angular.module("angularEcsPongApp").run(["ngEcs",function(a){a.$s("controls",{keys:{},$require:["control","position"],changeKey:function(a,b){this.keys[a.keyCode]=b},$updateEach:function(a){this.keys[65]||this.keys[37]?a.position.x-=a.control.speed:(this.keys[68]||this.keys[39])&&(a.position.x+=a.control.speed)},$added:function(){var a=this,b=$(document);b.keydown(function(b){a.changeKey(b||window.event,!0)}),b.keyup(function(b){a.changeKey(b||window.event,!1)})}}),a.$s("dom",{$require:["dom"],$addEntity:function(a){a.dom.select(a.dom.selector)}}),a.$s("size",{$require:["dom","bbox"],$started:function(){this.$family.forEach(function(a){var b=a.dom.$element;a.bbox.width=b.width(),a.bbox.height=b.height(),a.bbox.top=0,a.bbox.left=0,a.bbox.right=a.bbox.width,a.bbox.bottom=a.bbox.height,b.width(a.bbox.width),b.height(a.bbox.height),b.css("padding",0)})}}),a.$s("bbox",{$require:["position","bbox"],$updateEach:function(a){a.bbox.top=a.position.y,a.bbox.left=a.position.x,a.bbox.right=a.position.x+a.bbox.width,a.bbox.bottom=a.position.y+a.bbox.height}}),a.$s("velocity",{$require:["velocity","position"],$updateEach:function(a,b){a.position.x+=a.velocity.x*b,a.position.y+=a.velocity.y*b}}),a.$s("updatePosition",{$require:["position","dom"],$started:function(){this.$family.forEach(function(a){var b=a.dom.$element,c=b.position();a.position.x=c.left,a.position.y=c.top}),this.$family.forEach(function(a){var b=a.dom.$element,c=b.width(),d=b.height();b.css("top",0),b.css("left",0),b.css("right","auto"),b.css("bottom","auto"),b.css("padding",0),b.width(c),b.height(d),b.css("position","absolute")})},$render:function(){this.$family.forEach(function(a){a.dom.$element.css("Transform","translate3d("+~~a.position.x+"px, "+~~a.position.y+"px, 0)")})}}),a.$s("collision",{score:0,hiscore:0,screen:null,balls:null,players:null,miss:!1,hit:!1,$added:function(){this.balls=a.$f(["position","velocity"]),this.players=a.$f(["control","position"])},$started:function(){this.screen=a.entities.canvas},$update:function(){var a,b,c=this.screen.bbox,d=c.left,e=c.right,f=0,g=this.balls.length,h=0,i=this.players.length;for(h=0;i>h;h++)b=this.players[h],b.bbox.right>e?b.position.x=e-b.bbox.width:b.bbox.left<d&&(b.position.x=d);for(f=0;g>f;f++){a=this.balls[f];var j=!1;for(h=0;i>h;h++){b=this.players[h];var k=!1,l=a.bbox.overlapY(b.bbox);if(l>0){var m=a.bbox.overlapX(b.bbox);if(m>0){a.velocity.y=-Math.abs(a.velocity.y);var n=m/a.bbox.width;1>n&&(a.bbox.left<b.bbox.left?a.velocity.x=-Math.abs(a.velocity.x):a.velocity.x=Math.abs(a.velocity.x)),a.velocity.mag()<1200&&a.velocity.scale(1.1),a.position.y-=l+10,this.score++,this.hiscore=Math.max(this.score,this.hiscore),k=!0}}this.hit=k?!0:this.hit}a.bbox.top<c.top?(a.velocity.y=Math.abs(a.velocity.y),a.position.y=c.top):a.bbox.bottom>c.bottom&&(a.velocity.y=-Math.abs(a.velocity.y),a.position.y=c.bottom-a.bbox.height,j=!0),a.bbox.right>e?(a.velocity.x=-Math.abs(a.velocity.x),a.position.x=c.right-a.bbox.width):a.bbox.left<d&&(a.velocity.x=Math.abs(a.velocity.x),a.position.x=c.left),j&&(this.misses++,this.score=0,a.velocity.norm().scale(500)),this.miss=j?!0:this.miss}},$render:function(){this.screen.dom.$element.css("border-bottom-color",this.miss?"#FF5858":"#eee"),this.players[0].dom.$element.css("background-color",this.hit?"#FF5858":"#5CB85C"),this.miss=!1,this.hit=!1}})}]),angular.module("angularEcsPongApp").controller("MainCtrl",["$scope","ngEcs",function(a,b){var c=this;c.game=b,b.$fps=50,c.message=function(){return c.game.$playing?c.game.systems.collision.score:"angular-ecs-pong"},c.hiscore=function(){return c.game.$playing?"High Score: "+c.game.systems.collision.hiscore:"Built using angular-ecs<br>and"},c.click=function(a){a.target.blur(),b.$playing?(console.log("stop"),b.$stop()):(console.log("start"),b.$start())},b.$e("canvas",{dom:{selector:"#canvas"},bbox:{}}),b.$e({dom:{selector:"#paddle"},bbox:{},position:{x:0,y:0},control:{}});var d=Math.PI*Math.random(),e=500;b.$e({dom:{selector:"#ball"},bbox:{},velocity:{x:e*Math.cos(d),y:e*Math.sin(d)},position:{x:0,y:0}}),d=Math.PI*Math.random(),e=500,b.$e({dom:{selector:"#ball2"},bbox:{},velocity:{x:e*Math.cos(d),y:e*Math.sin(d)},position:{x:0,y:0}})}]),angular.module("angularEcsPongApp").controller("AboutCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]);