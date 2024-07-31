import React, {useEffect, useState} from "react";
import axios from "axios";


const Employee = () => {
    const [employees, setEmployees] = useState([]);
    const [teams, setTeams] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState('');
    const [selectedUser, setSelectedUser] = useState('');


    useEffect(() => {
        fetchTeams();
        fetchUsers();
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/employees/');
            setEmployees(response.data.results);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const fetchTeams = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/teams/');
            setTeams(response.data.results);
        } catch (error) {
            console.error('Error fetching teams:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/l_users/');
            // Добавить обработку полученных пользователей, например:
            setUsers(response.data.results);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleAssignTeam = async () => {
        try {
            await axios.post('http://127.0.0.1:8000/api/employees/', {
                user: selectedUser,
                team: selectedTeam
            });
            fetchEmployees();
            setSelectedUser('');
            setSelectedTeam('');
        } catch (error) {
            console.error('Error assigning team:', error);
        }
    };

    const handleRemoveEmployee = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/employees/${id}/`);
            fetchEmployees();
        } catch (error) {
            console.error('Error removing employee:', error);
        }
    };

    const handleRestoreTeam = async (id) => {
        try {
            // Отправляем запрос на восстановление роли по её ID
            await axios.put(`http://127.0.0.1:8000/api/teams/${id}/`, {
                ...teams.find(team => team.id === id),
                is_deleted: !teams.find(task => task.id === id).is_deleted
            });
            // Перезагружаем список ролей
            fetchTeams();
        } catch (error) {
            console.error('Error restoring role:', error);
        }
    };

        const handleEmployeeChange = async (id, fieldName: string, value) => {
            try {
                const EmployeeToUpdate = employees.find(r => r.id === id);
                const updatedEmployee = {...EmployeeToUpdate, [fieldName]: value};
                await axios.put(`http://127.0.0.1:8000/api/employees/${id}/`, updatedEmployee);
                fetchEmployees();
            } catch (error) {
                console.error('Error updating task:', error);
            }
        };

    return (
        <div className="w-100">
            <h2 className="p-3">Управление сотрудниками</h2>
            <div className="mb-3">
                <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
                    <option value="">Выберите пользователя</option>
                    {users.map(user => (
                        <option
                            style={{color: `white`, borderRadius: `0%`, border: `none`,}}
                            key={user.id} value={user.id}>{user.username}</option>
                    ))}
                </select>
                <select value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)}>
                    <option value="">Выберите команду</option>
                    {teams.map((team) => (
                        <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                </select>
                <button className="btn bg-info" onClick={handleAssignTeam}>Назначить команду</button>
            </div>
            <table className="table" style={{color: 'white'}}>
                <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Пользователь</th>
                    <th scope="col">Команда</th>
                    <th scope="col">Действия</th>
                </tr>
                </thead>
                <tbody>

                {employees.map((employee) => (

                    <tr key={employee.id}>
                        <td>{employee.id}</td>
                        <select
                            value={employee.user}
                            onChange={(e) => handleEmployeeChange(employee.id,'user', e.target.value)}>
                            <option value="">Выберите пользователя</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.username}
                                </option>
                            ))}
                        </select>


                        {/*<td>{teams.find(t => t.id === employee.team)?.name}</td>*/}
                        <td>
                        <select
                            value={employee.team}
                            onChange={(e) => handleEmployeeChange(employee.id, 'team', e.target.value)}>

                            {teams.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.name}
                                </option>
                            ))}
                        </select>
                        </td>
                        <td>
                        <button
                                className={`btn ${employee.is_deleted ? 'bg-success' : 'bg-danger'}`}
                                onClick={() => employee.is_deleted ? handleRestoreTeam(employee.id) : handleRemoveEmployee(employee.id)}
                            >
                                {employee.is_deleted ? 'Восстановить' : 'Удалить'}
                            </button>

                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};
export default Employee;