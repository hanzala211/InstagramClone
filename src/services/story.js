export async function uploadStory(
	result,
	userData,
	setUploaded,
	innerWidth,
	navigate,
	setSelectedImage,
	setIsUploading,
	setResult
) {
	const formdata = new FormData();
	const blobImage = await fetch(result).then((req) => req.blob());
	formdata.append('image', blobImage, 'storyImage.jpg');
	try {
		setIsUploading(true);
		const response = await fetch(
			`${import.meta.env.VITE_APP_URL}api/v1/story`,
			{
				method: 'POST',
				headers: {
					Authorization: `${userData.data.token}`,
				},
				body: formdata,
				redirect: 'follow',
			}
		);
		const resultAwait = await response.json();
		if (
			resultAwait.message === 'Story created successfully.' &&
			innerWidth < 770
		) {
			navigate('/home');
			setSelectedImage(null);
			setIsUploading(false);
			setResult(null);
		}
	} catch (error) {
		console.error(error);
	} finally {
		setSelectedImage(null);
		setUploaded(true);
	}
}

export async function createHighLight(
	setSendLoading,
	userData,
	highlightName,
	selectedIDs,
	currentID,
	handleClose,
	setMessage
) {
	try {
		setSendLoading(true);
		const response = await fetch(
			`${import.meta.env.VITE_APP_URL}api/v1/highlights`,
			{
				method: 'POST',
				headers: {
					Authorization: `${userData.data.token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: highlightName,
				}),
				redirect: 'follow',
			}
		);
		const result = await response.json();
		if (result.message === 'Highlight created successfully.') {
			async function sendStories(storyID) {
				const addStory = await fetch(
					`${import.meta.env.VITE_APP_URL}api/v1/highlights/${
						result.highlight._id
					}/add`,
					{
						method: 'POST',
						headers: {
							Authorization: `${userData.data.token}`,
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							storyId: storyID,
						}),
						redirect: 'follow',
					}
				);
				return addStory.json();
			}
			Promise.all(selectedIDs.map((item) => sendStories(item._id)));
			postProfile(selectedIDs, currentID, result, userData, setMessage);
		}
	} catch (error) {
		console.error(error);
	} finally {
		setSendLoading(false);
		handleClose();
	}
}
export async function deleteHighlight(
	highlights,
	currentHighLight,
	userData,
	setHighLightsModal,
	setCurrentHighLight,
	navigate
) {
	try {
		const response = await fetch(
			`${import.meta.env.VITE_APP_URL}api/v1/highlights/${
				highlights[currentHighLight]._id
			}`,
			{
				method: 'DELETE',
				headers: {
					Authorization: `${userData.data.token}`,
					'Content-Type': 'application/json',
				},
				redirect: 'follow',
			}
		);
		const result = await response.json();
		navigate(-1);
	} catch (error) {
		console.error(error);
	} finally {
		setHighLightsModal(false);
		setCurrentHighLight(0);
	}
}

export async function editHighLight(
	setSendLoading,
	highlights,
	currentHighLight,
	userData,
	highLightStories,
	highlightName,
	selectedIDs,
	currentID,
	handleClose,
	navigate,
	setMessage
) {
	async function removeHighLights(storyID) {
		try {
			setSendLoading(true);
			const removeHighlight = await fetch(
				`${import.meta.env.VITE_APP_URL}api/v1/highlights/${
					highlights[currentHighLight]._id
				}/remove`,
				{
					method: 'PUT',
					headers: {
						Authorization: `${userData.data.token}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						storyId: storyID,
					}),
					redirect: 'follow',
				}
			);
			const highlightResult = await removeHighlight.json();
		} catch (error) {
			console.error(error);
		}
	}

	Promise.all(highLightStories.map((item) => removeHighLights(item._id)));

	try {
		const response = await fetch(
			`${import.meta.env.VITE_APP_URL}api/v1/highlights/${
				highlights[currentHighLight]._id
			}`,
			{
				method: 'PUT',
				headers: {
					Authorization: `${userData.data.token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: highlightName,
				}),
				redirect: 'follow',
			}
		);
		const result = await response.json();
		async function sendStories(storyID) {
			const addStory = await fetch(
				`${import.meta.env.VITE_APP_URL}api/v1/highlights/${
					result.highlight._id
				}/add`,
				{
					method: 'POST',
					headers: {
						Authorization: `${userData.data.token}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						storyId: storyID,
					}),
					redirect: 'follow',
				}
			);
			return addStory.json();
		}
		Promise.all(selectedIDs.map((item) => sendStories(item._id)));
		postProfile(selectedIDs, currentID, result, userData, setMessage);
	} catch (error) {
		console.error(error);
	} finally {
		setSendLoading(false);
		navigate(-1);
		handleClose();
	}
}

async function postProfile(
	selectedIDs,
	currentID,
	result,
	userData,
	setMessage
) {
	const formData = new FormData();
	const blobImage = await fetch(selectedIDs[currentID].imageUrl).then((req) =>
		req.blob()
	);
	formData.append('image', blobImage, 'profileImage');
	try {
		const response = await fetch(
			`${import.meta.env.VITE_APP_URL}api/v1/highlights/${
				result.highlight._id
			}/profile-pic`,
			{
				method: 'POST',
				headers: {
					Authorization: `${userData.data.token}`,
				},
				body: formData,
				redirect: 'follow',
			}
		);
		const postResult = await response.json();
	} catch (error) {
		console.error(error);
	} finally {
		setMessage('Highligh Added Successfully');
	}
}
