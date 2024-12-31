import { Post } from "../types/postType";
import { User, UserInfo } from "../types/user";

export async function fetchPosts(postID: string, setPostsLoading: (value: boolean) => void, userData: User): Promise<void> {
	try {
		if (setPostsLoading !== null) {
			setPostsLoading(true);
		}
		const response = await fetch(
			`${import.meta.env.VITE_APP_URL}api/v1/post/${postID}`,
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
	setUserData: (value: User) => void,
	selectedProfile: UserInfo | null,
	setIsDisabled: (value: boolean) => void,
	setSelectedProfile: (value: UserInfo | null) => void,
	setMessage: (value: string) => void,
	userData: User
): Promise<void> {
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
			`${import.meta.env.VITE_APP_URL}api/v1/user/follow/${selectedProfile._id
			}`,
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
	setUserData: (value: User) => void,
	selectedProfile: UserInfo | null,
	setIsDisabled: (value: boolean) => void,
	setSelectedProfile: (value: UserInfo | null) => void,
	userData: User,
	setMessage: (value: string) => void
): Promise<void> {
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
			`${import.meta.env.VITE_APP_URL}api/v1/user/unfollow/${selectedProfile._id
			}`,
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

export async function fetchUserDataOnHover(
	signal: any,
	username: string | undefined,
	userData: User,
	setHoverProfile: (value: UserInfo) => void,
	setPosts: (value: Post[]) => void,
	setIsLoading: (value: boolean) => void
): Promise<void> {
	try {
		const response = await fetch(
			`${import.meta.env.VITE_APP_URL}api/v1/user/search/${username}`,
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
					.map((item) => fetchPosts(item, null, userData))
			)
				.then((res) => {
					setPosts((prev) => [...prev, ...res.map((item) => item.post)])
				})
				.catch((err) => console.error(err))
				.finally(() => setIsLoading(false));
		}
	} catch (error: any) {
		if (error.name !== 'AbortError') {
			console.error('Error fetching user' + error);
		}
	}
}

export async function fetchUserDataOnClick(
	username: string | undefined,
	userData: User,
	token: any,
	setSelectedProfile: (value: UserInfo) => void,
	setMainLoading: (value: boolean) => void
): Promise<void> {
	if (username !== undefined) {
		setMainLoading(true);
		try {
			const response = await fetch(
				`${import.meta.env.VITE_APP_URL}api/v1/user/search/${username}`,
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
}
