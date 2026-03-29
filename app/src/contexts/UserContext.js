import { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { useSocket } from "./SocketContext";

const UserContext = createContext();

// const API_URL = 'http://192.168.0.13:3000/api';

const API_URL = 'https://social-media-app-1h2n.onrender.com/api';

export const useUsers = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState(null);
    const [userPosts, setUserPosts] = useState([]);

    const [friends, setFriends] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
    const [sentFriendRequests, setSentFriendRequests] = useState([]);

    const { socket } = useSocket();

    useEffect(() => {
        if(!socket) return;

        socket.on('new-friendRequest', ({ from }) => {
            console.log('New friend request from:', from);

            getFriends();
            getFriendRequests();
            getSentFriendRequests();
        });

        socket.on('accept-request', (requestId) => {
            console.log('Friend request accepted:', requestId);

            getFriends();
            getFriendRequests();
            getSentFriendRequests();
        });

        socket.on('reject-request', () => {
            getFriends();
            getFriendRequests();
            getSentFriendRequests();
        });

        socket.on('remove-friend', () => {
            getFriends();
            getFriendRequests();
            getSentFriendRequests();
        });

        socket.on('cancel-request', () => {
            getFriends();
            getFriendRequests();
            getSentFriendRequests();
        });

        return () => {
            socket.off('new-friendRequest');
            socket.off('accept-request');
            socket.off('reject-request');
            socket.off('remove-friend');
            socket.off('cancel-request');
        };
    }, [socket]);

    const getUsers = async () => {
        try {   
            const res = await fetch(`${API_URL}/users`, {
                credentials: 'include'
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.message);
            };

            setUsers(data);
        } catch(err){
            Alert.alert(err.message);
        }
    };

    const getUserInfo = async (id) => {
        try {   
            const res = await fetch(`${API_URL}/users/${id}`, {
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

    const getUserPosts = async (userId) => {
        try {   
            const res = await fetch(`${API_URL}/users/${userId}/posts`, {
                credentials: 'include'
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.message);
            };

            setUserPosts(data);
        } catch(err){
            Alert.alert(err.message);
        }
    };

    const getFriends = async () => {
        try {
            const res = await fetch(`${API_URL}/friends`, {
                credentials: 'include'
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.message);
            }

            setFriends(data.data.friends);
        } catch(err){
            Alert.alert(err.message);
        }
    };

    const sendFriendRequest = async (to) => {
        try {
            const res = await fetch(`${API_URL}/friends/${to}`, {
                method: 'POST',
                credentials: 'include'
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.message);
            }

            console.log(to);

            Alert.alert(data.message);
            setFriendRequests((prev) => [...prev, data.data.friendRequest]);

            if(socket) socket.emit('friend-request', {
                userId: data.data.friendRequest.from,
                to
            });
        
            getFriends();
            getFriendRequests();
            getSentFriendRequests();
        } catch(err){
            Alert.alert(err.message);
        }
    };

    const getFriendRequests = async () => {
        try {
            const res = await fetch(`${API_URL}/friends/friend-requests`, {
                credentials: 'include'
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.message);
            }

            setFriendRequests(data.data.friendRequests);
        } catch(err){
            Alert.alert(err.message);
        }
    };

    const getSentFriendRequests = async () => {
        try {
            const res = await fetch(`${API_URL}/friends/sent-friend_requests`, {
                credentials: 'include'
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.message);
            };

            console.log(data);

            setSentFriendRequests(data.data.friendRequests);
        } catch(err){
            Alert.alert(err.message);
        }
    };

    const cancelFriendRequest = async (to) => {
        try {
            const res = await fetch(`${API_URL}/friends/cancel/${to}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.message);
            }

            if(socket){
                socket.emit('cancel-request', {
                    to
                });
            }

            Alert.alert(data.message);

            setFriendRequests((prev) => prev.filter((friend) => friend.to !== to));
            
            getFriends();
            getFriendRequests();
            getSentFriendRequests();
        } catch(err){
            Alert.alert(err.message);
        }
    };

    const acceptFriendRequest = async (requestId) => {
        try {
            const res = await fetch(`${API_URL}/friends/accept/${requestId}`, {
                method: 'POST',
                credentials: 'include'
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.message);
            }

            console.log(data);

            if(socket) socket.emit('accept-request', {
                requestId,
                to: data.data.created.user1
            });

            setFriendRequests((prev) => prev.filter((request) => request._id !== requestId));
            setFriends((prev) => [...prev, data.data.created]);

            getFriends();
            getFriendRequests();
            getSentFriendRequests();
        } catch(err){
            Alert.alert(err.message);
        }
    };

    const rejectFriendRequest = async (to) => {
        try {
            const res = await fetch(`${API_URL}/friends/reject/${to}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if(!res.ok){
                const data = await res.json();
                throw new Error(data.message);
            }

            socket.emit('reject-request', {
                to
            });

            setFriendRequests((prev) => prev.filter((request) => request.from !== to));

            getFriends();
            getFriendRequests();
            getSentFriendRequests();
        } catch(err){
            Alert.alert(err.message);
        }
    };

    const deleteFriend = async (userId) => {
        try {
            const res = await fetch(`${API_URL}/friends/delete/${userId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if(!res.ok){
                const data = await res.json();
                throw new Error(data.message);
            }

            if(socket){
                socket.emit('remove-friend', {
                    userId
                });
            }

            setFriends((prev) => prev.filter((f) => f.user1 !== userId && f.user2 !== userId));

            getFriends();
            getFriendRequests();
            getSentFriendRequests();
        } catch(err){
            Alert.alert(err.message);
        }
    };

    return (
        <UserContext.Provider value={{ user, users, userPosts, getUserPosts, getUsers, getUserInfo, getFriends, sendFriendRequest, getFriendRequests, getSentFriendRequests, cancelFriendRequest, sentFriendRequests, acceptFriendRequest, rejectFriendRequest, deleteFriend, friends, friendRequests, setSentFriendRequests }}>
            {children}
        </UserContext.Provider>
    );
};