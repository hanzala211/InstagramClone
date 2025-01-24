export const sendRequest = async (data: any) => {
    try {
        const response = await fetch(`${data.baseUrl}${data.endPoint}`, {
            ...data.configs,
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (err) {
        console.error('Request Error:', err);
        throw err;
    }
};
