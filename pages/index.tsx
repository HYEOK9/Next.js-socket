import io, { Socket } from 'socket.io-client';
import React, { useState, useEffect } from 'react';

interface Message {
    userName: string;
    message: string;
}

const Home = () => {
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [socket, setSocket] = useState<any>();
    const [userName, setUserName] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [msgLst, setMsgLst] = useState<Message[]>([]);

    useEffect(() => {
        if (isConnected) return;
        const socket = io('http://localhost:8080');
        socket.on('chat', (data: Message) => {
            setMsgLst((prev) => [data, ...prev]);
        });
        setSocket(socket);
        setIsConnected(true);

        return () => {
            setIsConnected(false);
            setSocket(null);
        };
    }, []);

    useEffect(() => {
        console.log(msgLst);
    }, [msgLst]);

    const submitMsg = (event: React.SyntheticEvent) => {
        event.preventDefault();
        if (message === '') return;
        socket.emit('chat', { userName, message });
        setMessage('');
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            if (message === '') return;
            socket.emit('chat', { userName, message });
            setMessage('');
        }
    };

    return (
        <div>
            <input
                value={userName}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setUserName(event.target.value);
                }}
            />
            <input
                value={message}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setMessage(event.target.value);
                }}
                onKeyPress={handleKeyPress}
            />
            <button onClick={submitMsg}>send</button>
            {msgLst.map((msg, idx) => (
                <div key={idx}>
                    <div>{msg.userName}</div>
                    <div>{msg.message}</div>
                </div>
            ))}
        </div>
    );
};

export default Home;
