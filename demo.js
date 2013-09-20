document.onreadystatechange = function() {
  if (document.readyState === 'complete') {

    // plot values
    var values = new Scope({
      el: '.values',
      period: 50,
      style: 'line'
    });
    
    setInterval(function(){
      var x = new Date().getTime();
      values.set(Math.round(Math.sin(x/5)*100, 2));
    }, 250);

    // count events
    var counts = new Scope({
      el: '.counts',
      period: 50
    });

    setInterval(function(){
      var x = new Date().getTime();
      counts.count(Math.random());
    }, 200);

    // capture samples
    var samples = new Scope({
      el: '.samples', 
      period: 25,
      style: 'bar'
    });
    
    var velo = false;
    document.addEventListener(
      'mousemove',
      function(e){ 
        var z = e.screenX;
        if(!velo){
          velo = z;
        }
        if(velo){
          samples.set(Math.abs(velo - z));
        }
      });

    // plot values
    var timeseries = new Scope({
      el: '.timeseries',
      points: 50
    });

    setInterval(function(){
      var vals = [];
      for(var i = 0; i<50; i++){
        vals[i] = Math.floor(Math.random() * 10);
      }
      timeseries.set(vals);
    }, 1000);

  }
};
