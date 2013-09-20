# Scope

Simple Realtime Charting

See examples in operation at http://simonswain.github.io/scope/index.html

Get Scope on here or via `bower install scope`.

Built for modern browsers, uses HTML Canvas and has no dependencies.

Make a new chart and pass in values as they occur, or as an array of
points to render. Scope takes care of the rest.

## Usage

```javascript
var values = new Scope({
  el: element selector (required),
  period: sampling period in ms (default 1000),
  points: how many points to record (default same as chart width),
  style: chart style, 'line' or 'bar',
  background: background color (default #111111),
  values: chart color (default #00ffff)
});
```

```javascript
values.set(n); // Latch n on to sampler, to be charted next period.
values.set([...]); // Set array of values, trigger redraw and stop auto redraw. Use null to draw nothing on a point.
values.count(); // Add one to count of events to be charted next period.
values.count(n); // Count n events with one call.
```

## Examples

Basics
```
<div class="scope sample"></div>

.scope {
    margin: 8px 0;
    width: 200px;
    height: 100px;
}

var sample = new Scope({
  el: '.values'
});
```

Simple value chart
```javascript
var values = new Scope({
  el: '.values',
  period: 50,
  style: 'line'
});

setInterval(function(){
  var x = new Date().getTime();
  values.set(Math.round(Math.sin(x/5)*100, 2));
}, 250);
```

Count events per period
```javascript
var counts = new Scope({
  el: '.counts',
  period: 50
});

setInterval(function(){
  var x = new Date().getTime();
  counts.count(Math.random());
}, 200);
```

Timeseries data from array
```javascript
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
```

Sample values from mouse velocity
```javascript
var last = false;
document.addEventListener(
  'mousemove',
  function(e){ 
    var z = e.screenX;
    if(!last){
      last = z;
    }
    samples.set(Math.abs(z - last));
    last = z;
  });
```