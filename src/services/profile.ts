import { Post } from "../types/postType";
import { ProfileStories } from "../types/stories";
import { User } from "../types/user";

export async function changeData(
	changeUserName: string,
	userData: User,
	setErrorMessage: (value: string) => void,
	setSuccessMessage: (value: string) => void,
	setIsDisabled: (value: boolean) => void,
	changeBio: string,
	setUserData: (value: User) => void,
	selectedImage: string | null
): Promise<void> {
	const raw = JSON.stringify({
		userName: changeUserName,
		fullName: userData.data.user.fullName,
		websiteUrl: userData.data.user.websiteUrl,
		gender: 'Male',
		bio: changeBio,
	});
	try {
		setErrorMessage('');
		setSuccessMessage('');
		setIsDisabled(true);
		const response = await fetch(
			`${import.meta.env.VITE_APP_URL}api/v1/profile-settings`,
			{
				method: 'PUT',
				headers: {
					Authorization: `${userData.data.token}`,
					'Content-Type': 'application/json',
				},
				body: raw,
				redirect: 'follow',
			}
		);
		const result = await response.json();
		if (result.message === 'Profile updated successfully') {
			setSuccessMessage(result.message);
			setUserData((prev) => {
				return {
					...prev,
					data: {
						...prev.data,
						user: {
							...result.data,
						},
					},
				};
			});
		} else {
			setErrorMessage(result.message);
		}
		if (selectedImage !== null) {
			const formData = new FormData();
			const blobImage = await fetch(selectedImage).then((req) => req.blob());
			formData.append('image', blobImage, 'profileImage');
			const response = await fetch(
				`${import.meta.env.VITE_APP_URL}api/v1/profile-settings/profile-pic`,
				{
					method: 'POST',
					headers: {
						Authorization: `${userData.data.token}`,
					},
					body: formData,
					redirect: 'follow',
				}
			);
			const result = await response.json();
			if (result.message === 'Profile picture updated successfully') {
				setUserData((prev) => {
					return {
						...prev,
						data: {
							...prev.data,
							user: {
								...prev.data.user,
								profilePic: result.profilePic,
							},
						},
					};
				});
			} else {
				setErrorMessage(result.data);
			}
		}
	} catch (error) {
		console.error(error);
	} finally {
		setIsDisabled(false);
		setTimeout(() => {
			setSuccessMessage('');
			setErrorMessage('');
		}, 900);
	}
}
export async function getHighLights(
	setHighLightStories: (value: any) => void,
	userData: User,
	setHighlights: (value: any) => void
): Promise<void> {
	try {
		setHighLightStories([]);
		const response = await fetch(
			`${import.meta.env.VITE_APP_URL}api/v1/highlights`,
			{
				method: 'GET',
				headers: {
					Authorization: `${userData.data.token}`,
				},
				redirect: 'follow',
			}
		);
		const result = await response.json();
		setHighlights(result.highlights);
	} catch (error) {
		console.error(error);
	}
}

export async function getStatus(userData: User, setStories: (value: ProfileStories[]) => void): Promise<void> {
	try {
		const response = await fetch(
			`${import.meta.env.VITE_APP_URL}api/v1/story`,
			{
				method: 'GET',
				headers: {
					Authorization: `${userData.data.token}`,
				},
				redirect: 'follow',
			}
		);
		const result = await response.json();
		setStories(result.stories);
	} catch (error) {
		console.error(error);
	}
}

export async function fetchSaves(userData: User, setUserSaves: (value: Post[]) => void): Promise<void> {
	try {
		const response = await fetch(
			`${import.meta.env.VITE_APP_URL}api/v1/saved-posts`,
			{
				method: 'GET',
				headers: {
					Authorization: `${userData.data.token}`,
				},
				redirect: 'follow',
			}
		);
		const result = await response.json();
		setUserSaves(result.data);
	} catch (error) {
		console.error(error);
	}
}

export async function fetchPosts(setPostsLoading: (value: boolean) => void, userData: User, setUserPosts: (value: Post[]) => void): Promise<void> {
	try {
		setPostsLoading(true);
		const response = await fetch(
			`${import.meta.env.VITE_APP_URL}api/v1/post/my-posts`,
			{
				method: 'GET',
				headers: {
					Authorization: `${userData.data.token}`,
				},
				redirect: 'follow',
			}
		);
		const result = await response.json();
		setUserPosts(result.data);
	} catch (error) {
		console.error(error);
	} finally {
		setTimeout(() => {
			setPostsLoading(false);
		}, 500);
	}
}
