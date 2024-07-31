import './App.css';
import React, {useContext} from 'react';
import {Route, Routes} from 'react-router-dom';
import {Layout} from "./Layout";
import Users from "./components/Users";
import Logs from "./components/Logs";
import Auth from "./components/Auth";
import TaskCommentTable from "./components/TaskCommentTable";
import Task from "./components/Task";
import Priority from "./components/Priority";
import Project from "./components/Project";
import TeamManagement from "./components/TeamManagement";
import History from "./components/History";
import Role from './components/Role'
import Employee from "./components/Employee";
import UserRole from "./components/UserRole";
import {AuthProvider} from "./AuthProvider";


const App = () => {
    return (
        <AuthProvider>
            <div className="App w-100 align-content-end d-flex flex-column vh-100">
                <main className="">
                    <Layout/>
                    <Routes>
                        <Route index element={<Auth/>}/>
                        <Route path='tasks' element={<Task/>}/>
                        <Route path='teams' element={<TeamManagement/>}/>
                        <Route path='users' element={<Users/>}/>
                        <Route path='priority' element={<Priority/>}/>
                        <Route path='coments' element={<TaskCommentTable/>}/>
                        <Route path='logs' element={<Logs/>}/>
                        <Route path='history' element={<History/>}/>
                        <Route path='employee' element={<Employee/>}/>
                        <Route path='projects' element={<Project/>}/>
                        <Route path='user_role' element={<UserRole/>}/>
                        <Route path='role' element={<Role/>}/>
                    </Routes>
                </main>
            </div>
        </AuthProvider>
    );
};

export default App;