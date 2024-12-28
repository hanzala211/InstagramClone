import { Note } from "../types/note";
import { User } from "../types/user";

export async function createNote(
	setShareLoading: (value: boolean) => void,
	userData: User,
	noteValue: string,
	setMessage: (value: string) => void,
	setNote: (value: Note) => void,
	setNoteValue: (value: string) => void,
	setIsNoteOpen: (value: boolean) => void
): Promise<void> {
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
	setShareLoading: (value: boolean) => void,
	userData: User,
	noteValue: string,
	setMessage: (value: string) => void,
	setNote: (value: Note) => void,
	setIsNoteEditOpen: (value: boolean) => void,
	setIsNoteOpen: (value:boolean) => void
): Promise<void> {
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
	setDeleteLoading: (value:boolean) => void,
	userData: User,
	setMessage: (value:string) => void,
	setIsNoteEditOpen: (value:boolean) => void,
	setNote:(value: Note) => void
): Promise<void> {
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

export async function fetchNote(setNoteLoading: (value:boolean) => void, userData: User, setNote: (value: Note) => void): Promise<void> {
	try {
		setNoteLoading(true);
		const response = await fetch(`${import.meta.env.VITE_APP_URL}api/v1/note`, {
			method: 'GET',
			headers: {
				Authorization: `${userData.data.token}`,
			},
			redirect: 'follow',
		});
		const result = await response.json();
		if (result.message !== 'Note not found or expired.') {
			setNote(result.note);
		}
	} catch (error) {
		console.error(error);
	} finally {
		setNoteLoading(false);
	}
}
