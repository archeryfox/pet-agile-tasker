import React, {useContext, useEffect, useState} from 'react';
import {View, Text, TextInput, Button, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import axios from 'axios';
import {AuthContext} from '../AuthProvider'
import {Picker} from "@react-native-picker/picker";


const Project = ({navigation}) => {
    const [projects, setProjects] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [sortBy, setSortBy] = useState('id');
    const [filterBy, setFilterBy] = useState('');
    const {isAuthenticated} = useContext(AuthContext);

    useEffect(() => {
        fetchProjects();
    }, [sortBy, filterBy]);


    const fetchProjects = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/projects/?ordering=${sortBy}&search=${filterBy}`);
            setProjects(response.data.results);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const handleCreateProject = async () => {
        try {
            await axios.post('http://127.0.0.1:8000/api/projects/', {
                name,
                description,
                start_date: startDate,
                end_date: endDate
            });
            fetchProjects();
            setName('');
            setDescription('');
            setStartDate('');
            setEndDate('');
        } catch (error) {
            console.error('Error creating project:', error);
        }
    };

    const handleDeleteProject = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/projects/${id}/`);
            fetchProjects();
        } catch (error) {
            console.error('Error deleting project:', error);
        }
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
            <Text style={styles.header}>Проекты</Text>
            <View style={styles.filter}>
                <TextInput
                    style={styles.input}
                    placeholder="Название проекта"
                    value={filterBy}
                    onChangeText={setFilterBy}
                />

            </View>
            <Picker
                selectedValue={sortBy} // Устанавливаем выбранное значение
                onValueChange={setSortBy} // Обработчик изменения значения
                style={styles.filter}>
                <Picker.Item label="ID" value="id"/>
                <Picker.Item label="ID-" value="-id"/>
                <Picker.Item label="Названию" value="name"/>
                <Picker.Item label="Названию-" value="-name"/>
                <Picker.Item label="Сроку сдачи" value="due_date"/>
                <Picker.Item label="Сроку сдачи-" value="-due_date"/>
                <Picker.Item label="Дате начала" value="start_date"/>
                <Picker.Item label="Дате начала-" value="-start_date"/>
            </Picker>
            <ScrollView horizontal>
                <View>
                    <View style={styles.tableHeader}>
                        <Text style={styles.tableContainer}>Название</Text>
                        <Text style={styles.tableContainer}>Описание</Text>
                        <Text style={styles.tableContainer}>Дата начала</Text>
                        <Text style={styles.tableContainer}>Дата окончания</Text>
                    </View>
                    {projects.map((project) => project.is_deleted ? null :
                        <View key={project.id} style={styles.tableRow}>
                            <Text style={styles.cell}>{project.name}</Text>
                            <Text style={styles.cell}>{project.description}</Text>
                            <Text style={styles.cell}>{project.start_date}</Text>
                            <Text style={styles.cell}>{project.end_date}</Text>
                        </View>
                    )}
                </View>
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
    tableContainer: {
        minWidth: 150,
        maxWidth: 150,
        flex: 1,
        textAlign: 'center',
        justifyContent: `center`,
        alignItems: `center`,
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
        borderWidth: 1,
        borderColor: 'transparent',
        marginRight: 10,
        paddingHorizontal: 10,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
        paddingVertical: 5,
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

export default Project;
