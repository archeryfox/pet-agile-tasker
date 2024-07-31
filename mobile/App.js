import React, {useContext} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from "@react-navigation/drawer";
import Auth from "./components/Auth";
import Users from "./components/Users";
import Project from "./components/Projects";
import Task from "./components/Task";
import {AuthProvider} from './AuthProvider'

import {LinearGradient} from 'expo-linear-gradient';

const Drawer = createDrawerNavigator();

export default function App() {

    return (
        <AuthProvider>
            <NavigationContainer>
                <LinearGradient
                    colors={['transparent', 'rgba(119,49,155,0.24)']}
                    style={styles.background}/>
                <Drawer.Navigator initialRouteName="Auth">
                    <Drawer.Screen name="Вход" component={Auth}/>
                    <Drawer.Screen name="Задачи" component={Task}/>
                    <Drawer.Screen name="Проекты" component={Project}/>
                    <Drawer.Screen name="Пользователи" component={Users}/>
                </Drawer.Navigator>
            </NavigationContainer>
        </AuthProvider>
    );
}

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
    background: {
        left: 0,
        borderBottomRightRadius: 100,
         borderBottomLeftRadius: 100,
        right: 0,
        top: 0,
        height: 30,
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
    tableContainer: {
        // borderWidth: 1,
        // borderColor: 'gray',
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
        flex: 1,
        textAlign: 'center',
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

