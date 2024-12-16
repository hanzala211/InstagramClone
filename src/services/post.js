export async function createPost(
	setShareLoading,
	setIsShared,
	croppedImages,
	userData,
	captionValue,
	setCaptionValue
) {
	const formData = new FormData();
	try {
		setShareLoading(true);
		setIsShared(true);
		await Promise.all(
			croppedImages.map(async (item, index) => {
				const response = await fetch(item);
				const blob = await response.blob();
				formData.append('images', blob, `image${index}.jpg`);
			})
		);
		const response = await fetch(`${import.meta.env.VITE_APP_URL}api/v1/post`, {
			method: 'POST',
			headers: {
				Authorization: `${userData.data.token}`,
			},
			body: formData,
			redirect: 'follow',
		});
		const result = await response.json();
		if (captionValue.length > 0) {
			await fetch(
				`https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/post/caption/${result.post._id}`,
				{
					method: 'PUT',
					headers: {
						Authorization: `${userData.data.token}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ caption: captionValue }),
					redirect: 'follow',
				}
			);
		}
	} catch (error) {
		console.error(error);
	} finally {
		setShareLoading(false);
		setCaptionValue('');
	}
}

export async function savePost(
	setIsSaved,
	userData,
	setUserData,
	setMessage,
	selectedPost
) {
	try {
		setIsSaved((prev) => !prev);
		const response = await fetch(
			`${import.meta.env.VITE_APP_URL}api/v1/save/${selectedPost._id}`,
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
						savedPosts: prev.data.user.savedPosts.includes(result.savedPosts[0])
							? [...prev.data.user.savedPosts]
							: [...prev.data.user.savedPosts, ...result.savedPosts],
					},
				},
			}));
			setMessage('Post Saved Successfully');
		}
	} catch (error) {
		console.error(error);
		setMessage('Failed');
		setIsSaved((prev) => !prev);
	}
}

export async function unSavePost(
	setIsSaved,
	userData,
	setUserData,
	setMessage,
	selectedPost
) {
	try {
		setIsSaved((prev) => !prev);
		const response = await fetch(
			`${import.meta.env.VITE_APP_URL}api/v1/unsave/${selectedPost._id}`,
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
						savedPosts: prev.data.user.savedPosts.includes(result.savedPosts[0])
							? prev.data.user.savedPosts.filter(
									(item) => item !== result.savedPosts[0]
							  )
							: [...prev.data.user.savedPosts, ...result.savedPosts],
					},
				},
			}));
			setMessage('Post Unsaved Successfully');
		}
	} catch (error) {
		console.error(error);
		setMessage('Failed');
		setIsSaved((prev) => !prev);
	}
}

export async function deletePost(
	userData,
	setMessage,
	setUserData,
	setUserPosts,
	selectedPost,
	setSelectedPost,
	setIsPostSettingOpen,
	setIsPostOpen
) {
	try {
		const response = await fetch(
			`${import.meta.env.VITE_APP_URL}api/v1/post/${selectedPost._id}`,
			{
				method: 'DELETE',
				headers: {
					Authorization: `${userData.data.token}`,
				},
				redirect: 'follow',
			}
		);
		const result = await response.json();
		setMessage(result.data);
		setUserData((prev) => ({
			...prev,
			data: {
				...prev.data,
				user: {
					...prev.data.user,
					posts: prev.data.user.posts.filter(
						(item) => item !== selectedPost?._id
					),
					postCount: prev.data.user.postCount - 1,
				},
			},
		}));
		setUserPosts((prev) =>
			prev.filter((item) => item._id !== selectedPost._id)
		);
	} catch (error) {
		console.error(error);
	} finally {
		setSelectedPost(null);
		setIsPostSettingOpen(false);
		setIsPostOpen(false);
	}
}

export async function updatePost(
	setShareLoading,
	setIsShared,
	setIsEditingOpen,
	userData,
	captionValue,
	selectedPost,
	setMessage
) {
	try {
		setShareLoading(true);
		setIsShared(true);
		setIsEditingOpen(false);
		const response = await fetch(
			`${import.meta.env.VITE_APP_URL}api/v1/post/${selectedPost._id}`,
			{
				method: 'PUT',
				headers: {
					Authorization: `${userData.data.token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					caption: captionValue,
					isPublic: true,
				}),
				redirect: 'follow',
			}
		);
		const result = await response.json();
		if (result.status !== 'fail') {
			setMessage('Post Updated');
		}
	} catch (error) {
		console.error(error);
	} finally {
		setShareLoading(false);
	}
}

export async function postComment(
	setIsDisabled,
	userData,
	commentValue,
	selectedPost,
	setMessage,
	setCommentValue,
	setIsCommented
) {
	try {
		setIsDisabled(true);
		const respone = await fetch(
			`${import.meta.env.VITE_APP_URL}api/v1/post/comment/${selectedPost._id}`,
			{
				method: 'POST',
				headers: {
					Authorization: `${userData.data.token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					comment: commentValue,
				}),
				redirect: 'follow',
			}
		);
		const result = await respone.json();
		if (result.status !== 'fail') {
			setMessage('Commented Successfully');
			setCommentValue('');
			setIsCommented((prev) => !prev);
		}
	} catch (error) {
		console.error(error);
		setMessage('Failed');
	} finally {
		setIsDisabled(commentValue.length === 0);
	}
}
