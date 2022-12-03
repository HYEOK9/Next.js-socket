import io, { Socket } from 'socket.io-client';
import { useState, useEffect } from 'react';
import { Container, Box, Input } from '@mui/material';
interface Message {
    userName: string;
    message: string;
}

const Home = () => {
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [userName, setUserName] = useState<string>('익명');
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
        if (!socket) return;
        if (message === '') return;
        socket.emit('chat', { userName, message });
        setMessage('');
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (!socket) return;
        if (event.key === 'Enter' && message !== '') {
            socket.emit('chat', { userName, message });
            setMessage('');
        }
    };

    return (
        <Container
            sx={{
                display: 'flex',
                width: '100vw',
                height: '100vh',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
            }}
            maxWidth="sm"
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column-reverse',
                    width: '800px',
                    height: '500px',
                    bgcolor: '#252525',
                    overflowY: 'scroll',
                }}
            >
                {msgLst.map((msg, idx) => (
                    <Box
                        key={idx}
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            width: '100%',
                            height: '20px',
                            color: '#fff',
                        }}
                    >
                        <div
                            style={{
                                width: '50%',
                                textAlign: 'end',
                                marginLeft: '-40px',
                            }}
                        >
                            {msg.userName}
                        </div>
                        <div style={{ width: '50%', marginLeft: '40px' }}>
                            {msg.message}
                        </div>
                    </Box>
                ))}
            </Box>
            <Box
                component="form"
                sx={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'space-around',
                    marginTop: '40px',
                }}
                autoComplete="off"
            >
                <Input
                    value={userName}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setUserName(event.target.value);
                    }}
                    placeholder="이름"
                    sx={{ color: '#fff' }}
                />
                <Input
                    value={message}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setMessage(event.target.value);
                    }}
                    onKeyPress={handleKeyPress}
                    placeholder="메시지 입력"
                    sx={{ color: '#fff' }}
                />
                <button onClick={submitMsg}>send</button>
            </Box>
        </Container>
    );
};

export default Home;
