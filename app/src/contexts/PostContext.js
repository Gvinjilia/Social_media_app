import { createContext, useContext, useState } from 'react';
import { Alert } from 'react-native';

const PostContext = createContext();

// const API_URL = 'http://192.168.0.13:3000/api';

const API_URL = 'https://social-media-app-1h2n.onrender.com/api';

export const usePost = () => useContext(PostContext);

export const PostProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);
    const [userPosts, setUserPosts] = useState([]);

    const getPosts = async (userId) => {
        try {
            const res = await fetch(`${API_URL}/posts${userId ? `?userId=${userId}` : ''}`, {
                credentials: 'include'
            });

            const result = await res.json();

            if(!res.ok) {
                throw new Error(result.message);
            };

            if(userId){
                setUserPosts(result.data.posts)
            } else {
                setPosts(result.data.posts);
            };
        } catch(err) {
            console.log(err);
        }
    };

    const deletePost = async (postId) => {
        try{
            const res = await fetch(`${API_URL}/posts/${postId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if(!res.ok){
                const result = await res.json();

                throw new Error(result.message);
            };

            setPosts(posts.filter((post) => post._id !== postId));

            alert('Post deleted successfully');
        } catch(err){
            console.log(err)
        }
    };

    const updatePost = async (data, postId) => {
        try{
            const res = await fetch(`${API_URL}/posts/${postId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                credentials: 'include'
            });

            const result = await res.json();

            if(!res.ok){
                throw new Error(result.message)
            };

            const postIndex = posts.findIndex((post) => post.id === postId);
            const copiedArr = [...posts];

            copiedArr.splice(postIndex, 1, result);

            setPosts(copiedArr);

            alert('Post updated successfully');
        } catch(err){
            console.log(err);
        }
    };

    const addPost = async (formData) => {
        try {
            const data = new FormData();
            
            data.append('title', formData.title);
            data.append('content', formData.content);
            formData.tags.forEach(tag => {
                data.append('tags', tag);
            });
            
            if (formData.image){
                data.append('postImg', { uri: formData.image, type: 'image/jpeg', name: 'photo.jpg' });
            };

            const res = await fetch(`${API_URL}/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: data,
                credentials: 'include'
            });

            const result = await res.json();

            if(!res.ok){
                throw new Error(result.message);
            };

            Alert.alert('Post added successfully!');

            setPosts((prev) => [...prev, result]);
        } catch(err){
            Alert.alert(err.message);
        }
    };

    const likePost = async (id) => {
        try {
            const res = await fetch(`${API_URL}/posts/${id}/likePost`, {
                method: 'POST',
                credentials: 'include'
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.message);
            };
            console.log(data.data);

            setPosts((prev) => prev.map((p) => p._id === id ? data.data.updatedPost : p));
        } catch(err){
            Alert.alert(err.message);
        }
    };

    return (
        <PostContext.Provider value={{ addPost, deletePost, deletePost, getPosts, updatePost, likePost, posts, userPosts }}>
            {children}
        </PostContext.Provider>
    );
};