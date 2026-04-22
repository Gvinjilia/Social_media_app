import { createContext, useContext, useEffect, useState } from "react";
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

const SOCKET_URL = 'http://192.168.0.8:3000';

// const SOCKET_URL = 'https://social-media-app-1h2n.onrender.com';

const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io(SOCKET_URL, {
            transports: ['websocket']
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;