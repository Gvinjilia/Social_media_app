import { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useSocket } from './SocketContext';

const AuthContext = createContext();

const API_URL = 'http://192.168.0.8:3000/api';

// const API_URL = 'https://social-media-app-1h2n.onrender.com/api';

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const { socket } = useSocket();

    useEffect(() => {
        const autoLogin = async () => {
            try {
                const res = await fetch(`${API_URL}/auth/auto-login`, {
                    method: 'POST',
                    credentials: 'include'
                });

                const data = await res.json();

                if(!res.ok){
                    throw new Error(data.message);
                };

                setUser(data);
            } catch(err){
                Alert.alert(err.message);
            }
        };

        autoLogin();
    }, []);

    useEffect(() => {
        if(socket && user?._id) {
            socket.emit('join', user._id);
        }
    }, [socket, user]);

    const signup = async (formData) => {
        try {
            const res = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
                credentials: 'include'
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.message);
            }

            Alert.alert(data.message);
        } catch(err){
            Alert.alert(err.message);
        }
    };

    const login = async (formData) => {
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
                credentials: 'include'
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.message);
            };

            setUser(data.data.user);
        } catch(err){
            Alert.alert(err.message);
        }
    };

    const logout = async () => {
        try {
            const res = await fetch(`${API_URL}/auth/logout`, {
                method: "POST",
                credentials: 'include'
            });

            if(!res.ok){
                const data = await res.json();
                throw new Error(data.message)
            };

            Alert.alert('user logged out successfully!');

            setUser(null);
        } catch(err){
            Alert.alert(err.message);
        };
    };

    return (
        <AuthContext.Provider value={{ signup, login, logout, user }}>
            {children}
        </AuthContext.Provider>
    );
};