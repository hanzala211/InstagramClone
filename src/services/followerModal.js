export async function fetchFollowers(setIsLoading, userData, setUserFollowers) {
	try {
		setIsLoading(true);
		const response = await fetch(
			`https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/user/followers`,
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

export async function fetchFollowing(setIsLoading, userData, setUserFollowing) {
	try {
		setIsLoading(true);
		const response = await fetch(
			`https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/user/following`,
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
