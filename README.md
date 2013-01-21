console.chart
=============

A chrome extension that adds a function console.chart() that graphs to a chart into a new Developer Tools Panel. It is a visual representation of some quantity for debugging purposes.


For example, this adds 10,000 random numbers to an array and sorts them, 100 times, logging the time it takes to do so.
```javascript
    var array = [];
    for (var i=0; i<100; i++) {
        var date = Date.now();
        for (var j=0; j<10000; j++) {
            array.push(Math.floor(Math.random()*10));
        }
        array.sort();
        console.chart(Date.now()-date);
    }
```
It will look something like this (pretty to come):
![Chart example](https://raw.github.com/gitpullgravity/console.chart/master/imgs/sample.png)


Note: It currently has a memory leak, most likely due to the unchecked setInterval in the charter.js file that continues after the devtools panel loses focus. I'm still investigating it.

To do:
- Fix that leak :( 
- Add grid lines to axis
- Support for multiple chart lines, so you might be able to do console.chart({"red": 3}, {"blue":5})
- Add viewfinder for honing in on a specific range (like here: http://nvd3.org/ghpages/lineWithFocus.html )

