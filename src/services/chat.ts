import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	limit,
	orderBy,
	query,
	serverTimestamp,
	setDoc,
	updateDoc,
	where,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Messages, Thread } from '../types/chatType';
import { User, UserInfo } from '../types/user';
import { Post } from '../types/postType';
import { NavigateFunction } from 'react-router-dom';
import { sendRequest } from '../utils/sendRequest';

export function handleSendMessage(
	setMessages: (value: Messages[]) => void,
	messageValue: string,
	userData: User,
	setMessageValue: (value: string) => void,
	selectedChat: UserInfo | null
) {
	setMessages((prev) => [
		...prev,
		{
			sender: userData?.data?.user?._id,
			content: messageValue,
			timeStamp: new Date().toISOString(),
			status: 'sending',
		},
	]);
	setMessageValue('');
	setDoc(
		doc(
			db,
			'messagesThread',
			[userData?.data?.user?._id, selectedChat?._id].sort().join('_')
		),
		{
			participants: [userData.data.user._id, selectedChat?._id],
			lastMessage: null,
			timeStamp: serverTimestamp(),
			lastMessageSender: userData.data.user._id,
			deleted: {
				[userData?.data.user._id]: false,
				[selectedChat?._id]: false,
			},
		}
	)
		.then(() => {
			addDoc(
				collection(
					db,
					'messagesThread',
					[userData.data.user._id, selectedChat?._id].sort().join('_'),
					'messages'
				),
				{
					senderId: userData.data.user._id,
					content: messageValue,
					timeStamp: serverTimestamp(),
				}
			).catch((error) => console.error(error));
			updateDoc(
				doc(
					db,
					'messagesThread',
					[userData.data.user._id, selectedChat?._id].sort().join('_')
				),
				{
					lastMessage: messageValue,
					timeStamp: serverTimestamp(),
				}
			).catch((err) => console.error(err));
			const q = query(
				collection(db, 'notifications'),
				where('messageSender', '==', userData.data.user._id),
				where('userId', '==', selectedChat?._id)
			);
			getDocs(q).then((item) => {
				if (item.empty) {
					addDoc(collection(db, 'notifications'), {
						read: false,
						messageSender: userData?.data?.user?._id,
						userId: selectedChat?._id,
						timeStamp: serverTimestamp(),
					});
				} else {
					const docRef = item.docs[0].ref;
					updateDoc(docRef, { read: false });
				}
			});
		})
		.catch((err) => console.error(err));
}

export async function deleteMessageAndUpdateThread(
	userId: string,
	selectedChatId: string | undefined,
	messageId: string | undefined
): Promise<void> {
	const threadId = [userId, selectedChatId].sort().join('_');
	const threadDocRef = doc(db, 'messagesThread', threadId);
	const messagesCollectionRef = collection(
		db,
		'messagesThread',
		threadId,
		'messages'
	);
	const messageDocRef = doc(messagesCollectionRef, messageId);
	try {
		deleteDoc(messageDocRef);
		const latestMessageQuery = query(
			messagesCollectionRef,
			orderBy('timeStamp', 'desc'),
			limit(1)
		);
		const latestMessageSnapshot = await getDocs(latestMessageQuery);
		if (!latestMessageSnapshot.empty) {
			const latestMessage = latestMessageSnapshot.docs[0].data();
			updateDoc(threadDocRef, {
				lastMessage:
					latestMessage.content || latestMessage.post
						? 'Sent an attachment'
						: '',
				lastMessageSender: latestMessage.senderId,
			});
		} else {
			updateDoc(threadDocRef, {
				lastMessage: '',
				lastMessageSender: null,
			});
		}
	} catch (error) {
		console.error('Error deleting message and updating thread:', error);
	}
}

export const getSelectedChat = async (data: any) => {
	try {
		const response = await sendRequest({
			baseUrl: `${import.meta.env.VITE_APP_URL}`,
			endPoint: `auth/${data.path}`,
			configs: {
				method: "GET",
				headers: {
					"Authorization": `${data.token}`,
				}
			}
		})
		return response;
	} catch (error) {
		console.error(error)
	}
}


export const getUserById = async (data: any) => {
	try {
		const response = await sendRequest({
			baseUrl: `${import.meta.env.VITE_APP_URL}`,
			endPoint: `auth/${data.id}`,
			configs: {
				method: "GET",
				headers: {
					"Authorization": `${data.token}`,
				}
			}
		})
		return response
	} catch (error) {
		console.error(error)
	}
}

export function handleSharePost(
	userData: User | null,
	selectedChat: UserInfo,
	post: Post | undefined,
	setMessage: (value: string) => void,
	setIsShareOpen: (value: boolean) => void,
	setIsShareSearch: (value: string) => void
) {
	setIsShareOpen(false);
	setDoc(
		doc(
			db,
			'messagesThread',
			[userData.data.user._id, selectedChat._id].sort().join('_')
		),
		{
			participants: [userData.data.user._id, selectedChat._id],
			lastMessage: null,
			timeStamp: serverTimestamp(),
			lastMessageSender: userData.data.user._id,
		}
	)
		.then(() => {
			addDoc(
				collection(
					db,
					'messagesThread',
					[userData.data.user._id, selectedChat._id].sort().join('_'),
					'messages'
				),
				{
					senderId: userData.data.user._id,
					post: post,
					timeStamp: serverTimestamp(),
				}
			).catch((error) => console.error(error));
			updateDoc(
				doc(
					db,
					'messagesThread',
					[userData.data.user._id, selectedChat._id].sort().join('_')
				),
				{
					lastMessage: 'Sent an attachement',
					timeStamp: serverTimestamp(),
				}
			).catch((err) => console.error(err));
			const q = query(
				collection(db, 'notifications'),
				where('messageSender', '==', userData.data.user._id),
				where('userId', '==', selectedChat._id)
			);
			getDocs(q).then((item) => {
				if (item.empty) {
					addDoc(collection(db, 'notifications'), {
						read: false,
						messageSender: userData?.data?.user?._id,
						userId: selectedChat._id,
						timeStamp: serverTimestamp(),
					});
				} else {
					const docRef = item.docs[0].ref;
					updateDoc(docRef, { read: false });
				}
			});
		})
		.catch((err) => console.error(err))
		.finally(() => {
			setMessage('Post Sent Successfully');
			setIsShareSearch('');
		});
}

export async function deleteChatForUser(
	userId: string,
	selectedId: string,
	setThreads: (value: Thread[]) => void,
	navigate: NavigateFunction,
	setIsDeleting: (value: boolean) => void
): Promise<void> {
	setIsDeleting(true);
	try {
		const threadId = [userId, selectedId].sort().join('_');
		const threadRef = doc(db, 'messagesThread', threadId);

		const threadSnapshot = await getDoc(threadRef);

		if (threadSnapshot.exists()) {
			await updateDoc(threadRef, {
				[`deleted.${userId}`]: true,
				timeStamp: serverTimestamp(),
			});
		} else {
			await setDoc(threadRef, {
				participants: [userId, selectedId],
				deleted: {
					[userId]: true,
					[selectedId]: false,
				},
				timeStamp: serverTimestamp(),
			});
		}
		const messagesRef = collection(db, 'messagesThread', threadId, 'messages');
		const messagesSnapshot = await getDocs(messagesRef);
		messagesSnapshot.forEach((item) => {
			const messageRef = doc(messagesRef, item.id);
			updateDoc(messageRef, {
				[`deleted.${userId}`]: true,
			});
		});
		setThreads((prev) => prev.filter((item) => item?._id !== selectedId));
		navigate('/direct/inbox');
		setIsDeleting(false);
	} catch (error: any) {
		console.error('Error deleting chat for user:', error.message);
	}
}
