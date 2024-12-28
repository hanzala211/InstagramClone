import { User, UserInfo } from "../types/user";

export async function fetchSearch(
	signal: any,
	setSearchData: (value: UserInfo[]) => void,
	searchQuery: string,
	userData: User,
	setSearchLoading: (value: boolean) => void
): Promise<void> {
	try {
		setSearchData([]);
		const response = await fetch(
			`${import.meta.env.VITE_APP_URL}api/v1/user/search/${searchQuery}`,
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
		if (result.status !== 'fail') {
			const loadedImagesPromises = result.data.map((item) => {
				return new Promise((resolve) => {
					const img = new Image();
					img.src = item.profilePic;
					img.onload = () => resolve();
					img.onerror = () => resolve();
				});
			});
			await Promise.all(loadedImagesPromises).finally(() =>
				setSearchLoading(false)
			);
			setSearchData((prev) => {
				const newItems = result.data.filter(
					(item) =>
						item._id !== userData?.data.user._id &&
						!prev.some((existingItem) => existingItem._id === item._id)
				);
				return [...prev, ...newItems];
			});
		}
	} catch (error) {
		if (error.name !== 'AbortError') {
			console.error(error);
		}
	}
}
