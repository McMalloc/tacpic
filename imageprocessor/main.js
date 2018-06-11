function init() {
	getImageData("people.jpg", function(imageData) {
		let imageProcessor = new ImageProcessor();
		imageProcessor.init().then(() => {

		});
	});
}

function getImageData(url, callback) {
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");

	const image = new Image;
	image.src = url;
	image.onload = () => {
		ctx.drawImage(image, 0, 0);
		callback(ctx.getImageData(0, 0, image.width, image.height));
		delete canvas; delete ctx; delete image;
	}
}