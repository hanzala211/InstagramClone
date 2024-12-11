export async function fetchPosts(postID, setPostsLoading, userData) {
	try {
		setPostsLoading(true);
		const response = await fetch(
			`https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/post/${postID}`,
			{
				method: 'GET',
				headers: {
					Authorization: `${userData.data.token}`,
				},
				redirect: 'follow',
			}
		);
		const result = await response.json();
		return await result;
	} catch (error) {
		console.error(error);
	}
}

export async function followUser(
	setUserData,
	selectedProfile,
	setIsDisabled,
	setSelectedProfile,
	setMessage,
	userData
) {
	try {
		setUserData((prev) => ({
			...prev,
			data: {
				...prev.data,
				user: {
					...prev.data.user,
					following: [...prev.data.user.following, selectedProfile?._id],
					followingCount: prev.data.user.followingCount + 1,
				},
			},
		}));
		setIsDisabled(true);
		setSelectedProfile((prev) => ({
			...prev,
			followersCount: prev.followersCount + 1,
		}));
		setIsDisabled(true);
		const response = await fetch(
			`https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/user/follow/${selectedProfile._id}`,
			{
				method: 'POST',
				headers: {
					Authorization: `${userData.data.token}`,
				},
				redirect: 'follow',
			}
		);
		const result = await response.json();
	} catch (error) {
		console.error(error);
	} finally {
		setIsDisabled(false);
		setMessage('User Followed Successfully');
	}
}

export async function unfollowUser(
	setUserData,
	selectedProfile,
	setIsDisabled,
	setSelectedProfile,
	userData,
	setMessage
) {
	try {
		setUserData((prev) => ({
			...prev,
			data: {
				...prev.data,
				user: {
					...prev.data.user,
					following: [
						prev.data.user.following.filter(
							(item) => item !== selectedProfile._id
						),
					],
					followingCount: prev.data.user.followingCount - 1,
				},
			},
		}));
		setIsDisabled(true);
		setSelectedProfile((prev) => ({
			...prev,
			followersCount: prev.followersCount - 1,
		}));
		const response = await fetch(
			`https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/user/unfollow/${selectedProfile._id}`,
			{
				method: 'POST',
				headers: {
					Authorization: `${userData.data.token}`,
				},
				redirect: 'follow',
			}
		);
		const result = await response.json();
	} catch (error) {
		console.error(error);
	} finally {
		setIsDisabled(false);
		setMessage('User Unfollowed Successfully');
	}
}
