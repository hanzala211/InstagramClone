export async function createPost(
	setShareLoading,
	setIsShared,
	croppedImages,
	userData,
	captionValue,
	setCaptionValue,
	isMobile,
	navigate
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
				`${import.meta.env.VITE_APP_URL}api/v1/post/caption/${result.post._id}`,
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
		if (isMobile) {
			navigate('/home');
		}
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
	setMessage,
	navigate,
	setCaptionValue
) {
	try {
		setShareLoading(true);
		setIsShared(true);
		if (setIsEditingOpen !== null) {
			setIsEditingOpen(false);
		}
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
		if (setIsEditingOpen === null) {
			navigate('/home');
		}
		setIsShared(false);
		setShareLoading(false);
		setCaptionValue('');
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

export async function fetchExplorePosts(
	setCount,
	setExplorePagePosts,
	userData,
	setHasMore,
	setIsPostsLoading
) {
	try {
		setCount((prev) => prev + 1);
		const response = await fetch(
			`${import.meta.env.VITE_APP_URL}api/v1/explore?limit=6`,
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
			setExplorePagePosts((prev) => {
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

export async function fetchComments(
	signal,
	setComments,
	setCommentsLoading,
	setTotalPages,
	userData,
	selectedPost,
	page
) {
	try {
		setComments([]);
		setCommentsLoading(true);

		const response = await fetch(
			`${import.meta.env.VITE_APP_URL}api/v1/post/comments/${
				selectedPost._id
			}?page=${page}&limit=15`,
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
		if (result.data.comments.length === 0) {
			setCommentsLoading(false);
		}
		setTotalPages(result.data.totalPages);
		setComments((prev) => {
			const newComments = result.data.comments.filter((newComment) => {
				return !prev.some(
					(existingComment) => existingComment._id === newComment._id
				);
			});
			return [...newComments, ...prev];
		});

		await Promise.all(
			result.data.comments.map((comment) => {
				return new Promise((resolve) => {
					const img = new Image();
					img.src = comment.user.profilePic;
					img.onload = resolve;
					img.onerror = resolve;
				});
			})
		).finally(() => {
			if (!signal.aborted) {
				setCommentsLoading(false);
			}
		});
	} catch (error) {
		if (error.name !== 'AbortError' && error.name !== 'TypeError') {
			console.error('Fetch failed:', error);
		}
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
			`${import.meta.env.VITE_APP_URL}api/v1/post/like/${selectedPost._id}`,
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

export async function unLikePost(
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
					? prev.likes.filter((item) => item !== userData.data.user._id) // Remove like
					: [...prev.likes, userData.data.user._id], // Add like
			};
		});
		const response = await fetch(
			`${import.meta.env.VITE_APP_URL}api/v1/post/dislike/${selectedPost._id}`,
			{
				method: 'POST',
				headers: {
					Authorization: `${userData.data.token}`,
				},
				redirect: 'follow',
			}
		);
		const result = await response.json();
		if (result.message !== 'Post disliked successfully.') {
			setIsLiked((prev) => !prev);
		} else {
			setMessage(result.message);
		}
	} catch (error) {
		console.error(error);
	}
}

export async function fetchPost(
	id,
	userData,
	setSelectedPost,
	setIsPostsLoading
) {
	try {
		setIsPostsLoading(true);
		const response = await fetch(
			`${import.meta.env.VITE_APP_URL}api/v1/post/${id}`,
			{
				method: 'GET',
				headers: {
					Authorization: userData.data.token,
				},
				redirect: 'follow',
			}
		);
		const result = await response.json();
		setSelectedPost(result.post);
	} catch (error) {
		console.error(error);
	} finally {
		setIsPostsLoading(false);
	}
}
