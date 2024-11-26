export async function fetchUserDataOnClick(
	username,
	userData,
	setSelectedProfile,
	setMainLoading
) {
	try {
		const response = await fetch(
			`https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/user/search/${username}`,
			{
				method: 'GET',
				headers: {
					Authorization: `${userData.data.token}`,
				},
				redirect: 'follow',
			}
		);
		const result = await response.json();
		setSelectedProfile(result.data[0]);
	} catch (error) {
		console.error(error);
	} finally {
		setMainLoading(false);
	}
}
export async function fetchHomePosts(
	userData,
	setHomePosts,
	setIsPostsLoading
) {
	try {
		const response = await fetch(
			`https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/home?limit=5`,
			{
				method: 'GET',
				headers: {
					Authorization: `${userData.data.token}`,
				},
				redirect: 'follow',
			}
		);
		const result = await response.json();
		setHomePosts((prev) => {
			const newItems = result.data.filter(
				(item) => !prev.some((prevItem) => prevItem._id === item._id)
			);
			return [...prev, ...newItems];
		});
	} catch (error) {
		console.error(error);
	} finally {
		setIsPostsLoading(false);
	}
}
export function formatNumber(num) {
	if (num >= 1_000_000_000) {
		return (num / 1_000_000_000).toFixed(1) + 'B';
	} else if (num >= 1_000_000) {
		return (num / 1_000_000).toFixed(1) + ' M';
	} else if (num >= 1_000) {
		return (num / 1_000).toFixed(1) + 'K';
	} else {
		return num.toString();
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
