// Scope.js 0.0.1
// (c) 2013 Simon Swain
// Scope may be freely distributed under the MIT license.
// https://github.com/simonswain/scope

(function(){

  var Scope = function(options, data){
    
    var self = this;
    if(typeof options === undefined){
      options = {};
    }

    var opts = {
      el: options.el,
      // how many ms each datum spans
      period: options.period || 1000,

      // how many points in the chart
      points: options.points || false,

      // bar, line
      style: options.style || 'bar',

      background: options.background || '#111111',
      values: options.values || '#00ffff',
      labels: options.labels || false,
      grid: options.grid || false 
    };

    var canvas = function(){
      var el = document.querySelector(opts.el);
      self.width = el.offsetWidth;
      self.height = el.offsetHeight;
      var paper = document.createElement("canvas");
      paper.setAttribute("width", self.width);
      paper.setAttribute("height", self.height);
      el.appendChild(paper);
      self.ctx = paper.getContext("2d");
    };

    var reset = function(){
      self.latch = 0;
      self.points = (opts.points) ? opts.points : self.width;
      self.data = [];
      for(var i = 0; i < self.points; i++){
        self.data[i] = null;
      }
      self.time = new Date().getTime();
      self.next = 0;
      self.active = true;
    };

    var render = function(){

      var i;
      var data = self.data;
      var min = Infinity;
      var max = -Infinity;
      var x, y, xp, yp;

      for(i = 0; i < self.points; i++){
        if (data[i] > max) { 
          max = data[i];
        }
        if (data[i] < min) { 
          min = data[i];
        }
      }   

      var xf = self.width / self.points;

      var yf = self.height/ (max - min);
      if(max - min === 0){
        yf = 1;
      }

      self.ctx.clearRect(0, 0, self.width, self.height);
      self.ctx.fillStyle = opts.background;
      self.ctx.fillRect(0, 0, self.width, self.height);
      
      if(opts.style === 'line'){
        var start = 0;
        for(i = 0; i < self.points; i++){
          if(data[i] !== null) {
            xp = i * xf;
            yp = self.height - ((data[i] - min) * yf);
            self.ctx.beginPath();
            self.ctx.moveTo(xp, yp);
            start = i;
            break;
          }
        }

        for(i = start; i < self.points; i++){
          if(data[i] === null) {
            continue;
          }
          x = i * xf;
          y = self.height- ((data[i] - min) * yf);
          //if(y !== yp && x !== xp){
            self.ctx.lineTo(x, y);
          //}
          //xp = x;
          //yp = y;
        }

        self.ctx.strokeWidth = 1;
        self.ctx.strokeStyle = opts.values;
        self.ctx.stroke();
      }

      if(opts.style === 'bar'){
        self.ctx.fillStyle = opts.values;
        for(i = 0; i < self.points; i++){
          if(data[i] === null) {
            continue;
          }
          x = i * xf;
          y = self.height - ((data[i] - min) * yf);
          self.ctx.fillRect(x, y, xf, self.height - y);
        }
      }

      if(self.active){
        setTimeout(render, 100);
      }

    };

    var update = function(){

      if(new Date().getTime() > self.next){
        self.data.push(self.latch);

        while(self.data.length > self.points){
          self.data.shift();
        }

        self.latch = null;

        self.next = self.time + opts.period;
      }
      
      if(self.active){
        setTimeout(update, opts.period);
      }

    };

    this.set = function(val){
      // array of data supplied
      if(typeof val === 'object' && typeof val.length !== 'undefined'){
        self.data = val;
        self.active = false;
        render();
        return;
      }

      // sample and hold single value
      val = Number(val);
      if(!isNaN(val)){
        self.latch = Number(val);
      }
    };

    this.count = function(val){
      // add to event count
      val = Number(val);
      if(!isNaN(val)){
        self.latch = self.latch + Number(val);
      }
    };

    canvas();
    reset();
    update();
    render();

    return this;
  };

  window.Scope = Scope;

}).call(this);
