import React, { useState, useRef, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSocket, useOn, useStateOn, useJoinLeave } from '@hilma/socket.io-react';

const Chat = () => {
	const [messages, setMessages] = useState([]);
	const [messageText, setMessageText] = useState('');
	const [name, setName] = useState('');
	const [typingName] = useStateOn('is-typing', '');

	const boxTarget = useRef(null);

	const { goBack } = useHistory();
	const { chatName } = useParams();

	const socket = useSocket();

	const handleChange = setState => event => {
		setState(event.target.value);
	}

	const addMessage = useOn('message-recieved', message => {
		setMessages(messages => [...messages, message]);
	});

	useEffect(() => {
		boxTarget.current.scrollTop = boxTarget.current.scrollHeight;
	}, [messages]);

	const onSend = event => {
		event.preventDefault();
		const message = { name, messageText };
		socket.emit('message-sent', chatName, { ...message, recieved: true });
		addMessage({ ...message, recieved: false });
	}

	useJoinLeave(chatName, console.log, console.log);

	useEffect(() => {
		socket.emit('is-typing', chatName, name);

		const timeout = setTimeout(() => {
			socket.emit('is-typing', chatName, '');
		}, 1000);

		return () => {
			clearTimeout(timeout);
		}
	}, [messageText]);

	return (
		<div className="chat">
			<div className="chatHeader">
				<button onClick={goBack}>back</button>
				<span className="chatName">{chatName}</span>
				{typingName && (
					<span className="isTyping">
						<i>{typingName} is typing...</i>
					</span>
				)}
			</div>
			<input
				className="nameInput"
				value={name}
				placeholder="name"
				onChange={handleChange(setName)}
				spellCheck="false"
			/>
			<div className="messagesBox" ref={boxTarget}>
				{messages.map(({ name, messageText, recieved }, index) => (
					<div
						key={index}
						className={`messageBox ${recieved ? "r" : "notR"}ecieved`}
					>
						<span className="name">{name}</span>
						<span className="messageText">{messageText}</span>
					</div>
				))}
			</div>
			<form
				onSubmit={onSend}
				className="messageForm"
			>
				<input
					value={messageText}
					placeholder="message"
					onChange={handleChange(setMessageText)}
					spellCheck="false"
				/>
				<button type="submit">send</button>
			</form>
		</div>
	);
}

export default Chat;
