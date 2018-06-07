precision mediump float;
uniform vec2 u_textureSize;
varying vec2 v_texCoord;
 void main() {
   gl_FragColor = vec4(v_texCoord, 0, 1);
 }