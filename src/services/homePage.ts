import { Post } from "../types/postType";
import { HomeStories } from "../types/stories";
import { User } from "../types/user";

export async function savePost(
	id: string,
	index: number,
	setSavedPosts: (user: boolean[]) => void,
	setUserData: (value: User) => void,
	userData: User,
	setMessage: (value: string) => void
): Promise<void>  {
	try {
		setSavedPosts((prev) => {
			const updated = [...prev];
			updated[index] = true;
			return updated;
		});

		const response = await fetch(
			`${import.meta.env.VITE_APP_URL}api/v1/save/${id}`,
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
	id: string,
	index: number,
	setSavedPosts: (value: boolean[]) => void,
	userData: User,
	setUserData: (value: User) => void, 
	setMessage: (value:string) => void
): Promise<void> {
	try {
		setSavedPosts((prev) => {
			const updated = [...prev];
			updated[index] = false;
			return updated;
		});
		const response = await fetch(
			`${import.meta.env.VITE_APP_URL}api/v1/unsave/${id}`,
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
	id: string,
	index: number,
	setLikedPosts: (value: boolean[]) => void,
	setHomePosts: (value: Post[]) => void,
	userData: User,
	setMessage: (value: string) => void
): Promise<void> {
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
			`${import.meta.env.VITE_APP_URL}api/v1/post/like/${id}`,
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
	id: string,
	index: number,
	setLikedPosts: (value: boolean[]) => void,
	setHomePosts: (value: Post[]) => void,
	userData: User,
	setMessage: (value: string) => void
): Promise<void> {
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
			`${import.meta.env.VITE_APP_URL}api/v1/post/dislike/${id}`,
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

export async function fetchHomePosts(
	userData: User,
	setHomePosts: (value: Post[]) => void,
	setIsPostsLoading:(value: boolean) => void,
	setHasMore: (value: boolean) => void
): Promise<void> {
	try {
		const response = await fetch(
			`${import.meta.env.VITE_APP_URL}api/v1/home?limit=5`,
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

export async function fetchStories(userData: User, setHomeStories: (value: HomeStories[]) => void): Promise<void> {
	try {
		const response = await fetch(
			`${import.meta.env.VITE_APP_URL}api/v1/story/following`,
			{
				method: 'GET',
				headers: {
					Authorization: userData?.data.token,
				},
				redirect: 'follow',
			}
		);
		const result = await response.json();
		setHomeStories(
			result.stories.filter((item: HomeStories) => item.user.stories.length > 0)
		);
	} catch (error) {
		console.error(error);
	}
}
