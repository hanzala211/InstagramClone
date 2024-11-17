export const getCroppedImg = (images, croppedAreaPixels) => {
	return new Promise((resolve, reject) => {
		const croppedImages = [];
		images.forEach((imageSrc) => {
			const image = new Image();
			image.src = imageSrc;

			image.onload = () => {
				const canvas = document.createElement('canvas');
				const ctx = canvas.getContext('2d');

				const { x, y, width, height } = croppedAreaPixels;
				canvas.width = width;
				canvas.height = height;

				ctx.drawImage(image, x, y, width, height, 0, 0, width, height);
				canvas.toBlob((blob) => {
					const croppedImageUrl = URL.createObjectURL(blob);
					croppedImages.push(croppedImageUrl);

					if (croppedImages.length === images.length) {
						resolve(croppedImages);
					}
				}, 'image/jpeg');
			};

			image.onerror = reject;
		});
	});
};
