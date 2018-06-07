// http://fiveko.com/tutorials/image-processing/non-maximum-suppression-gradient/

function createShader(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
 
  console.error(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }
 
  console.error(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

function createAndSetupTexture(gl) {
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
 
    // Set up texture so we can render any size image and so we are
    // working with pixels.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
 
    return texture;
}

 function computeKernelWeight(kernel) {
    var weight = kernel.reduce(function(prev, curr) {
        return prev + curr;
    });
    return weight <= 0 ? 1 : weight;
}

function setRectangle(gl, x, y, width, height) {
	var x1 = x;
	var x2 = x + width;
	var y1 = y;
	var y2 = y + height;
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
		x1, y1,
		x2, y1,
		x1, y2,
		x1, y2,
		x2, y1,
		x2, y2,
	]), gl.STATIC_DRAW);
}

var canvas = document.getElementById("webgl");
var gl = canvas.getContext("webgl");

$("#source")[0].onload = (function() {
	init();
	
	$.when(
		$.get("vertex.vert", function(result) {
			vertexShaderSource = result;
		}),
		$.get("conv.frag", function(result) {
			blurVSource = result;
		}),
		$.get("nms.frag", function(result) {
			nmsSource = result;
		})
	).then(function() {
		var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
		// var blurVShader = createShader(gl, gl.FRAGMENT_SHADER, blurVSource);
		var nmsShader = createShader(gl, gl.FRAGMENT_SHADER, nmsSource);
		
		// var program = createProgram(gl, vertexShader, blurVShader);
		var program = createProgram(gl, vertexShader, nmsShader);
		
			  // look up where the vertex data needs to go.
		  var positionLocation = gl.getAttribLocation(program, "a_position");
		  var texcoordLocation = gl.getAttribLocation(program, "a_texCoord");

		  // Create a buffer to put three 2d clip space points in
		  var positionBuffer = gl.createBuffer();
		  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
		  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		  // Set a rectangle the same size as the image.
		  setRectangle( gl, 0, 0, width, height);

		  // provide texture coordinates for the rectangle.
		  var texcoordBuffer = gl.createBuffer();
		  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
		  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
			  0.0,  0.0,
			  1.0,  0.0,
			  0.0,  1.0,
			  0.0,  1.0,
			  1.0,  0.0,
			  1.0,  1.0,
		  ]), gl.STATIC_DRAW);

		  // Create a texture and put the image in it.
		  var originalImageTexture = createAndSetupTexture(gl);
		  
		  var imageData = document
			.getElementById('target')
			.getContext('2d')
			.getImageData(0,0,width,height);
		  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageData);

		  // create 2 textures and attach them to framebuffers.
		  var textures = [];
		  var framebuffers = [];
		  for (var ii = 0; ii < 2; ++ii) {
			var texture = createAndSetupTexture(gl);
			textures.push(texture);

			// make the texture the same size as the image
			gl.texImage2D(
				gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0,
				gl.RGBA, gl.UNSIGNED_BYTE, null);

			// Create a framebuffer
			var fbo = gl.createFramebuffer();
			framebuffers.push(fbo);
			gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

			// Attach a texture to it.
			gl.framebufferTexture2D(
				gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
		  }

		  // lookup uniforms
		  var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
		  var textureSizeLocation = gl.getUniformLocation(program, "u_textureSize");
		  var kernelLocation = gl.getUniformLocation(program, "u_kernel[0]");
		  var kernelWeightLocation = gl.getUniformLocation(program, "u_kernelWeight");
		  var flipYLocation = gl.getUniformLocation(program, "u_flipY");

		  // Define several convolution kernels
		  var kernels = {
			normal: [
			  0, 0, 0,
			  0, 1, 0,
			  0, 0, 0
			],
			boxBlur: function(size) {
				var arr = []
				for (var i = 0; i<size; i++) {
					arr.push(1/(size*size));
				}
				return arr;
			}(3),
			sobelHorizontal: [
				1,  2,  1,
				0,  0,  0,
			   -1, -2, -1
			],
			sobelVertical: [
				1,  0, -1,
				2,  0, -2,
				1,  0, -1
			]
		  };

		  var effects = [
			{ name: "boxBlur", on: true },
			{ name: "sobelHorizontal", on: false },
			{ name: "sobelVertical", on: false }
		  ];
		  
		  function setFramebuffer(fbo) {
				// make this the framebuffer we are rendering to.
				gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

				// Tell the shader the resolution of the framebuffer.
				gl.uniform2f(resolutionLocation, width, height);

				// Tell webgl the viewport setting needed for framebuffer.
				gl.viewport(0, 0, width, height);
			}

		  function drawEffects(name) {

			// Clear the canvas
			gl.clearColor(0, 0, 0, 0);
			gl.clear(gl.COLOR_BUFFER_BIT);

			// Tell it to use our program (pair of shaders)
			gl.useProgram(program);

			// Turn on the position attribute
			gl.enableVertexAttribArray(positionLocation);

			// Bind the position buffer.
			gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

			// Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
			var size = 2;          // 2 components per iteration
			var type = gl.FLOAT;   // the data is 32bit floats
			var normalize = false; // don't normalize the data
			var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
			var offset = 0;        // start at the beginning of the buffer
			gl.vertexAttribPointer(
				positionLocation, size, type, normalize, stride, offset)

			// Turn on the teccord attribute
			gl.enableVertexAttribArray(texcoordLocation);

			// Bind the position buffer.
			gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);

			// Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
			// var size = 2;          // 2 components per iteration
			// var type = gl.FLOAT;   // the data is 32bit floats
			// var normalize = false; // don't normalize the data
			// var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
			// var offset = 0;        // start at the beginning of the buffer
			// gl.vertexAttribPointer(
				// texcoordLocation, size, type, normalize, stride, offset)

			// set the size of the image
			gl.uniform2f(textureSizeLocation, width, height);

			// start with the original image
			gl.bindTexture(gl.TEXTURE_2D, originalImageTexture);

			// don't y flip images while drawing to the textures
			gl.uniform1f(flipYLocation, 1);

			// loop through each effect we want to apply.
			var count = 0;
			for (var ii = 0; ii < effects.length; ii++) {
			  if (effects[ii].on) {
				// Setup to draw into one of the framebuffers.
				setFramebuffer(framebuffers[count % 2]);

				drawWithKernel(effects[ii].name);

				// for the next draw, use the texture we just rendered to.
				gl.bindTexture(gl.TEXTURE_2D, textures[count % 2]);

				// increment count so we use the other texture next time.
				++count;
			  }
			}

			// finally draw the result to the canvas.
			gl.uniform1f(flipYLocation, -1);  // need to y flip for canvas
			setFramebuffer(null);
			drawWithKernel("normal");
		  }

		  drawEffects();
		  
		  function drawWithKernel(name) {
			// set the kernel and it's weight
			gl.uniform1fv(kernelLocation, kernels[name]);
			gl.uniform1f(kernelWeightLocation, computeKernelWeight(kernels[name]));

			// Draw the rectangle.
			var primitiveType = gl.TRIANGLES;
			var offset = 0;
			var count = 6;
			gl.drawArrays(primitiveType, offset, count);
		  }
	});
})