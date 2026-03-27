import { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { useSocket } from "./SocketContext";

const MessageContext = createContext();

export const useMessages = () => useContext(MessageContext);

const API_URL = 'http://192.168.0.13:3000/api';

const MessageProvider = ({ children }) => {
    const [groups, setGroups] = useState([]);
    const [messages, setMessages] = useState({});

    const { socket } = useSocket();

    useEffect(() => {
        if(!socket) return;

        socket.on('group-message', (message) => {
            setMessages((prev) => ({
                ...prev,
                [message.groupId]: [...prev[message.groupId], message]
            }));
        });

        return () => {
            socket.off('group-message');
        };
    }, [socket]);

    const sendMessage = async (groupId, text) => {
        try {
            const res = await fetch(`${API_URL}/messages/${groupId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text }),
                credentials: 'include'
            });
    
            const data = await res.json();
    
            if(!res.ok){
                throw new Error(data.message);
            }
        } catch(err){
            Alert.alert(err.message);
        }
    };
    
    const getMessages = async (groupId) => {
        try {
            const res = await fetch(`${API_URL}/messages/${groupId}`, {
                credentials: 'include'
            });
    
            const data = await res.json();
    
            if(!res.ok){
                throw new Error(data.message);
            }
    
            setMessages((prev) => ({
                ...prev,
                [groupId]: data.data.groupMessages
            }));
        } catch(err){
            Alert.alert(err.message);
        }
    };
    
    const getGroups = async () => {
        try {
            const res = await fetch(`${API_URL}/messages/groups`, {
                credentials: 'include'
            });
    
            const data = await res.json();
    
            if(!res.ok){
                throw new Error(data.message);
            }
    
            setGroups(data.data.groups);
        } catch(err){
            Alert.alert(err.message);
        }
    };

    return (
        <MessageContext.Provider value={{ groups, messages, sendMessage, getMessages, getGroups }}>
            {children}
        </MessageContext.Provider>
    );
};

export default MessageProvider;