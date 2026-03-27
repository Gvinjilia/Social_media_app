import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useUsers } from "../contexts/UserContext";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";

const Users = () => {
    const { user } = useAuth();
    const { users, getUsers } = useUsers();

    const navigation = useNavigation();
    const [search, setSearch] = useState('');

    useEffect(() => {
        getUsers();
    }, []);

    const filtered = users.filter((u) => {
        const result = u.fullname.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());

        return result;
    });

    return (
        <ScrollView style={styles.mainDiv}>
            <View style={{ padding: 10 }}>
                <TextInput style={styles.searchInput} placeholder="Search users..." placeholderTextColor="#999" value={search} onChangeText={setSearch} />
            </View>

            {
                filtered.length > 0 ? (
                    filtered.map((u) => (
                        <View style={styles.userInfoMainDiv} key={u._id}>
                            <Image source={require('../images/undraw_profile-pic_fatv.png')} style={{ width: 170, height: 170, objectFit: 'cover', borderRadius: 100 }} />
                            <View style={styles.miniUserInfoDiv}>
                                <Text style={styles.nameTextStyles}>User: {u.fullname}</Text>
                                <Text style={styles.emailTextStyles}>Email: {u.email}</Text>

                                {
                                    u._id !== user._id ? (
                                        <TouchableOpacity style={styles.logoutBtnStyles} onPress={() => navigation.navigate('User', { id: u._id })}>
                                            <Text style={styles.buttonTextStyles}>See details</Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity style={[styles.logoutBtnStyles, { width: 150 }]} onPress={() => navigation.navigate('Profile')}>
                                            <Text style={styles.buttonTextStyles}>View Your profile</Text>
                                        </TouchableOpacity>
                                    )
                                }
                            </View>
                        </View>
                    ))
                ) : (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={require('../images/undraw_empty_4zx0.png')} style={{ width: '100%', height: 300 }} />

                        <Text>No Users found</Text>
                    </View>
                )
            }
        </ScrollView>
    )
};

export default Users;

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
    searchInput: {
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 12,
        fontSize: 15,
        color: '#333',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2
    }
});