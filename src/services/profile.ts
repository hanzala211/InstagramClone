import { sendRequest } from "../utils/sendRequest";


export const profileDataChange = async (data: any) => {
	const raw = JSON.stringify(data.raw);
	try {
		const res = await sendRequest({
			baseUrl: `${import.meta.env.VITE_APP_URL}`,
			endPoint: `profile-settings`,
			configs: {
				method: "PUT",
				headers: {
					"Authorization": `${data.token}`,
					"Content-Type": "application/json"
				},
				body: raw
			}
		})
		return res;
	} catch (error) {
		console.error(error)
	}
}


export const profilePicChange = async (data: any) => {
	const formData = new FormData();
	const blobImage = await fetch(data.selectedImage).then((req) => req.blob());
	formData.append('image', blobImage, 'profileImage');
	try {
		const res = await sendRequest({
			baseUrl: `${import.meta.env.VITE_APP_URL}`,
			endPoint: `profile-settings/profile-pic`,
			configs: {
				method: "POST",
				headers: {
					"Authorization": `${data.token}`,
				},
				body: formData
			}
		})
		return res;
	} catch (error) {
		console.error(error)
	}
}


export const fetchHighlights = async (data: any) => {
	try {
		const res = await sendRequest({
			baseUrl: `${import.meta.env.VITE_APP_URL}`,
			endPoint: `highlights`,
			configs: {
				method: "GET",
				headers: {
					"Authorization": `${data.token}`,
				},
			}
		})
		return res;
	} catch (error) {
		console.error(error)
	}
}

export const fetchStories = async (data: any) => {
	try {
		const res = await sendRequest({
			baseUrl: `${import.meta.env.VITE_APP_URL}`,
			endPoint: `story`,
			configs: {
				method: "GET",
				headers: {
					"Authorization": `${data.token}`,
				},
			}
		})
		return res;
	} catch (error) {
		console.error(error)
	}
}


export const getSaves = async (data: any) => {
	try {
		const res = await sendRequest({
			baseUrl: `${import.meta.env.VITE_APP_URL}`,
			endPoint: `saved-posts`,
			configs: {
				method: "GET",
				headers: {
					"Authorization": `${data.token}`,
				},
			}
		})
		return res;
	} catch (error) {
		console.error(error)
	}
}


export const getPosts = async (data: any) => {
	try {
		const res = await sendRequest({
			baseUrl: `${import.meta.env.VITE_APP_URL}`,
			endPoint: `post/my-posts`,
			configs: {
				method: "GET",
				headers: {
					"Authorization": `${data.token}`,
				},
			}
		})
		return res;
	} catch (error) {
		console.error(error)
	}
}
