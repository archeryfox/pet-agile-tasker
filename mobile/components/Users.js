import {View, Text, TextInput, Button, StyleSheet, ScrollView, FlatList} from 'react-native';
import axios from 'axios';
import {Picker} from '@react-native-picker/picker';
import {DataTable} from 'react-native-paper';
import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../AuthProvider";


const Users = ({navigation}) => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);

    const {isAuthenticated} = useContext(AuthContext);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [nextPage, setNextPage] = useState(null);
    const [prevPage, setPrevPage] = useState(null);
    const [sortBy, setSortBy] = useState('id');
    const [filterBy, setFilterBy] = useState('');

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedRoles, setSelectedRoles] = useState([]);

    useEffect(() => {
        fetchRoles();
        fetchUsers();
    }, [currentPage, sortBy, filterBy]);

    const fetchRoles = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/roles/');
            setRoles(response.data.results);
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/l_users/?page=${currentPage}&ordering=${sortBy}&search=${filterBy}`);
            setUsers(response.data.results);
            setTotalPages(Math.ceil(response.data.count / 10));
            setNextPage(response.data.next);
            setPrevPage(response.data.previous);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleInputChange = async (id, fieldName, value) => {
        try {
            const userToDelete = users.find(user => user.id === id);
            const updatedUser = {...userToDelete, [fieldName]: value};
            await axios.put(`http://127.0.0.1:8000/api/l_users/${id}/`, updatedUser);
            fetchUsers();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleCreateUser = async () => {
        try {
            await axios.post('http://127.0.0.1:8000/api/users/', {
                username,
                email,
                password,
                roles: selectedRoles,
            });
            setUsername('');
            setEmail('');
            setPassword('');
            setSelectedRoles([]);
            fetchUsers();
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    const handleToggleDelete = async (id) => {
        try {
            const userToDelete = users.find(user => user.id === id);
            const updatedUser = {...userToDelete, is_deleted: !userToDelete.is_deleted};
            await axios.put(`http://127.0.0.1:8000/api/l_users/${id}/`, updatedUser);
            fetchUsers();
        } catch (error) {
            console.error('Error toggling delete status:', error);
        }
    };

    // Инициализируем состояние для сортировки

    const handleSortChange = (value) => {
        setSortBy(value); // Обновляем состояние сортировки
    };


    if (!isAuthenticated) {
        // Если пользователь не аутентифицирован, перенаправляем его на экран аутентификации
        return (
            <View style={styles.container}>
                <Text>Пожалуйста, авторизуйтесь</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Управление пользователями</Text>
            <Text>Сортировать по:</Text>
            <Picker
                selectedValue={sortBy} // Устанавливаем выбранное значение
                onValueChange={handleSortChange} // Обработчик изменения значения
            >
                <Picker.Item label="ID" value="id"/>
                <Picker.Item label="Имени" value="username"/>
                <Picker.Item label="Почте" value="email"/>
                <Picker.Item label="Ролям" value="-roles"/>
                <Picker.Item label="Ролям<" value="roles"/>
                <Picker.Item label="Почте" value="is_deleted"/>
            </Picker>
            <View style={styles.filter}>
                <Text style={styles.label}>Поиск:</Text>
                <TextInput
                    style={styles.input}
                    value={filterBy}
                    onChangeText={setFilterBy}
                />
                <Button title="Применить фильтр" onPress={fetchUsers}/>
            </View>
            <ScrollView horizontal style={styles.container}>
                <DataTable
                    horizontalScroll={true}
                    highlightOnHover={true}
                    verticalScroll={false}
                >
                    <DataTable.Header>
                        <DataTable.Title style={styles.tableContainer}>Имя</DataTable.Title>
                        <DataTable.Title style={styles.tableContainer}>Почта</DataTable.Title>
                        <DataTable.Title style={styles.tableContainer}>Роли</DataTable.Title>
                        <DataTable.Title style={styles.tableContainer}>Обслуживается?</DataTable.Title>
                    </DataTable.Header>
                    {users.map(user =>
                        <DataTable.Row key={user.id}>
                            <DataTable.Cell style={styles.cell}>
                                <TextInput
                                    value={user.username}
                                    onBlur={(value) => handleInputChange(user.id, 'email', value)}/>
                            </DataTable.Cell>
                            <DataTable.Cell style={styles.cell}>{user.email}</DataTable.Cell>
                            <DataTable.Cell style={styles.cell}>
                                <Picker
                                    selectedValue={'роли'}
                                    mode={`dropdown`}
                                    style={styles.cell}
                                    dropdownIconColor={`#4a6dc1`}
                                >
                                    {roles.map((role) => {
                                        if (user.roles.includes(role.id))
                                            return <Picker.Item
                                                key={role.id} style={{fontSize: 13, width: 100}}
                                                label={role.name} value={role.id}/>
                                    })}
                                </Picker>
                            </DataTable.Cell>
                            <DataTable.Cell style={styles.cell}>{user.is_deleted ? "да" : "нет"}</DataTable.Cell>
                        </DataTable.Row>
                    )}
                </DataTable>
            </ScrollView>
            <View style={styles.pagination}>
                <Button
                    title="Предыдущая"
                    disabled={!prevPage}
                    onPress={() => setCurrentPage(currentPage - 1)}
                />
                <Text>{currentPage} / {totalPages}</Text>
                <Button
                    title="Следующая"
                    disabled={!nextPage}
                    onPress={() => setCurrentPage(currentPage + 1)}
                />
            </View>


        </ScrollView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    filter: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    input: {
        flex: 1,
        height: 40,
        maxWidth: 150,
        minWidth: 150,
        marginBottom: 10,
        borderWidth: 1,
        borderLeftColor: 'transparent',
        borderTopColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'grey',
        marginRight: 10,
        paddingHorizontal: 10,
    },
    tableContainer: {
        minWidth: 150,
        maxWidth: 150,
        flex: 1,
        textAlign: 'center',
        justifyContent: `center`,
        alignItems: `center`,
    },

    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
        paddingVertical: 5,
        minWidth: 150,
        maxWidth: 150,
    },
    columnHeader: {
        flex: 1,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
    },
    cell: {
        minWidth: 150,
        maxWidth: 150,
        width: 150,
        flex: 1,
        textAlign: 'center',
        justifyContent: `center`,
        alignItems: `center`,
    },
    deleteButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
    },
    deleteButtonText: {
        color: '#fff',
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: `center`,
        margin: 10,
    },
});


export default Users;
