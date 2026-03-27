import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useUsers } from "../contexts/UserContext";
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";

const Friends = () => {
    const { user } = useAuth();
    const { friends, getFriends } = useUsers();

    const navigate = useNavigation();

    useEffect(() => {
        getFriends();
    }, []);

    const yourFriends = friends.map((f) => ({
        user: f.user1._id === user._id ? f.user2 : f.user1,
        groupId: f.groupId
    }));

    return (
        <View style={styles.container}>
            {
                yourFriends.length > 0 ? (
                    yourFriends.map((f, index) => (
                        <View key={index} style={styles.userInfoMainDiv}>
                            <Image source={require('../images/undraw_profile-pic_fatv.png')} style={{ width: 170, height: 170, objectFit: 'cover', borderRadius: 100 }} />
                            <View style={styles.miniUserInfoDiv}>
                                <Text style={styles.nameTextStyles}>{f.user.fullname}</Text>

                                <TouchableOpacity style={styles.logoutBtnStyles} onPress={() => navigate.navigate('Chat', { groupId: f.groupId._id, name: f.user.fullname })}>
                                    <Text style={styles.buttonTextStyles}>Chat</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                ) : (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={require('../images/undraw_empty_4zx0.png')} style={{ width: '100%', height: 300 }} />

                        <Text>You don't have friends yet.</Text>
                    </View>
                )
            }
        </View>
    );
};

export default Friends;

const styles = StyleSheet.create({
    container: {
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
    }
});