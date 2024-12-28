import { User, UserFollowDetailsType } from "../types/user";

export async function fetchFollowers(setIsLoading:(value: boolean) => void, userData: User, setUserFollowers: (value: UserFollowDetailsType[]) => void) : Promise<void> {
	try {
		setIsLoading(true);
		const response = await fetch(
			`${import.meta.env.VITE_APP_URL}api/v1/user/followers`,
			{
				method: 'GET',
				headers: {
					Authorization: `${userData.data.token}`,
				},
				redirect: 'follow',
			}
		);
		const result = await response.json();
		setUserFollowers(result.data);
	} catch (error) {
		console.error(error);
	} finally {
		setIsLoading(false);
	}
}

export async function fetchFollowing(setIsLoading: (value: boolean) => void, userData: User, setUserFollowing: (value: UserFollowDetailsType[]) => void) : Promise<void> {
	try {
		setIsLoading(true);
		const response = await fetch(
			`${import.meta.env.VITE_APP_URL}api/v1/user/following`,
			{
				method: 'GET',
				headers: {
					Authorization: `${userData.data.token}`,
				},
				redirect: 'follow',
			}
		);
		const result = await response.json();
		setUserFollowing(result.data);
	} catch (error) {
		console.error(error);
	} finally {
		setIsLoading(false);
	}
}
