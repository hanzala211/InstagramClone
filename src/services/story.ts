import { sendRequest } from "../utils/sendRequest";

export const storyUpload = async (data: any) => {
	const formdata = new FormData();
	const blobImage = await fetch(data.images).then((req) => req.blob());
	formdata.append('image', blobImage, 'storyImage.jpg');
	try {
		const res = await sendRequest({
			baseUrl: `${import.meta.env.VITE_APP_URL}`,
			endPoint: '/story',
			configs: {
				method: "POST",
				headers: {
					"Authorization": data.token,
				},
				body: formdata
			}
		})
		return res;
	} catch (error) {
		console.error(error)
	}
}

export const highlightCreate = async (data: any) => {
	const raw = JSON.stringify(data)
	try {
		const res = await sendRequest({
			baseUrl: `${import.meta.env.VITE_APP_URL}`,
			endPoint: '/highlights',
			configs: {
				method: "POST",
				headers: {
					"Authorization": data.token,
					'Content-Type': 'application/json',
				},
				body: raw
			}
		})
		await Promise.all(data.selectedIDs.map((item: any) => sendStoriesToHighlight({ storyId: item._id }, res)));
		const result = await postHighlightsProfile(data, res)
		return result;
	} catch (error) {
		console.error(error)
	}
}

export const sendStoriesToHighlight = async (data: any, result: any) => {
	const raw = JSON.stringify(data)
	try {
		const res = await sendRequest({
			baseUrl: `${import.meta.env.VITE_APP_URL}`,
			endPoint: `/highlights/${result.highlight._id}/add`,
			configs: {
				method: "POST",
				headers: {
					"Authorization": data.token,
					'Content-Type': 'application/json',
				},
				body: raw
			}
		})
		return res;
	} catch (error) {
		console.error(error)
	}
}

export const postHighlightsProfile = async (data: any, result: any) => {
	const formData = new FormData();
	const blobImage = await fetch(data.selectedIDs[data.currentID].imageUrl).then((req) =>
		req.blob()
	);
	formData.append('image', blobImage, 'profileImage');
	try {
		const res = await sendRequest({
			baseUrl: `${import.meta.env.VITE_APP_URL}`,
			endPoint: `/highlights/${result.highlight._id}/profile-pic`,
			configs: {
				method: "POST",
				headers: {
					"Authorization": data.token,
				},
				body: formData
			}
		})
		return res;
	} catch (error) {
		console.error(error)
	}
}

export const highlightDelete = async (data: any) => {
	try {
		const res = await sendRequest({
			baseUrl: `${import.meta.env.VITE_APP_URL}`,
			endPoint: `/highlights/${data.highlights[data.currentHighLight]._id}`,
			configs: {
				method: "DELETE",
				headers: {
					"Authorization": data.token,
					'Content-Type': 'application/json',
				},
			}
		})
		return res;
	} catch (error) {
		console.error(error)
	}
}

const removeHighlight = async (data: any, storyId: string) => {
	const raw = JSON.stringify({
		storyId: storyId
	})
	try {
		const res = await sendRequest({
			baseUrl: `${import.meta.env.VITE_APP_URL}`,
			endPoint: `highlights/${data.highlights[data.currentHighLight]._id}/remove`,
			configs: {
				method: "PUT",
				headers: {
					Authorization: `${data.token}`,
					'Content-Type': 'application/json',
				},
				body: raw
			}
		})
		return res;
	} catch (error) {
		console.error(error)
	}
}

export const highlightEdit = async (data: any) => {
	const raw = JSON.stringify(data)
	try {
		const res = await sendRequest({
			baseUrl: `${import.meta.env.VITE_APP_URL}`,
			endPoint: `highlights/${data.highlights[data.currentHighLight]._id}`,
			configs: {
				method: "PUT",
				headers: {
					Authorization: `${data.token}`,
					'Content-Type': 'application/json',
				},
				body: raw
			}
		})
		await Promise.all(data.highLightStories.map((item: any) => removeHighlight(data, item._id)));
		const result = await postHighlightsProfile(data, res)
		return result;
	} catch (error) {
		console.error(error)
	}
}
