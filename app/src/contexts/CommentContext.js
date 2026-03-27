import { createContext, useContext, useState } from "react";
import { Alert } from "react-native";

const CommentContext = createContext();

export const useComments = () => useContext(CommentContext);

const API_URL = 'http://192.168.0.13:3000/api';

export const CommentProvider = ({ children }) => {
    const [postComments, setPostComments] = useState({});
    const [loading, setLoading] = useState(true);

    const getPostComments = async (postId) => {
        try {
            const res = await fetch(`${API_URL}/comments/post/${postId}`, {
                credentials: 'include'
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.message);
            };

            setPostComments((prev) => ({ ...prev, [postId]: data }));
        } catch(err){
            Alert.alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const addCommentToPost = async (text, postId) => {
        try {
            const res = await fetch(`${API_URL}/comments/${postId}`, {
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
            };

            Alert.alert('comment added successfully!');

            setPostComments((prev) => ({ ...prev, [postId]: [...(prev[postId]), data] }));
        } catch(err){
            Alert.alert(err.message);
        }
    };

    const deleteComment = async (id) => {
        try {
            const res = await fetch(`${API_URL}/comments/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if(!res.ok){
                const data = await res.json();

                throw new Error(data.message);
            };

            Alert.alert('Comment deleted successfully!');

            setPostComments((prev) => {
                const updatedObj = {};

                for(const postId in prev){
                    updatedObj[postId] = prev[postId].filter((comment) => comment._id !== id);
                };

                return updatedObj;
            });
        } catch(err){
            Alert.alert(err.message);
        }
    };

    return (
        <CommentContext.Provider value={{ getPostComments, addCommentToPost, deleteComment, postComments, loading }}>
            {children}
        </CommentContext.Provider>
    );
};