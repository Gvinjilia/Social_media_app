import { Alert, Image, ImageBackground, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useMessages } from "../contexts/MessageContext";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useSocket } from "../contexts/SocketContext";
import { ScrollView } from "moti";

const Chat = ({ route }) => {
    const { groupId, userInfo } = route.params;
    const { user } = useAuth();
    const { socket } = useSocket();
    const { sendMessage, getGroups, getMessages, groups, messages } = useMessages();

    const [text, setText] = useState('');

    useEffect(() => {
        if(socket && user){
            socket.emit('join-group', {
                groupId,
                userId: user._id
            });
        }

        getMessages(groupId);
    }, [socket]);

    const handleSubmit = () => {
        if(!text) return Alert.alert('All fields are required!');

        sendMessage(groupId, text);

        setText('');
    };

    return (
        <KeyboardAvoidingView style={[styles.container, { backgroundColor: messages[groupId]?.length > 0 ? '#584BD6' : 'white' }]} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={130}>
            {
                messages[groupId]?.length > 0 ? (
                    <ScrollView>
                        <View style={{ padding: 10 }}>
                            {
                                (messages[groupId] || []).map((m, index) => (
                                    <View key={index} style={{ flexDirection: 'row', justifyContent: user._id === m.senderId ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
                                        <View style={{ backgroundColor: user._id === m.senderId ? 'white' : '#7B71EE', paddingLeft: 13, paddingRight: 13, paddingTop: 9, paddingBottom: 9, borderTopLeftRadius: user._id === m.senderId ? 20 : 0, borderTopRightRadius: user._id === m.senderId ? 0 : 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
                                            <Text style={{ paddingRight: user._id === m.senderId ? 5 : 0, color: user._id === m.senderId ? 'black' : 'white', fontWeight: '300' }}>{m.text}</Text>
                                        </View>
                                    </View>
                                ))
                            }
                        </View>
                    </ScrollView>
                ) : (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={require('../images/undraw_personal-opinions_fzy5 (1).png')} style={{ width: 400, height: 320 }} />
                    </View>
                )
            }

            <View style={{ flexDirection: 'row', gap: 7, justifyContent: 'center', alignItems: 'center', marginBottom: 15 }}>
                <View style={styles.mainInputsDiv}>
                    <View style={styles.inputStyles}>
                        <View style={{ borderColor: '#584BD6', borderRightWidth: 0.5 }}>
                            <Image source={require('../images/microphone.png')} style={{ width: 20, height: 20, marginRight: 4 }} />
                        </View>
                        <TextInput placeholder="Message..." value={text} onChangeText={setText} style={{ marginLeft: 4 }} />
                    </View>
                </View>
                <View style={styles.sendButtonStyles}>
                    <TouchableOpacity onPress={handleSubmit}>
                        <Image source={require('../images/send (4).png')} style={{ width: 20, height: 20 }} />
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

export default Chat;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    mainInputsDiv: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputStyles: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 1,
        paddingLeft: 10,
        backgroundColor: '#FFFFFF',
        width: 330,
        height: 40,
        borderRadius: 20
    },
    sendButtonStyles: {
        backgroundColor: 'white',
        borderRadius: '100%',
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
    }
});