import { CroppedAreas } from "../types/postType";

export const getCroppedImg = (images: unknown, croppedAreas: CroppedAreas[]) => {
	return new Promise((resolve, reject) => {
		const croppedImages = [];
		images.forEach((imageSrc, index) => {
			const image = new Image();
			image.src = imageSrc;

			image.onload = () => {
				const canvas = document.createElement('canvas');
				const ctx = canvas.getContext('2d');

				const { x, y, width, height } = croppedAreas[index];
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

export function getImageDimensions(blobUrl: string) {
	return new Promise((resolve, reject) => {
		const img = new Image();

		img.onload = () => {
			resolve({ width: img.width, height: img.height, x: 0, y: 0 });
		};

		img.onerror = (error) => {
			reject(error);
		};

		img.src = blobUrl;
	});
}