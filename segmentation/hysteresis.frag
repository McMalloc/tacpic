precision mediump float;

// our texture
uniform sampler2D u_image;
uniform vec2 u_textureSize;
uniform float u_kernel[9];
uniform float u_kernelWeight;

// the texCoords passed in from the vertex shader.
varying vec2 v_texCoord;

vec2 onePixel = vec2(1.0, 1.0) / u_textureSize;

float toGrey(vec4 color) {
	return (color.x + color.y + color.z) / 3.0;
}

float getN() {
	return toGrey(texture2D(u_image, v_texCoord + onePixel * vec2( 0.0, -1.0)));
}
float getNE() {
	return toGrey(texture2D(u_image, v_texCoord + onePixel * vec2( 1.0, -1.0)));
}
float getE() {
	return toGrey(texture2D(u_image, v_texCoord + onePixel * vec2( 1.0,  0.0)));
}
float getSE() {
	return toGrey(texture2D(u_image, v_texCoord + onePixel * vec2( 1.0,  1.0)));
}
float getS() {
	return toGrey(texture2D(u_image, v_texCoord + onePixel * vec2( 0.0, -1.0)));
}
float getSW() {
	return toGrey(texture2D(u_image, v_texCoord + onePixel * vec2(-1.0, -1.0)));
}
float getW() {
	return toGrey(texture2D(u_image, v_texCoord + onePixel * vec2(-1.0,  0.0)));
}
float getNW() {
	return toGrey(texture2D(u_image, v_texCoord + onePixel * vec2(-1.0, -1.0)));
}

vec4 toGreyVec(float grey) {
	return vec4(grey, grey, grey, 1.0);
}

void main() {
	vec4 current = texture2D(u_image, v_texCoord);
	float currentGrey = toGrey(current);
	
	if 	(currentGrey > getW() && currentGrey > getE()) {
		gl_FragColor = toGreyVec(currentGrey);
	} else {
		gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
	}	
	
	if 	(currentGrey > getSW() && currentGrey > getNE()) {
		gl_FragColor = toGreyVec(currentGrey);
	} else {
		gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
	}	
	
	if 	(currentGrey > getN() && currentGrey > getS()) {
		gl_FragColor = toGreyVec(currentGrey);
	} else {
		gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
	}	
	
	if 	(currentGrey > getNW() && currentGrey > getSE()) {
		gl_FragColor = toGreyVec(currentGrey);
	} else {
		gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
	}
}	