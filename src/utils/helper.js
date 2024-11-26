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
