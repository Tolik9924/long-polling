import React, { useEffect, useState } from 'react';
import axios from 'axios';

// styles
import './LongPulling.css';

const EventSourcing = () => {
    const [messages, setMessages] = useState([]);
    const [value, setValue] = useState('');

    useEffect(() => {
        subscribe();
    }, []);

    console.log('user');

    const subscribe = async () => {
        const eventSource = new EventSource('http://localhost:5000/connect');
        eventSource.onmessage = (event) => {
            const message = JSON.parse(event.data);
            setMessages(prev => [message, ...prev]);
        }
    };

    const sendMessage = async () => {
        await axios.post('http://localhost:5000/new-messages', {
            message: value,
            id: Date.now()
        });
    };

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
                            <p className='message'>{message.message}</p>
                        </div>
                    );
                })}
        </div>
    );
};

export default EventSourcing;
