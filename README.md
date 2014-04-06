# Frames based D3
D3 is very well optimized at animating SVG. What D3 is less good at is speeding up och slowing down an existing animation.
This originated from the need of a way to get each and every frame from D3 transitions in a controlled manner, but as fast as possible. This way it's possible to capture the individual frames at a given frame rate. E.g. with the help of [PhantomJS](http://phantomjs.org/) and [FFmpeg](http://www.ffmpeg.org/) to create an exported rasterized movie.

### Options
**Frame rate** - How many frames per seconds should be generated
```javascript
d3.timer.frameRate = 1000 / 60
//Defaults to 1000 / 60 (60 frames / second)
```

**Render rate** - How long wait time in between each frame
```javascript
d3.timer.renderRate = 0
//Defaults to 0 - as fast as possible
```

### Timer events
```javascript
d3.timer.on("start", function(frameNo) { /* Animation start */ });
d3.timer.on("frame", function(frameNo) { /* Frame rendered */ });
d3.timer.on("end",   function(frameNo) { /* Animation end */ });
```

### PhantomJS rasterization example
```javascript
var webpage = require("webpage"),
    page    = webpage.create();

page.open("./chart.html", function() {
	page.onCallback = function(event, frameNo) {
		if (event == "frame") {
			page.render("frame-" + frameNo + ".jpg", { format: "jpg", quality: 100 });
		}
		else {
			phantom.exit();
		}
	};
	page.evaluate(function(fps) {
		d3.timer.on("frame", function(frameNo) { window.callPhantom("frame", frameNo); });
		d3.timer.on("end",   function(frameNo) { window.callPhantom("end",   frameNo); });

		// Init D3 and start animating
	});
})
```

# Data-Driven Documents

<a href="http://d3js.org"><img src="http://d3js.org/logo.svg" align="left" hspace="10" vspace="6"></a>

**D3.js** is a JavaScript library for manipulating documents based on data. **D3** helps you bring data to life using HTML, SVG and CSS. D3’s emphasis on web standards gives you the full capabilities of modern browsers without tying yourself to a proprietary framework, combining powerful visualization components and a data-driven approach to DOM manipulation.

Want to learn more? [See the wiki.](https://github.com/mbostock/d3/wiki)

For examples, [see the gallery](https://github.com/mbostock/d3/wiki/Gallery) and [mbostock’s bl.ocks](http://bl.ocks.org/mbostock).
