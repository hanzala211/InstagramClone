export async function fetchUserDataOnClick(
	username,
	userData,
	token,
	setSelectedProfile,
	setMainLoading
) {
	setMainLoading(true);
	try {
		const response = await fetch(
			`https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/user/search/${username}`,
			{
				method: 'GET',
				headers: {
					Authorization: `${userData !== null ? userData.data.token : token}`,
				},
				redirect: 'follow',
			}
		);
		const result = await response.json();
		setSelectedProfile(result.data[0]);
	} catch (error) {
		console.error(error);
	} finally {
		setTimeout(() => {
			setMainLoading(false);
		}, 1000);
	}
}

export async function fetchHomePosts(
	userData,
	setHomePosts,
	setIsPostsLoading,
	setHasMore
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
		if (result.status !== 'fail') {
			setHomePosts((prev) => {
				const newItems = result.data.filter(
					(item) => !prev.some((prevItem) => prevItem._id === item._id)
				);
				if (newItems.length === 0) {
					setHasMore(false);
					return [...prev];
				} else {
					return [...prev, ...newItems];
				}
			});
		} else {
			setHasMore(false);
		}
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

export async function fetchUserDataOnHover(
	signal,
	username,
	userData,
	setHoverProfile,
	setPosts,
	setIsLoading
) {
	try {
		const response = await fetch(
			`https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/user/search/${username}`,
			{
				method: 'GET',
				headers: {
					Authorization: `${userData?.data.token}`,
				},
				redirect: 'follow',
				signal,
			}
		);
		const result = await response.json();
		setHoverProfile(result.data[0]);
		if (result.data[0].posts) {
			await Promise.all(
				result.data[0]?.posts
					.slice(0, 3)
					.map((item) => fetchPostData(item, userData))
			)
				.then((res) =>
					setPosts((prev) => [...prev, ...res.map((item) => item.post)])
				)
				.catch((err) => console.error(err))
				.finally(() => setIsLoading(false));
		}
	} catch (error) {
		if (error.name !== 'AbortError') {
			console.error('Error fetching user' + error);
		}
	}
}

async function fetchPostData(id, userData) {
	try {
		const response = await fetch(
			`https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/post/${id}`,
			{
				method: 'GET',
				headers: {
					Authorization: `${userData?.data.token}`,
				},
				redirect: 'follow',
			}
		);
		const result = await response.json();
		return result;
	} catch (error) {
		console.error(error);
	}
}

export async function likePost(
	setSelectedPost,
	userData,
	selectedPost,
	setIsLiked,
	setMessage
) {
	try {
		setSelectedPost((prev) => {
			const hasLiked = prev.likes.some(
				(item) => item === userData.data.user._id
			);
			return {
				...prev,
				likeCount: hasLiked ? prev.likeCount - 1 : prev.likeCount + 1,
				likes: hasLiked
					? prev.likes.filter((item) => item !== userData.data.user._id)
					: [...prev.likes, userData.data.user._id],
			};
		});
		const response = await fetch(
			`https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/post/like/${selectedPost._id}`,
			{
				method: 'POST',
				headers: {
					Authorization: `${userData.data.token}`,
				},
				redirect: 'follow',
			}
		);
		const result = await response.json();
		if (result.message !== 'Post liked successfully.') {
			setIsLiked((prev) => !prev);
		} else {
			setMessage(result.message);
		}
	} catch (error) {
		console.error(error);
	}
}

export async function fetchSearch(
	signal,
	setSearchData,
	searchQuery,
	userData,
	setSearchLoading
) {
	try {
		setSearchData([]);
		const response = await fetch(
			`https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/user/search/${searchQuery}`,
			{
				method: 'GET',
				headers: {
					Authorization: `${userData.data.token}`,
				},
				redirect: 'follow',
				signal,
			}
		);
		const result = await response.json();
		if (result.status !== 'fail') {
			const loadedImagesPromises = result.data.map((item) => {
				return new Promise((resolve) => {
					const img = new Image();
					img.src = item.profilePic;
					img.onload = () => resolve();
					img.onerror = () => resolve();
				});
			});
			await Promise.all(loadedImagesPromises).finally(() =>
				setSearchLoading(false)
			);
			setSearchData((prev) => {
				const newItems = result.data.filter(
					(item) =>
						item._id !== userData?.data.user._id &&
						!prev.some((existingItem) => existingItem._id === item._id)
				);
				return [...prev, ...newItems];
			});
		}
	} catch (error) {
		if (error.name !== 'AbortError') {
			console.error(error);
		}
	}
}
