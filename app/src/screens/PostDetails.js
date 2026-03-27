import { Alert, View, Image, Text, TouchableOpacity, TextInput, Modal, StyleSheet, ScrollView } from "react-native";
import { useComments } from "../contexts/CommentContext";
import { useEffect, useState } from "react";
import { styles } from "./Posts";

import { MotiView } from 'moti';
import { Skeleton } from 'moti/skeleton';

import { useAuth } from "../contexts/AuthContext";
import { usePost } from "../contexts/PostContext";

const Spacer = ({ height = 16 }) => <View style={{ height }} />;

const PostDetails = ({ p, index }) => {
    const [text, setText] = useState('');
    const [showHearts, setShowHearts] = useState(false);
    const [sheetVisible, setSheetVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const { user } = useAuth();
    const { deletePost, likePost } = usePost();
    const { getPostComments, deleteComment, addCommentToPost, postComments, loading } = useComments();
    
    useEffect(() => {
        getPostComments(p._id);
    }, []);

    const comments = postComments[p._id] || [];

    const handleSubmit = (id) => {
        if(!text){
            Alert.alert('All fields are required!');
            return;
        };

        const content = text;

        addCommentToPost(content, id);
        setModalVisible(false);

        setText('');
    };

    return (
        <View key={index} style={styles.postStyles}>
            <Image source={{ uri: `http://192.168.0.13:3000/images/${p.postImage}` }} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
            <Text style={styles.postTitleStyles}>{p.title}</Text>
            <Text>{p.content}</Text>

            {
                p.userId === user._id && (
                    <TouchableOpacity style={styles.buttonStyles} onPress={() => deletePost(p._id)}>
                        <Text style={styles.buttonTextStyles}>Delete post</Text>
                    </TouchableOpacity>
                )
            }

            {
                showHearts && (
                    <MotiView from={{ translateY: 0, opacity: 1, scale: 0.9 }} animate={{ translateY: -70, opacity: 0, scale: 1.4 }} transition={{ type: 'timing', duration: 1500 }} style={{ position: 'absolute', bottom: 60, left: 10 }}>
                        <Image source={require('../images/heart (3).png')} style={{ width: 15, height: 15 }} />
                    </MotiView>
                )
            }

            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                <TouchableOpacity onPress={() => { likePost(p._id); setShowHearts(true); setTimeout(() => setShowHearts(false), 1500) }} style={{ marginTop: 3 }}>
                    <Image source={(p.likes || []).some((id) => id.toString() === user._id.toString()) ? require('../images/heart (3).png') : require('../images/heart (2).png')} style={{ width: 20, height: 20 }} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setSheetVisible(true)}>
                    <Image source={require('../images/chat (4).png')} style={{ width: 19, height: 19 }} />
                </TouchableOpacity>
            </View>

            <Modal animationType="fade" visible={modalVisible} transparent={true} onRequestClose={() => setModalVisible(!modalVisible)}>
                <View style={mainStyles.modalContainer}>
                    <View style={mainStyles.modalStyles}>
                        <Text style={mainStyles.titleStyles}>Add Comment</Text>
                        <TextInput multiline={true} style={mainStyles.inputStyles} placeholder="Enter comment" value={text} onChangeText={setText} />
                                                                
                        <View style={mainStyles.btnDiv}>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={mainStyles.cancelBtnStyles}>
                                <Text style={mainStyles.cancelTextStyles}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => handleSubmit(p._id)} style={mainStyles.submitBtnStyles}>
                                <Text style={mainStyles.submitTextStyles}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Text>Add Comment</Text>
            </TouchableOpacity>

            <Modal animationType="slide" visible={sheetVisible} transparent={true} onRequestClose={() => setSheetVisible(false)}>
                <View style={{ flex: 1 }}>
                    <TouchableOpacity style={{ flex: 1 }} onPress={() => setSheetVisible(false)} />
                    <View style={mainStyles.sheetContainer}>
                        <ScrollView>
                            {
                                loading ? (
                                    Array.from({ length: 12 }).map((_, i) => (
                                        <View key={i}>
                                            <MotiView transition={{ type: 'timing' }} style={{ flexDirection: 'row', gap: 5 }}>
                                                <Skeleton colorMode="light" radius="round" height={35} width={35} />
                                                <Spacer />
                                                <View>
                                                    <Skeleton colorMode="light" width={100} height={10} />
                                                    <Spacer colorMode="light" height={8} />
                                                    <Skeleton colorMode="light" width={150} height={10} />
                                                    <Spacer height={8} />
                                                    <Skeleton colorMode="light" width={90} height={10} />
                                                </View>
                                            </MotiView>
                                            <Spacer />
                                        </View>
                                    ))
                                ) : (
                                    comments.length > 0 ? (
                                        comments.map((comment, index) => (
                                            <View key={index} style={{ borderBottomWidth: 1, borderBottomColor: '#e9e6f9', marginBottom: 10 }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                                    <Image source={require('../images/undraw_profile-pic_fatv.png')} style={{ width: 45, height: 45 }} />
                                                    <View style={{ flexDirection: 'column', gap: 2 }}>
                                                        <Text style={{ fontSize: 11, fontWeight: '600' }}>{comment?.userId?.fullname}</Text>
                                                        <Text style={{ fontSize: 10 }}>{comment?.text}</Text>
                                                    </View>
                                                </View>

                                                {
                                                    comment.userId._id === user._id && (
                                                        <TouchableOpacity onPress={() => deleteComment(comment._id)} style={{ marginLeft: 48, marginBottom: 7 }}>
                                                            <Text style={{ fontSize: 11, color: '#6f61ed', fontWeight: '600' }}>Remove</Text>
                                                        </TouchableOpacity>
                                                    )
                                                }
                                            </View>
                                        ))
                                    ) : (
                                        <View>
                                            <Text>No Comments</Text>
                                        </View>
                                    )
                                )
                            }
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    )
};

export default PostDetails;

const mainStyles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(58, 58, 58, 0.5)',
    },
    modalStyles: {
        width: 370,
        height: 250,
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 5,
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 20
    },
    titleStyles: {
        fontSize: 20,
        fontWeight: '600'
    },
    inputStyles: {
        width: '100%',
        height: 120,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        color: '#333',
        textAlignVertical: 'top'
    },
    cancelBtnStyles: {
        backgroundColor: '#ededed',
        width: 70,
        padding: 3,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 2
    },
    cancelTextStyles: {
        fontWeight: '500'
    },
    submitBtnStyles: {
        backgroundColor: '#6C63FF',
        width: 70,
        padding: 3,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 2
    },
    submitTextStyles: {
        color: 'white',
        fontWeight: '300'
    },
    btnDiv: {
        width: '100%',
        justifyContent: 'flex-end',
        flexDirection: 'row',
        gap: 10
    },
    sheetContainer: {
        width: '100%',
        height: '50%',
        padding: 15,
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    }
});