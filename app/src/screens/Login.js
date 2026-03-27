import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigation = useNavigation();

    const handleSubmit = () => {
        if(!email || !password){
            Alert.alert('all fields are required!');
            return;
        };

        const formData = {
            email, 
            password
        };

        login(formData);

        setEmail('');
        setPassword('');
    };

    return (
        <View style={styles.mainDiv}>
            <Image source={require('../images/signup-login.png')} style={{ width: 'full', height: 340 }} />
            <View style={styles.inputsMainDiv}>
                <TextInput style={styles.inputStyles} placeholder='Enter your email' keyboardType='email-address' value={email} onChangeText={setEmail} />
                <TextInput style={styles.inputStyles} placeholder='Enter your password' secureTextEntry={true} value={password} onChangeText={setPassword} />

                <TouchableOpacity onPress={handleSubmit} style={styles.buttonStyles}>
                    <Text style={styles.buttonTextStyles}>Submit</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.replace('Signup')}>
                    <Text>Go back to signup screen</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Login;

const styles = StyleSheet.create({
    mainDiv: {
        flex: 1,
        backgroundColor: 'white'
    },
    inputsMainDiv: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 15
    },
    inputStyles: {
        backgroundColor: '#f5f5f5',
        width: 370,
        borderRadius: 2,
        padding: 10
    },
    buttonStyles: {
        backgroundColor: '#6C63FF',
        width: 370,
        borderRadius: 2,
        padding: 7,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonTextStyles: {
        color: 'white'
    }
});