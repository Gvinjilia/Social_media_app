import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useUsers } from "../contexts/UserContext";
import { useEffect } from "react";

const User = ({ route }) => {
    const { id } = route.params;

    const { friends, user, getUserInfo, getUserPosts, userPosts, friendRequests, sentFriendRequests, sendFriendRequest, getFriendRequests, getSentFriendRequests, acceptFriendRequest, rejectFriendRequest, cancelFriendRequest, deleteFriend, getFriends } = useUsers();

    useEffect(() => {
        getFriends();
        getUserInfo(id);
        getUserPosts(id);
        getFriendRequests();
        getSentFriendRequests();
    }, [id]);

    console.log(friends);

    return (
        <ScrollView style={styles.mainDiv}>
            {
                user ? (
                    <View>
                        <View style={styles.userInfoMainDiv}>
                            <Image source={require('../images/undraw_profile-pic_fatv.png')} style={{ width: 170, height: 170, objectFit: 'cover', borderRadius: 100 }} />
                            <View style={styles.miniUserInfoDiv}>
                                <Text style={styles.nameTextStyles}>User: {user.fullname}</Text>
                                <Text style={styles.emailTextStyles}>Email: {user.email}</Text>
                                <Text>User role: {user.role}</Text>

                                {
                                    friendRequests.some((friendRequest) => friendRequest.from._id === id) ? (
                                        <View>
                                            <View style={styles.buttonFriendStyles}>
                                                <Image source={require('../images/user-accept.png')} style={{ width: 17, height: 17 }} />
                                                <TouchableOpacity onPress={() => acceptFriendRequest(friendRequests.find((r) => r.from._id === id)._id)}>
                                                    <Text style={styles.buttonTextStyles}>Accept Friend Request</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={styles.cancelFriendRequestStyles}>
                                                <Image source={require('../images/remove-user.png')} style={{ width: 17, height: 17 }} />
                                                <TouchableOpacity onPress={() => rejectFriendRequest(id)}>
                                                    <Text style={styles.buttonTextStyles}>Reject Friend Request</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    ) : (
                                        sentFriendRequests.some((friendRequest) => friendRequest.to._id === id) ? (
                                            <View style={styles.cancelFriendRequestStyles}>
                                                <Image source={require('../images/cancel.png')} style={{ width: 17, height: 17 }} />
                                                <TouchableOpacity onPress={() => cancelFriendRequest(id)}>
                                                    <Text style={styles.buttonTextStyles}>Cancel Friend Request</Text>
                                                </TouchableOpacity>
                                            </View>
                                        ) : (
                                            friends.some((f) => f.user1._id === id || f.user2._id === id) ? (
                                                <View style={styles.buttonFriendStyles}>
                                                    <Image source={require('../images/remove-user (1).png')} style={{ width: 17, height: 17 }} />
                                                    <TouchableOpacity onPress={() => deleteFriend(id)}>
                                                        <Text style={styles.buttonTextStyles}>Remove Friend</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            ) : (
                                                <View style={styles.buttonFriendStyles}>
                                                    <Image source={require('../images/add-user.png')} style={{ width: 15, height: 15 }} />
                                                    <TouchableOpacity onPress={() => sendFriendRequest(id)}>
                                                        <Text style={styles.buttonTextStyles}>Add Friend</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            )
                                        )
                                    )
                                }
                            </View>
                        </View>

                        <View style={{ padding: 10 }}>
                            <Text style={{ fontSize: 17, fontWeight: '500' }}>Posts</Text>
                            {
                                userPosts.length > 0 ? (
                                    userPosts.map((p, index) => (
                                        <View key={index} style={styles.postStyles}>
                                            <Image source={{ uri: `http://192.168.0.7:3000/images/${p.postImage}` }} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
                                            <Text style={styles.postTitleStyles}>{p.title}</Text>
                                            <Text>{p.content}</Text>
                                        </View>
                                    ))
                                ) : (
                                    <View>
                                        <Text>No results</Text>
                                    </View>
                                )
                            }
                        </View>
                    </View>
                ) : (
                    <View>
                        <Text>Loading</Text>
                    </View>
                )
            }
        </ScrollView>
    )
};

export default User;

const styles = StyleSheet.create({
    mainDiv: {
        flex: 1,
        backgroundColor: 'white'
    },
    userInfoMainDiv: {
        flexDirection: 'row',
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
    logoutBtnStyles: {
        backgroundColor: '#6C63FF',
        width: 120,
        borderRadius: 2,
        padding: 3,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5
    },
    buttonTextStyles: {
        color: 'white'
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
        fontWeight: 600
    },
    buttonFriendStyles: {
        backgroundColor: '#6C63FF',
        flexDirection: 'row',
        gap: 5,
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 2,
        marginTop: 5
    },
    cancelFriendRequestStyles: {
        backgroundColor: '#aeaaff',
        flexDirection: 'row',
        gap: 5,
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 2,
        marginTop: 5
    },
    buttonTextStyles: {
        color: 'white',
        fontSize: 13
    }
});