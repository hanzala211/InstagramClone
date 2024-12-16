export function formatNumber(num) {
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

export function formatDate(dateString) {
	const now = new Date();
	const targetDate = new Date(dateString);
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
