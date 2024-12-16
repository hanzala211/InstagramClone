export async function createNote(
	setShareLoading,
	userData,
	noteValue,
	setMessage,
	setNote,
	setNoteValue,
	setIsNoteOpen
) {
	try {
		setShareLoading(true);
		const response = await fetch(`${import.meta.env.VITE_APP_URL}api/v1/note`, {
			method: 'POST',
			headers: {
				Authorization: `${userData.data.token}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				content: noteValue,
			}),
			redirect: 'follow',
		});
		const result = await response.json();
		setMessage(result.message);
		setNote(result.note);
	} catch (error) {
		console.error(error);
	} finally {
		setNoteValue('');
		setShareLoading(false);
		setIsNoteOpen(false);
	}
}

export async function updateNote(
	setShareLoading,
	userData,
	noteValue,
	setMessage,
	setNote,
	setIsNoteEditOpen,
	setIsNoteOpen
) {
	try {
		setShareLoading(true);
		const response = await fetch(`${import.meta.env.VITE_APP_URL}api/v1/note`, {
			method: 'PUT',
			headers: {
				Authorization: `${userData.data.token}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				content: noteValue,
			}),
			redirect: 'follow',
		});
		const result = await response.json();
		setMessage(result.message);
		setNote(result.note);
	} catch (error) {
		console.error(error);
	} finally {
		setShareLoading(false);
		setIsNoteOpen(false);
		setIsNoteEditOpen(false);
	}
}

export async function deleteNote(
	setDeleteLoading,
	userData,
	setMessage,
	setIsNoteEditOpen,
	setNote
) {
	try {
		setDeleteLoading(true);
		const response = await fetch(`${import.meta.env.VITE_APP_URL}api/v1/note`, {
			method: 'DELETE',
			headers: {
				Authorization: `${userData.data.token}`,
			},
			body: '',
			redirect: 'follow',
		});
		const result = await response.json();
		setMessage(result.message);
	} catch (error) {
		console.error(error);
	} finally {
		setIsNoteEditOpen(false);
		setNote([]);
		setDeleteLoading(false);
	}
}
