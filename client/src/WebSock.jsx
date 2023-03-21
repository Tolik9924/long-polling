import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

// styles
import './LongPulling.css';

const WebSock = () => {
    const [messages, setMessages] = useState([]);
    const [value, setValue] = useState('');
    const socket = useRef();
    const [connected, setConnected] = useState(false);
    const [username, setUsername] = useState('');

    const connect = () => {
        socket.current = new WebSocket('ws://localhost:5000');

        socket.current.onopen = () => {
            setConnected(true);
            const message = {
                event: 'connection',
                username,
                id: Date.now(),
            };
            socket.current.send(JSON.stringify(message));
        };
        socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            setMessages(prev => [message, ...prev]);
        };
        socket.current.onclose = () => {
            console.log('Socket close');
        };
        socket.current.onerror = () => {
            console.log('Socket error');
        };
    };

    const sendMessage = async () => {
        const message = {
            username,
            message: value,
            id: Date.now(),
            event: 'message'
        };
        socket.current.send(JSON.stringify(message));
        setValue('');
    };

    if (!connected) {
        return (
            <div className='container'>
                <div className='send-message'>
                    <div className='form-container'>
                        <div className='form'>
                            <div className='input-container'>
                                <input
                                    className='input'
                                    type='text'
                                    placeholder='Input your name'
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                />
                            </div>
                            <div className='button-container'>
                                <button
                                    className='button'
                                    onClick={connect}
                                >
                                    Sing in
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='container'>
            <div className="send-message">
                <div className='form-container'>
                    <div className='form'>
                        <div className='input-container'>
                            <input
                                className='input'
                                type='text'
                                value={value}
                                onChange={e => setValue(e.target.value)}
                            />
                        </div>
                        <div className='button-container'>
                            <button
                                className='button'
                                onClick={sendMessage}
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {messages.map((message) => {
                return (
                    <div className='message-container' key={message.id}>
                        {
                            message.event === 'connection'
                                ? <p className='message'>User {message.username} connected</p>
                                : <p className='message'>{message.username}: {message.message}</p>
                        }
                    </div>
                );
            })}
        </div>
    );
};

export default WebSock;
