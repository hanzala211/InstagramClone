import { ProfileStories } from "../types/stories";
import { User } from "../types/user";
import { sendRequest } from "../utils/sendRequest";

export const getArchives = async (data: any) => {
	try {
		const res = await sendRequest({
			baseUrl: `${import.meta.env.VITE_APP_URL}`,
			endPoint: `archives`,
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