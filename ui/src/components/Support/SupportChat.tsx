import React, { useState, useEffect } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import './SupportChat.css'; // Import the CSS file for styling

interface Message {
    user: string;
    message: string;
}

const SupportChat: React.FC = () => {
    const [message, setMessage] = useState<string>(''); // Input message state
    const [messages, setMessages] = useState<Message[]>([]); // Array of messages in the selected chat
    const [connection, setConnection] = useState<any>(null); // SignalR connection state
    const [selectedChat, setSelectedChat] = useState<string>('User1'); // Chat user selected
    const [chatList, setChatList] = useState<string[]>(['User1', 'Support', 'User2']); // List of chats

    useEffect(() => {
        const connect = new HubConnectionBuilder()
            .withUrl("http://localhost:5000/chatHub")  // Your SignalR URL
            .build();

        connect.start()
            .then(() => {
                console.log("Connected to SignalR Hub");
                setConnection(connect);
            })
            .catch((err) => console.error("Error: ", err));

        // Listen for incoming messages
        connect.on("ReceiveMessage", (user: string, message: string) => {
            if (user === selectedChat) {
                setMessages((prevMessages) => [...prevMessages, { user, message }]);
            }
        });

        // Cleanup the connection on component unmount
        return () => {
            connect.stop();
        };
    }, [selectedChat]);

    const sendMessage = () => {
        if (message && connection) {
            connection.send("SendMessage", selectedChat, message)  // Send message to selected chat
                .then(() => {
                    setMessage('');
                })
                .catch((err: unknown) => console.error("Error sending message: ", err));
        }
    };

    const selectChat = (chatUser: string) => {
        setSelectedChat(chatUser);
        setMessages([]); // Optionally clear the messages when changing the chat
    };

    return (
        <div className="container-xxl flex-grow-1 py-2 ">
            <div className="row">
                <div className="mb-6 order-0">
                    <div className="card">
                        <div className="chat-container">
                            <div className="sidebar">
                                <h2>Chats</h2>
                                <ul className="chat-list">
                                    {chatList.map((chat, index) => (
                                        <li key={index} className={selectedChat === chat ? 'active' : ''} onClick={() => selectChat(chat)}>
                                            <div className="chat-item">
                                                <div className="avatar">👤</div>
                                                <div className="chat-info">
                                                    <div className="chat-name">{chat}</div>
                                                    <div className="last-message">Last message preview...</div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="chat-area">
                                <div className="chat-header">
                                    <h3>{selectedChat}</h3>
                                </div>
                                <div className="messages-container">
                                    <div className="messages-list">
                                        {messages.map((msg, index) => (
                                            <div key={index} className={`message-bubble ${msg.user === selectedChat ? 'sent' : 'received'}`}>
                                                <div className="message-content">
                                                    <p>{msg.message}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="chat-input-container">
                                    <input
                                        type="text"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Type a message..."
                                        className="chat-input"
                                    />
                                    <button onClick={sendMessage} className="send-button">Send</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupportChat;
