import { NavigateFunction } from 'react-router-dom';
import { getCroppedImg } from './cropUtils';
import { CroppedAreas } from '../types/postType';

export function formatNumber(num: any) {
	if (num >= 1_000_000_000) {
		return (num / 1_000_000_000).toFixed(1) + 'B';
	} else if (num >= 1_000_000) {
		return (num / 1_000_000).toFixed(1) + ' M';
	} else if (num >= 1_000) {
		return (num / 1_000).toFixed(1) + 'K';
	} else {
		return num;
	}
}

export function formatDate(dateString: any) {
	const now: any = new Date();
	const targetDate: any = new Date(dateString);
	const diffInMilliseconds = Math.abs(targetDate - now);
	const MINUTE = 60 * 1000;
	const HOUR = 60 * MINUTE;
	const DAY = 24 * HOUR;
	const WEEK = 7 * DAY;

	if (diffInMilliseconds >= WEEK) {
		const weeks = Math.floor(diffInMilliseconds / WEEK);
		return `${weeks} w`;
	} else if (diffInMilliseconds >= DAY) {
		const days = Math.floor(diffInMilliseconds / DAY);
		const hours = Math.floor((diffInMilliseconds % DAY) / HOUR);
		return hours > 0 ? `${days} d ${hours} h` : `${days} d`;
	} else if (diffInMilliseconds >= HOUR) {
		const hours = Math.floor(diffInMilliseconds / HOUR);
		const minutes = Math.floor((diffInMilliseconds % HOUR) / MINUTE);
		return minutes > 0
			? `${hours} h ${minutes} m`
			: `${hours} hour${hours > 1 ? 's' : ''}`;
	} else {
		const minutes = Math.floor(diffInMilliseconds / MINUTE);
		return `${minutes} m`;
	}
}

export function handleFileChange(
	event: any,
	setSelectedImage: (value: string[]) => void,
	innerWidth: number,
	navigate: NavigateFunction
) {
	const files = Array.from(event.target.files);
	const imageUrls = files
		.filter((file) => file.type.startsWith('image/'))
		.map((file) => URL.createObjectURL(file));
	if (imageUrls.length > 0) {
		setSelectedImage(imageUrls);
		if (innerWidth < 768) {
			navigate('/create/post/');
		}
	} else {
		alert('Please select an image file');
	}
}

export function handleFile(fileInputRef: any) {
	fileInputRef.current.click();
}

export const onCropImage = async (
	selectedImage: string[] | string | any,
	croppedAreas: CroppedAreas[],
	setCroppedImages: (value: any) => void,
	setLoading: (value: boolean) => void,
	setCurrentIndex: (value: number) => void,
	setIsCaption: (value: boolean) => void
) => {
	if (selectedImage && croppedAreas.length) {
		const croppedImageUrls = await getCroppedImg(selectedImage, croppedAreas);
		setCroppedImages(croppedImageUrls);
		setLoading(true);
		setCurrentIndex(0);
		setTimeout(() => {
			setIsCaption(true);
			setLoading(false);
		}, 500);
	}
};

export function handleFileChangeForStories(
	event: any,
	setSelectedImage: (value: any) => void,
	fileInputRef: any,
	innerWidth: number,
	navigate: NavigateFunction
) {
	const file = event.target.files[0];

	if (file && file.type && file.type.startsWith('image/')) {
		const imageUrl = URL.createObjectURL(file);
		setSelectedImage(imageUrl);
		if (innerWidth < 768) {
			navigate('/create/story/');
		}
	} else {
		console.error('Please select a valid image file.');
	}

	if (fileInputRef.current) {
		fileInputRef.current.value = null;
	}
}

export function handleClickForStory(fileInputRef: any) {
	if (fileInputRef?.current) {
		fileInputRef.current.click();
	} else {
		console.error('fileInputRef is not connected to an input element.');
	}
}

export const formatDateString = (num: string) => {
	const date = new Date(num);
	return date.getDate().toString();
};

export const formatMonth = (num: string) => {
	const date = new Date(num);
	return date.toLocaleString("default", { month: "short" });
};