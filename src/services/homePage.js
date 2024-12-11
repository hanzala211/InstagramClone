export async function savePost(
	id,
	index,
	setSavedPosts,
	setUserData,
	userData,
	setMessage
) {
	try {
		setSavedPosts((prev) => {
			const updated = [...prev];
			updated[index] = true;
			return updated;
		});

		const response = await fetch(
			`https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/save/${id}`,
			{
				method: 'POST',
				headers: {
					Authorization: `${userData.data.token}`,
				},
				redirect: 'follow',
			}
		);
		const result = await response.json();
		if (result.status !== 'fail') {
			setUserData((prev) => ({
				...prev,
				data: {
					...prev.data,
					user: {
						...prev.data.user,
						savedPosts: result.savedPosts.includes(id)
							? [...prev.data.user.savedPosts, id]
							: [...prev.data.user.savedPosts],
					},
				},
			}));
			setMessage('Post Saved Successfully');
		}
	} catch (error) {
		console.error(error);
	}
}

export async function unSavePost(
	id,
	index,
	setSavedPosts,
	userData,
	setUserData,
	setMessage
) {
	try {
		setSavedPosts((prev) => {
			const updated = [...prev];
			updated[index] = false;
			return updated;
		});
		const response = await fetch(
			`https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/unsave/${id}`,
			{
				method: 'POST',
				headers: {
					Authorization: `${userData.data.token}`,
				},
				redirect: 'follow',
			}
		);
		const result = await response.json();
		if (result.status !== 'fail') {
			setUserData((prev) => ({
				...prev,
				data: {
					...prev.data,
					user: {
						...prev.data.user,
						savedPosts: prev.data.user.savedPosts.filter(
							(postId) => postId !== id
						),
					},
				},
			}));
			setMessage('Post Unsaved Successfully');
		}
	} catch (error) {
		console.error(error);
	}
}

export async function likePost(
	id,
	index,
	setLikedPosts,
	setHomePosts,
	userData,
	setMessage
) {
	try {
		setLikedPosts((prev) => {
			const updated = [...prev];
			updated[index] = true;
			return updated;
		});

		setHomePosts((prev) => {
			const updatedPosts = [...prev];
			updatedPosts[index] = {
				...updatedPosts[index],
				likeCount: updatedPosts[index].likeCount + 1,
				likes: updatedPosts[index].likes.includes(userData.data.user._id)
					? updatedPosts[index].likes
					: [...updatedPosts[index].likes, userData.data.user._id],
			};
			return updatedPosts;
		});

		const response = await fetch(
			`https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/post/like/${id}`,
			{
				method: 'POST',
				headers: {
					Authorization: `${userData.data.token}`,
				},
			}
		);

		const result = await response.json();
		if (result.message !== 'Post liked successfully.') {
			setLikedPosts((prev) => {
				const updated = [...prev];
				updated[index] = false;
				return updated;
			});
			setHomePosts((prev) => {
				const updatedPosts = [...prev];
				updatedPosts[index] = {
					...updatedPosts[index],
					likeCount: updatedPosts[index].likeCount - 1,
					likes: updatedPosts[index].likes.includes(userData.data.user._id)
						? updatedPosts[index].likes
						: [...updatedPosts[index].likes, userData.data.user._id],
				};
				return updatedPosts;
			});
		} else {
			setMessage(result.message);
		}
	} catch (error) {
		console.error(error);
	}
}

export async function unLikePost(
	id,
	index,
	setLikedPosts,
	setHomePosts,
	userData,
	setMessage
) {
	try {
		setLikedPosts((prev) => {
			const updated = [...prev];
			updated[index] = false;
			return updated;
		});

		setHomePosts((prev) => {
			const updatedPosts = [...prev];
			updatedPosts[index] = {
				...updatedPosts[index],
				likeCount: updatedPosts[index].likeCount - 1,
				likes: updatedPosts[index].likes.filter(
					(userId) => userId !== userData.data.user._id
				),
			};
			return updatedPosts;
		});

		const response = await fetch(
			`https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/post/dislike/${id}`,
			{
				method: 'POST',
				headers: {
					Authorization: `${userData.data.token}`,
				},
			}
		);

		const result = await response.json();
		if (result.message !== 'Post disliked successfully.') {
			setLikedPosts((prev) => {
				const updated = [...prev];
				updated[index] = false;
				return updated;
			});
			setHomePosts((prev) => {
				const updatedPosts = [...prev];
				updatedPosts[index] = {
					...updatedPosts[index],
					likeCount: updatedPosts[index].likeCount + 1,
					likes: updatedPosts[index].likes.includes(userData.data.user._id)
						? updatedPosts[index].likes
						: [...updatedPosts[index].likes, userData.data.user._id],
				};
				return updatedPosts;
			});
		} else {
			setMessage(result.message);
		}
	} catch (error) {
		console.error(error);
	}
}
