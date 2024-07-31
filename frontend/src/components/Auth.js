import {useContext, useState} from 'react';
import {Button, Form} from 'react-bootstrap';
import {AuthContext} from "../AuthProvider";
import axios from "axios";
import {redirect, useNavigate} from "react-router-dom";

const Auth = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const {isAuthenticated, setIsAuthenticated} = useContext(AuthContext);
    const navigate = useNavigate();


    const handleSubmit = async (event) => {
        event.preventDefault();

        const requestData = { username, password };

        try {
            const response = await axios.post('http://127.0.0.1:8000/auth/', requestData);
            if (response.status === 200) {
                setIsAuthenticated(true);
                const data = response.data;
                localStorage.setItem('token', data.token);
                // Здесь вы можете обрабатывать ответ сервера
                console.log('Успешная аутентификация', data);

            } else {
                throw new Error('Ошибка аутентификации');
            }
        } catch (error) {
            console.error('Ошибка при отправке запроса:', error.message);
        }
    };
    if (isAuthenticated){
        navigate('users');
    }
    return (
        <div className="container mt-5">
            <title>Авторизация</title>
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h2 className="text-center mb-4">Авторизация</h2>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Логин</Form.Label>
                            <Form.Control
                                type="username"
                                placeholder="Введите логин"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Пароль</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Введите пароль"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>

                        <Button className={`m-2`} variant="primary" type="submit" block>
                            Войти
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Auth;
