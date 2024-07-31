import React, {useContext, useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet, Alert} from 'react-native';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from "../AuthProvider"; // импортируем AsyncStorage

const Auth = ({navigation}) => {
    const {isAuthenticated, setIsAuthenticated} = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);

    const handleSubmit = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/auth/', {username, password});
            // Проверка успешности аутентификации
            if (response.status === 200) {
                // Получение токена и других данных из ответа
                const {token} = response.data;
                // Сохранение токена в AsyncStorage или другом хранилище
                await AsyncStorage.setItem('token', token);
                await AsyncStorage.setItem('login', username);
                await AsyncStorage.setItem('password', password);
                setIsAuthenticated(true);
                console.log(isAuthenticated);
                // Навигация к другому экрану после успешной аутентификации
                navigation.navigate('Задачи');
                console.log('Успешная аутентификация');
            } else {
                Alert.alert('Неправильные данные');
            }
        } catch (error) {
            console.error('Ошибка при отправке запроса:', error.message);
            // Показываем сообщение об ошибке при неправильных данных
            Alert.alert('Ошибка', 'Неправильные логин или пароль');
        }
    };

    const handleCreateUser = async () => {
        try {
            await axios.post('http://127.0.0.1:8000/api/users/', {
                username,
                email,
                password,
            });
            setIsRegistering(false); // Устанавливаем состояние регистрации в true
            setIsAuthenticated(true);
            navigation.navigate('Задачи');
        } catch (error) {
            console.error('Error creating user:', error);
            Alert.alert('Ошибка', 'Не удалось создать пользователя');
        }
    };

    const handleOut = async () => {
        setIsAuthenticated(false);
        setUsername('')
        setPassword('')
        setEmail('')
        navigation.navigate('Вход')
    }


    if (isAuthenticated) {
        // Если пользователь не аутентифицирован, перенаправляем его на экран аутентификации
        return (
            <View style={styles.container}>
                <Text style={{marginBottom: 50, fontSize: 20, fontWeight: 600}}>Здравствуй {username}!</Text>
                <Button title={'Выйти'} onPress={handleOut}/>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{isRegistering ? 'Регистрация' : 'Авторизация'}</Text>
            <View style={styles.inputContainer}>
                <Text>Логин</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Введите логин"
                    value={username}
                    onChangeText={(text) => setUsername(text)}
                />
            </View>
            {!isRegistering && (
                <View style={styles.inputContainer}>
                    <Text>Пароль</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Введите пароль"
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                        secureTextEntry={true}
                    />
                </View>
            )}
            {isRegistering && (
                <>
                    <View style={styles.inputContainer}>
                        <Text>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Введите email"
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text>Пароль</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Введите пароль"
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                            secureTextEntry={true}
                        />
                    </View>
                </>
            )}
            <Button
                title={isRegistering ? "Создать аккаунт" : "Войти"}
                onPress={isRegistering ? handleCreateUser : handleSubmit}
            />
            <View style={{marginTop: 20}}>

                <Button
                    title={isRegistering ? "Есть аккаунт?" : "Нет аккаунта?"}
                    onPress={() => setIsRegistering(!isRegistering)} // Изменяем состояние регистрации при нажатии на кнопку
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10,
        width: '100%',
    },
});

export default Auth;
