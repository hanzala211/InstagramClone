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
		const response = await fetch(
			`https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/post`,
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
