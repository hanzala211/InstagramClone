export async function fetchArchive(setLoadingArchives, userData, setArchives) {
	try {
		setLoadingArchives(true);
		const response = await fetch(
			`https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/archives`,
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
