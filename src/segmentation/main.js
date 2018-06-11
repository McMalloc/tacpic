var width = 848;
var height = 477;

var imageData = new GrayImageData(5, 5);
console.dir(imageData);
console.dir(imageData.getNeighbors(2,2,3));



function init() {
	drawMask();
	console.log("start segmentation");
	// PFSegmentation(
	slicSegment()
	$("#rerender-edges").click(function() {
		detectEdges('target', 'edges');
	})
	$("#pf-segment").click(function() {
		pfSegment();
	})
	$("#slic-rerender").click(function() {
		slicSegment();
	})
}

var slicSegment = function() {
	SLICSegmentation(
		getImageData(), 
		null,
		{
			minRegionSize : $("#minRegionSize-input").val(),
			minSize : $("#minSize-input").val(),
			regionSize : $("#regionSize-input").val(),
			callback: function(result) {
				callbackSegmentation(result);
				drawIndexMap(result);
				drawSegments(result);
				updateClusters(result, document.getElementById('mask').getContext('2d').getImageData(0,0,width,height));
				labelUnknown(result)
				renderResults(result);
				console.log("finished");
				detectEdges('target', 'edges');
			}
    });
}

var pfSegment = function() {
	PFSegmentation(
		getImageData(), 
		document.getElementById('mask').getContext('2d').getImageData(0,0,width,height),
		{
			sigma : 1,
			threshold : 500,
			minSize : 100,
			callback: function(result) {
				callbackSegmentation(result);
				drawIndexMap(result);
				drawSegments(result);
				updateClusters(result, document.getElementById('mask').getContext('2d').getImageData(0,0,width,height));
				labelUnknown(result)
				renderResults(result);
				console.log("finished");
				// detectEdges('target', 'edges');
			}
    });
}

var detectEdges = function(source, target, ht, lt, sigma, kernelSize) {
	var srcCanvas = document.getElementById('target');
	var targetCanvas = document.getElementById('edges');
	
	// var canny = CannyJS.canny(
		// srcCanvas,
		// $("#ht-input").val(),
		// $("#lt-input").val(),
		// $("#sigma-input").val(),
		// $("#kernelsize-input").val()
	// );
	
	var imageData = new GrayImageData(width, height)
	// load image data from canvas
	imageData.loadCanvas(srcCanvas);
	
	// var blurred = CannyJS.gaussianBlur(imageData, $("#sigma-input").val(), $("#kernelsize-input").val());
	// var sobel = CannyJS.sobel(blurred);
	// var nms = CannyJS.nonMaximumSuppression(sobel);
	var hysteresis = CannyJS.hysteresis(imageData, $("#ht-input").val(), $("#lt-input").val());
	hysteresis.drawOn(targetCanvas);
}

var drawSegments = function(result) {
	var canvas = document.getElementById("segments");
    var context = canvas.getContext('2d');
	_.each(result.segments, function(segment, index) {
		var colorString = "#"
			+ parseInt(segment.mp[0])
			+ parseInt(segment.mp[1])
			+ parseInt(segment.mp[2]);
		context.fillStyle = colorString;
		context.fillRect(
			segment.min_x,
			segment.min_y,
			segment.max_x,
			segment.max_y);
	})
}

var drawIndexMap = function(result) {
	var maxIndex = d3.max(result.indexMap);
	var minIndex = d3.min(result.indexMap);
	
	var mapGrey = d3.scaleLinear()
		.domain([minIndex, maxIndex])
		.range([0, 255]);

	var rgbArray = [];
	result.indexMap.forEach(function(index) {
		for (var i = 0; i < 4; i++) {
			rgbArray.push(mapGrey(index));
		}
	})
	
	var indexMapGrey = new Uint8ClampedArray(rgbArray);
	var indexImageData = new ImageData(indexMapGrey, width, height);
	
	drawOnCanvas("indexmap", indexImageData);
}

var drawOnCanvas = function(id, data) {
	var output_canvas = document.getElementById(id);
    var context = output_canvas.getContext('2d');
	context.putImageData(data, 0, 0);
}

var callbackSegmentation = function(results) {
        results.segments = {};

        var w = width,
            h = height;
            l = results.indexMap.length;
			
        for (var i = 0; i < l; ++i) {
            var current = results.indexMap[i];
            if (!results.segments.hasOwnProperty(current))
            {
                results.segments[current] = {
                    'min_pixel':i,
                    'max_pixel':i,
                    'min_x':w+1,
                    'min_y':h+1,
                    'max_x':-1,
                    'max_y':-1,
                    'mask':{'b':0,'f':0},
                    'count':0,
                    'mp':[0,0,0],
                    'hred': new Uint32Array(256),
                    'hgreen':new Uint32Array(256),
                    'hblue':new Uint32Array(256)
                    }
            }
            var y = Math.floor(i/w), x = (i % w);
            if (i != x + y*w)
            {
                console.log(["Error?",i,x + y*w])
            }
            results.segments[current].count += 1;
            results.segments[current].mp[0] += results.rgbData[4 * i];
            results.segments[current].mp[1] += results.rgbData[4 * i + 1];
            results.segments[current].mp[2] += results.rgbData[4 * i + 2];
            results.segments[current].hred[results.rgbData[4 * i]] += 1;
            results.segments[current].hgreen[results.rgbData[4 * i + 1]] += 1;
            results.segments[current].hblue[results.rgbData[4 * i + 2]] += 1;
            results.segments[current].max_pixel = i;
            if (x > results.segments[current].max_x){
                results.segments[current].max_x = x
            }
            if (x < results.segments[current].min_x){
                results.segments[current].min_x = x
            }
            if (y > results.segments[current].max_y){
                results.segments[current].max_y = y
            }
            if (y < results.segments[current].min_y){
                results.segments[current].min_y = y
            }
        }
        for(var s in results.segments){
            results.segments[s].mp[0] =  results.segments[s].mp[0] /results.segments[s].count;
            results.segments[s].mp[1] =  results.segments[s].mp[1] /results.segments[s].count;
            results.segments[s].mp[2] =  results.segments[s].mp[2] /results.segments[s].count;
            results.segments[s].edges = {};
            for(var k in results.segments){
                if (s != k){
                    results.segments[s].edges[k] = 1.0;
                }
            }
        }
        // renderResults(results);
};

var renderResults = function(results){
	var output_canvas = document.getElementById('target');
    var context = output_canvas.getContext('2d');
    var imageData = context.createImageData(output_canvas.width, output_canvas.height);
    var data = imageData.data;
    for (var i = 0; i < results.indexMap.length; ++i) {
        if (results.segments[results.indexMap[i]].foreground)
        {
            data[4 * i + 0] = results.rgbData[4 * i + 0];
            data[4 * i + 1] = results.rgbData[4 * i + 1];
            data[4 * i + 2] = results.rgbData[4 * i + 2];
            data[4 * i + 3] = 255;
        }
        else{
            data[4 * i + 3] = 0;
        }
    }
    drawOnCanvas("target", imageData);
};

var updateClusters = function(results, mask){
    var segments = results.segments,
        indexMap = results.indexMap;
    results.unknown = [];
    results.mixed = [];
    results.foreground = [];
    results.background = [];
    for(var s in segments) {
        seg = segments[s];
        seg.mask = { 'f':0,'b':0};
        seg.foreground = false;
        seg.background = false;
        seg.unknown = false;
        seg.mixed = false;
    }

    for (var i = 0; i < indexMap.length; ++i) {
        var value = indexMap[i];
			// console.log(mask[4*i]);
            if (mask.data[4 * i] == 0)
            {
				// console.log("F: " + i);
                segments[value].mask.f++;
            }
            if (mask.data[4 * i] == 255)
            {
				// console.log("B: " + i);
                segments[value].mask.b++;
            }
    }
    for(var s in segments){
        seg = segments[s];
        if (seg.mask.f > 0 && seg.mask.b == 0){
            seg.foreground = true;
            seg.background = false;
            seg.unknown = false;
            seg.mixed = false;
            results.foreground.push(s)
        }
        else if (seg.mask.b > 0 && seg.mask.f == 0){
            seg.foreground = false;
            seg.background = true;
            seg.unknown = false;
            seg.mixed = false;
            results.background.push(s)
        }
        else if (seg.mask.b > 0 && seg.mask.f > 0){
            seg.foreground = false;
            seg.background = false;
            seg.unknown = false;
            seg.mixed = true;
            results.mixed.push(s)
        }
        else{
            seg.unknown = true;
            results.unknown.push(s)
        }
    }
    // $scope.labelUnknown();
};

var labelUnknown = function(results){
    var segments = results.segments;
    if(!results.background.length||!results.background.length ) {
        console.log("Please mark both Background and Foreground");
        _.each(results.unknown,function(k){segments[k].foreground = true});
        return
    }
    for(var index = 0; index < results.unknown.length; index++) {

        seg = segments[results.unknown[index]];
        seg.foreground = true;
        var fgList = _.map(results.foreground,function(e){
            return seg.edges[e] * (Math.abs(segments[e].mp[0] - seg.mp[0])
                + Math.abs(segments[e].mp[1] - seg.mp[1])
                + Math.abs(segments[e].mp[2] - seg.mp[2]))});
        var bgList = _.map(results.background,function(e){
            return seg.edges[e] * (Math.abs(segments[e].mp[0] - seg.mp[0])
                + Math.abs(segments[e].mp[1] - seg.mp[1])
                + Math.abs(segments[e].mp[2] - seg.mp[2]))});
        var fgDist = Math.min.apply(null, fgList); // _.reduce(fgList, function(memo, num){ return memo + num; }, 0) / fgList.length;
        var bgDist = Math.min.apply(null, bgList); //_.reduce(bgList, function(memo, num){ return memo + num; }, 0) / bgList.length;
        if (fgDist > bgDist){
            seg.foreground = false;
            seg.background = true
        }
        //console.log([state.results.unknown[index],seg.foreground,bgDist,fgDist,bgList.length,fgList.length].join())
    }
};

function getImageData() {
	var canvas = document.getElementById('transfer');
	var ctx    = canvas.getContext('2d');

	// 2) Copy your image data into the canvas
	var source = document.getElementById('source');
	ctx.drawImage( source, 0, 0 );

	// 3) Read your image data
	return ctx.getImageData(0,0,width,height);
}

function drawMask() {
    var canvas = document.getElementById('mask');
	var ctx    = canvas.getContext('2d');
	ctx.fillStyle = "#000000";
	ctx.fillRect(0,0,width,height);
	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(0,0,width/6,height);
	ctx.fillRect(width-100,0,width,height);
	ctx.fillRect(width/2,0,width,100);
}