import {
	addDoc,
	collection,
	deleteDoc,
	doc,
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

export function handleSendMessage(
	setMessages,
	messages,
	messageValue,
	userData,
	setMessageValue,
	selectedChat
) {
	setMessages([
		...messages,
		{ text: messageValue, sender: userData.data.user._id },
	]);
	setMessageValue('');
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
					content: messageValue,
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
					lastMessage: messageValue,
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
		.catch((err) => console.error(err));
}

export async function deleteMessageAndUpdateThread(
	userId,
	selectedChatId,
	messageId
) {
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
				lastMessage: latestMessage.content || '',
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
