

$(function(){
	var painting = false;
	var clickX = [];
	var clickY = [];
	var clickDrag = [];
	var context = $("#draw")[0].getContext("2d");
	
	function addClick(x, y, dragging) {
		clickX.push(x);
		clickY.push(y);
		clickDrag.push(dragging);
	}
	
	function redraw(){
		context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
		
		context.strokeStyle = "#df4b26";
		context.lineJoin = "round";
		context.lineWidth = 10;
				
		for(var i=0; i < clickX.length; i++) {		
			context.beginPath();
			if(clickDrag[i] && i){
				context.moveTo(clickX[i-1], clickY[i-1]);
			} else {
				context.moveTo(clickX[i]-1, clickY[i]);
			}
				context.lineTo(clickX[i], clickY[i]);
				context.closePath();
				context.stroke();
		}
	}
	
	$("#draw").mousedown(function(event) {
		var mouseX = event.pageX - this.getBoundingClientRect().left;
		var mouseY = event.pageY - this.getBoundingClientRect().top;
		
		painting = true;
		addClick(mouseX, mouseY);
		redraw();
	});
	
	$("#draw").mousemove(function(event) {
		var mouseX = event.pageX - this.getBoundingClientRect().left;
		var mouseY = event.pageY - this.getBoundingClientRect().top;
		
		if (painting) {
			addClick(mouseX, mouseY, true);
			redraw();
		}
	});	
	
	$("#draw").mouseup(function(event) {
		painting = false;
	});
	
	$("#draw").mouseleave(function(event) {
		painting = false;
	});
});