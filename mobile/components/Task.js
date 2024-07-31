import React, {useContext, useEffect, useState} from "react";
import axios from "axios";
import {View, Text, StyleSheet, ScrollView, FlatList, TextInput, Button} from 'react-native';
import {DataTable} from "react-native-paper";
import {Picker} from "@react-native-picker/picker";
import {AuthContext} from "../AuthProvider";


const Task = () => {
    const [tasks, setTasks] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [priorities, setPriorities] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [nextPage, setNextPage] = useState(null);
    const [prevPage, setPrevPage] = useState(null);
    const [sortBy, setSortBy] = useState('id');
    const [filterBy, setFilterBy] = useState('');

    useEffect(() => {
        fetchTasks();
        fetchStatuses();
        fetchPriorities();
        fetchProjects();
        fetchUsers();
        fetchEmployees();
    }, [currentPage, sortBy, filterBy]);

    const fetchTasks = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/tasks/?page=${currentPage}&ordering=${sortBy}&search=${filterBy}`);
            setTasks(response.data.results);
            setTotalPages(Math.ceil(response.data.count / 10));
            setNextPage(response.data.next);
            setPrevPage(response.data.previous);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const fetchStatuses = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/task_statuses/');
            setStatuses(response.data.results);
        } catch (error) {
            console.error('Error fetching statuses:', error);
        }
    };

    const fetchPriorities = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/priorities/');
            setPriorities(response.data.results);
        } catch (error) {
            console.error('Error fetching priorities:', error);
        }
    };

    const fetchEmployees = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/employees/');
            setEmployees(response.data.results);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const fetchProjects = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/projects/');
            setProjects(response.data.results);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/l_users/');
            setUsers(response.data.results);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleToggleDelete = async (id) => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/tasks/${id}/`, {
                ...tasks.find(task => task.id === id),
                is_deleted: !tasks.find(task => task.id === id).is_deleted
            });
            fetchTasks();
        } catch (error) {
            console.error('Error toggling delete status:', error);
        }
    };

    const handleInputChange = async (id, fieldName, value) => {

        try {
            const taskToUpdate = tasks.find(task => task.id === id);
            const updatedTask = {...taskToUpdate, [fieldName]: value};
            // Перед отправкой запроса устанавливаем задержку в 500 мс
            axios.put(`http://127.0.0.1:8000/api/tasks/${id}/`, updatedTask);
            fetchTasks()
        } catch (err) {
            console.error('Error upd status:', err)
        }
    }

    const handleCreateTask = async () => {
        try {
            await axios.post('http://127.0.0.1:8000/api/tasks/', {
                name,
                description,
                status,
                priority,
                start_date: startDate,
                due_date: dueDate,
                assigned_to: assignedTo,
                project,
            });
            fetchTasks();
            setName('');
            setDescription('');
            setStatus('');
            setPriority('');
            setStartDate('');
            setDueDate('');
            setAssignedTo('');
            setProject('');
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };
    const {isAuthenticated} = useContext(AuthContext);
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
            <View>
                <Text>Сортировать по:</Text>
                <Picker
                    selectedValue={sortBy} // Устанавливаем выбранное значение
                    onValueChange={setSortBy} // Обработчик изменения значения
                >
                    <Picker.Item label="ID" value="id"/>
                    <Picker.Item label="ID-" value="-id"/>
                    <Picker.Item label="Названию" value="name"/>
                    <Picker.Item label="Названию-" value="-name"/>
                    <Picker.Item label="Статусу" value="status"/>
                    <Picker.Item label="Статусу-" value="-status"/>
                    <Picker.Item label="Приоритету" value="priority"/>
                    <Picker.Item label="Приоритету-" value="-priority"/>
                    <Picker.Item label="Исполнителю" value="assigned_to"/>
                    <Picker.Item label="Проекту" value="project"/>
                    <Picker.Item label="Сроку сдачи" value="due_date"/>
                    <Picker.Item label="Сроку сдачи-" value="-due_date"/>
                    <Picker.Item label="Дате начала" value="start_date"/>
                    <Picker.Item label="Дате начала-" value="-start_date"/>
                </Picker>
            </View>
            <View style={styles.filter}>
                <Text style={styles.label}>Поиск:</Text>
                <TextInput
                    style={styles.input}
                    value={filterBy}
                    onChangeText={setFilterBy}
                />
            </View>
            <ScrollView horizontal>
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title style={styles.tableContainer}>Задача</DataTable.Title>
                        <DataTable.Title style={styles.tableContainer}>Статус</DataTable.Title>
                        <DataTable.Title style={styles.tableContainer}>Приоритет</DataTable.Title>
                        <DataTable.Title style={styles.tableContainer}>Дата начала</DataTable.Title>
                        <DataTable.Title style={styles.tableContainer}>Срок выполнения</DataTable.Title>
                        <DataTable.Title style={styles.tableContainer}>Исполнитель</DataTable.Title>
                        <DataTable.Title style={styles.tableContainer}>Проект</DataTable.Title>
                    </DataTable.Header>
                    {tasks.map((task) => task.is_deleted ? null : (
                        <DataTable.Row key={task.id}>
                            <DataTable.Cell style={styles.cell}>
                                <FlatList
                                    data={[task]} // Оберните task в массив
                                    renderItem={({item}) => (
                                        <View>
                                            <Text style={{padding: 10, fontWeight: 600}}>{item.name}</Text>
                                            <Text style={{padding: 10, maxWidth: 100}}>{item.description}</Text>
                                        </View>
                                    )}
                                />
                            </DataTable.Cell>
                            <DataTable.Cell style={styles.cell}>
                                <Picker
                                    style={styles.cell}
                                    selectedValue={task.status}
                                    onValueChange={(value) => handleInputChange(task.id, 'status', value)}
                                >
                                    {statuses.map((status) => (
                                        <Picker.Item
                                            style={{fontSize: 15, width: 100}}
                                            key={status.id} label={status.name} value={status.id}/>
                                    ))}
                                </Picker>
                            </DataTable.Cell>
                            <DataTable.Cell style={styles.cell}>
                                <Picker
                                    selectedValue={task.priority}
                                    style={styles.cell}
                                    onValueChange={(value) => handleInputChange(task.id, 'priority', value)}
                                >
                                    {priorities.map((priority) => (
                                        <Picker.Item
                                            style={{fontSize: 15, width: 100}}
                                            key={priority.id} label={priority.name} value={priority.id}/>
                                    ))}
                                </Picker>
                            </DataTable.Cell>
                            <DataTable.Cell style={styles.cell}>
                                <Text>{task.start_date}</Text>
                            </DataTable.Cell>
                            <DataTable.Cell style={styles.cell}>
                                <Text style={styles.cell}>
                                    {task.due_date}
                                </Text>
                            </DataTable.Cell>
                            <DataTable.Cell
                                style={styles.cell}>
                                <Text>
                                    {users.find(u => u.id === employees.find(u => u.id === task.assigned_to)?.user)?.username}
                                </Text>
                            </DataTable.Cell>
                            <DataTable.Cell style={styles.cell}>
                                <Text>
                                    {projects.find(p => p.id === task.project)?.name}
                                </Text>
                            </DataTable.Cell>
                        </DataTable.Row>
                    ))}
                </DataTable>
            </ScrollView>
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
        maxWidth: 100,
        minWidth: 100,
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
});

export default Task;