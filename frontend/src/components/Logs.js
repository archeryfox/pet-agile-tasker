import React, {useEffect, useState} from "react";
import axios from "axios";

export const Logs = () => {
    const [logs, setLogs] = useState([]);
    const [users, setUsers] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchUsers()
        fetchLogs();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/l_users/');
            setUsers(response.data.results);
        } catch (error) {
            console.error('Error fetching users:', error);
            setErrorMessage('Произошла ошибка при загрузке пользователей.');
        }
    };

    const fetchLogs = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/logs/');
            setLogs(response.data.results);
        } catch (error) {
            console.error('Error fetching logs:', error);
        }
    };

    const handleDeleteLog = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/logs/${id}/`);
            fetchLogs();
        } catch (error) {
            console.error('Error deleting log:', error);
        }
    };

    return (
        <div className="w-100 ">
            <h2 className="p-3">Журнал действий</h2>
            <table className="table" style={{color: 'white'}}>
                <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Пользователь</th>
                    <th scope="col">Действие</th>
                    <th scope="col">Время</th>
                    <th scope="col">Действия</th>
                </tr>
                </thead>
                <tbody>
                {logs.map((log) => (
                    <tr key={log.id}>
                        <td>{log.id}</td>
                        <td>{users.find(u => u.id === log.user)?.username}</td>
                        <td>{log.action}</td>
                        <td>{new Date(log.timestamp).toLocaleString()}</td>
                        <td>
                            <button className="btn btn-danger" onClick={() => handleDeleteLog(log.id)}>
                                Удалить
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};
export default Logs;