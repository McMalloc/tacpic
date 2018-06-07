const GLFilter = class GLFilter {
	constructor(imageData, fragSrc) {
		// no browser context
		if (!document) return false;
		// this.canvas = document.createElement("canvas");
		this.canvas = document.getElementById("canvas");
		this.canvas.width = imageData.width;
		this.canvas.height = imageData.height;
		this.gl = this.canvas.getContext("webgl");
		// this.gl.drawImage(imageData, 0, 0);
		
		//TODO: wenn fragSrc eine function ist, dann ist es ein Iterator für imageData
		this.vertexShader = this.createShader(this.gl.VERTEX_SHADER, GLFilter.vertexDefaultSrc);
		this.fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragSrc);
		this.program = this.createProgram(this.vertexShader, this.fragmentShader);
		
		let sizeLocation = this.gl.getUniformLocation(this.program, 'u_textureSize'),
			positionLocation = this.gl.getAttribLocation(this.program, 'position'),
			buffer = this.gl.createBuffer(),
			vertices = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1];

		//set uniform size data
		this.gl.uniform1f(sizeLocation, imageData.width, imageData.height);

		//set position attribute data
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
		this.gl.enableVertexAttribArray(positionLocation);
		this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);
	}
	
	createShader(type, source) {
		let shader = this.gl.createShader(type);
		this.gl.shaderSource(shader, source);
		this.gl.compileShader(shader);
		let success = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
		if (success) {
			return shader;
		}
		
		console.error(this.gl.getShaderInfoLog(shader));
		this.gl.deleteShader(shader);
	}

	createProgram(vertexShader, fragmentShader) {
		let program = this.gl.createProgram();
		this.gl.attachShader(program, vertexShader);
		this.gl.attachShader(program, fragmentShader);
		this.gl.linkProgram(program);
		let success = this.gl.getProgramParameter(program, this.gl.LINK_STATUS);
		if (success) {
			return program;
		}
		 
		console.error(this.gl.getProgramInfoLog(program));
		this.gl.deleteProgram(program);
	}
	
	setRectangle(x, y, width, height) {
		let x1 = x;
		let x2 = x + width;
		let y1 = y;
		let y2 = y + height;
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
			x1, y1,
			x2, y1,
			x1, y2,
			x1, y2,
			x2, y1,
			x2, y2,
		]), this.gl.STATIC_DRAW);
	}
	
	createAndSetupTexture() {
		let texture = this.gl.createTexture();
		this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
		// Set up texture so we can render any size image and so we are
		// working with pixels.
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
	 
		return texture;
	}
}

GLFilter.vertexDefaultSrc = `
		attribute vec2 a_vertexPosition;
		varying vec2 v_texCoord;

		void main() {
			v_texCoord = a_vertexPosition;
			gl_Position = vec4(a_vertexPosition, 0, 1);
		}
	`;