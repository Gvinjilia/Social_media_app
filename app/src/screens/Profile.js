import { Alert, Button, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { usePost } from "../contexts/PostContext";
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from "react";
import { useUsers } from "../contexts/UserContext";

import * as Sentry from '@sentry/react-native';

const Profile = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [image, setImage] = useState(null);

    const { user, logout } = useAuth();
    const { addPost, getPosts, deletePost, userPosts } = usePost();
    const { getFriendRequests, getSentFriendRequests, friendRequests, sentFriendRequests } = useUsers();

    useEffect(() => {
        getFriendRequests();
        getSentFriendRequests();
    }, []);

    useEffect(() => {
        getPosts(user._id);
    }, [user._id]);

    const handleSubmit = () => {
        if(!title || !content || !tags){
            Alert.alert('All fields are required!');
            return;
        };

        const splitedArr = tags.split(',').map((tag) => tag.trim())

        const formData = {
            title,
            content,
            tags: splitedArr,
            image
        };

        addPost(formData);

        setTitle('');
        setContent('');
        setTags('');
        setImage(null);
    };

    const pickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if(!permission.granted){
            Alert.alert('Permission required', 'Permission to access the media library is required.');
            return;
        };

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });
       
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        };
    };

    return (
        <ScrollView style={styles.mainDiv}>
            <View>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <View style={styles.userInfoMainDiv}>
                        <Image source={require('../images/undraw_profile-pic_fatv.png')} style={{ width: 170, height: 170, objectFit: 'cover', borderRadius: 100 }} />
                        <View style={styles.miniUserInfoDiv}>
                            <Text style={styles.nameTextStyles}>User: {user.fullname}</Text>
                            <Text style={styles.emailTextStyles}>Email: {user.email}</Text>
                            <Text>User role: {user.role}</Text>
                            <Text>Is verified: {user.isVerified ? 'Yes' : 'No'}</Text>
                        </View>
                    </View>

                    <TouchableOpacity onPress={logout} style={styles.logoutBtnStyles}>
                        <Text style={styles.buttonTextStyles}>Logout</Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.inputsMainDiv, { padding: 10 }]}>
                    <View style={{ flexDirection: 'column', gap: 15, width: '100%' }}>
                        <TextInput style={styles.inputStyles} placeholder="Enter post title" value={title} onChangeText={setTitle} />
                        <TextInput style={styles.inputStyles} placeholder="Enter post content" value={content} onChangeText={setContent} />
                        <TextInput style={styles.inputStyles} placeholder="Enter post tags" value={tags} onChangeText={setTags} />

                        <TouchableOpacity onPress={pickImage}>
                            <Text>Upload Image</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleSubmit} style={[styles.buttonStyles, { marginBottom: 10 }]}>
                            <Text style={styles.buttonTextStyles}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ width: 370, justifyContent: 'center', alignItems: 'flex-start' }}>
                        <Text>My Posts</Text>
                    </View>
                    <View>
                        {
                            userPosts.length > 0 ? (
                                <View style={{ padding: 10 }}>
                                    {userPosts.map((p, index) => (
                                        <View key={index} style={styles.postStyles}>
                                            <View style={{ flexDirection: 'row', gap: 5, padding: 2 }}>
                                                {
                                                    p.tags.map((t, index) => (
                                                        <TouchableOpacity style={styles.tagsStylesPressed} key={index}>
                                                            <Text style={styles.tagTextStylePressed}>{t.toLowerCase()}</Text>
                                                        </TouchableOpacity>
                                                    ))
                                                }
                                            </View>
                                            <Image source={{ uri: `http://192.168.0.8:3000/api/images/${p.postImage}` }} style={{ width: 370, height: 200, objectFit: 'cover' }} />
                                            <Text style={styles.postTitleStyles}>{p.title}</Text>
                                            <Text>{p.content}</Text>

                                            <TouchableOpacity style={styles.buttonStyles} onPress={() => deletePost(p._id)}>
                                                <Text style={styles.buttonTextStyles}>Delete post</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </View>
                            ) : (
                                <View style={{ width: 370, justifyContent: 'center', alignItems: 'flex-start', marginTop: 5 }}>
                                    <Text>No Posts Yet</Text>
                                </View>
                            )
                        }
                    </View>
                </View>
                <View style={{ padding: 12 }}>
                    <View style={{ marginBottom: 10 }}>
                        <Text style={{ fontSize: 15, fontWeight: '700' }}>Friend Requests</Text>

                        {
                            friendRequests.length > 0 ? (
                                friendRequests.map((friendRequest, index) => (
                                    <View key={index}>
                                        <Text>Requested from: {friendRequest.from?.fullname}</Text>
                                    </View>
                                ))
                            ) : (
                                <View>
                                    <Text>No Friend requests.</Text>
                                </View>
                            )
                        }
                    </View>
                    <View>
                        <Text style={{ fontSize: 15, fontWeight: '700' }}>Sent friend Requests</Text>

                        {
                            sentFriendRequests.length > 0 ? (
                                sentFriendRequests.map((friendRequest, index) => (
                                    <View key={index}>
                                        <Text>Requested to: {friendRequest.to?.fullname}</Text>
                                    </View>
                                ))
                            ) : (
                                <View>
                                    <Text>You have not sent friend request to anyone.</Text>
                                </View>
                            )
                        }
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default Profile;

export const styles = StyleSheet.create({
    mainDiv: {
        flex: 1,
        backgroundColor: 'white'
    },
    userInfoMainDiv: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    miniUserInfoDiv: {
        flexDirection: 'column',
        gap: 5
    },
    nameTextStyles: {
        fontSize: 20,
        fontWeight: '700'
    },
    emailTextStyles: {
        color: '#686868'
    },
    inputsMainDiv: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputStyles: {
        backgroundColor: '#f5f5f5',
        width: '100%',
        borderRadius: 2,
        padding: 10
    },
    buttonStyles: {
        backgroundColor: '#6C63FF',
        width: '100%',
        borderRadius: 2,
        padding: 7,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonTextStyles: {
        color: 'white'
    },
    logoutBtnStyles: {
        backgroundColor: '#6C63FF',
        width: 120,
        borderRadius: 2,
        padding: 3,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
    },
    postStyles: {
        borderRadius: 2,
        flexDirection: 'column',
        marginTop: 10,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#ddd',
        borderRadius: 4,
        gap: 10,
        padding: 5
    },
    postTitleStyles: {
        fontSize: 18,
        fontWeight: '600'
    },
    tagsStylesPressed: {
        backgroundColor: '#f6f6f6',
        borderRadius: 20,
        paddingLeft: 12,
        paddingRight: 12,
        padding: 7
    },
    tagTextStylePressed: {
        color: 'black',
        fontSize: 12
    }
});