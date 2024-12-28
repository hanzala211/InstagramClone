import { ProfileStories } from "../types/stories";
import { User } from "../types/user";

export async function fetchArchive(setLoadingArchives: (value: boolean) => void, userData: User, setArchives: (value: ProfileStories[]) => void): Promise<void> {
	try {
		setLoadingArchives(true);
		const response = await fetch(
			`${import.meta.env.VITE_APP_URL}api/v1/archives`,
			{
				method: 'GET',
				headers: {
					Authorization: `${userData.data.token}`,
				},
				redirect: 'follow',
			}
		);
		const result = await response.json();
		if (result.message !== 'No archives found.') {
			setArchives(result.archives);
		}
	} catch (error) {
		console.error(error);
	} finally {
		setLoadingArchives(false);
	}
}
