import React, {useEffect, useState} from "react";
import axios from "axios";


const TeamManagement = () => {
    const [teams, setTeams] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [name, setName] = useState('');
    const [lead, setLead] = useState('');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/teams/');
            setTeams(response.data.results);
        } catch (error) {
            console.error('Error fetching teams:', error);
            setErrorMessage('Произошла ошибка при загрузке команд.');
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/l_users/');
            setUsers(response.data.results);
        } catch (error) {
            console.error('Error fetching users:', error);
            setErrorMessage('Произошла ошибка при загрузке пользователей.');
        }
    };

    const handleCreateTeam = async () => {
        try {
            await axios.post('http://127.0.0.1:8000/api/teams/', {
                name,
                lead
            });
            setName('');
            setLead('');
            fetchTeams();
        } catch (error) {
            console.error('Error creating team:', error);
            setErrorMessage('Произошла ошибка при создании команды.');
        }
    };
    const handleUpdateTeam = async (id, updatedTeam) => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/teams/${id}/`, updatedTeam);
            fetchTeams();
        } catch (error) {
            console.error('Error updating team:', error);
            setErrorMessage('Произошла ошибка при обновлении команды.');
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


    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/teams/${id}/`);
            fetchTeams();
        } catch (error) {
            console.error('Error deleting team:', error);
            setErrorMessage('Произошла ошибка при удалении команды.');
        }
    };

    return (
        <div className={`container`}>
            <div className="team-list">
                <h3>Список команд</h3>
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                <table className="table" style={{color: 'white'}}>
                    <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Название</th>
                        <th scope="col">Руководитель</th>
                        <th scope="col">Удалено</th>
                        <th scope="col">Действия</th>
                    </tr>
                    </thead>
                    <tbody style={{border: 'transparent'}}>
                    {teams.map(team => (
                        <tr key={team.id}>
                            <td>{team.id}</td>
                            <td><input type="text" value={team.name} onChange={(e) => handleUpdateTeam(team.id, {
                                name: e.target.value,
                                lead: team.lead
                            })}/></td>
                            <select value={team.lead} onChange={(e) => handleUpdateTeam(team.id, {
                                name: team.name,
                                lead: e.target.value
                            })}>
                                {users.map(user => (
                                    <option key={user.id} value={user.id}>{user.username}</option>
                                ))}
                            </select>
                            <td> {team.is_deleted ? 'Да' : 'Нет'}</td>
                            <td>
                                <button
                                    className={`btn ${team.is_deleted ? 'bg-success' : 'bg-danger'}`}
                                    onClick={() => team.is_deleted ? handleRestoreTeam(team.id) : handleDelete(team.id)}
                                >
                                    {team.is_deleted ? 'Восстановить' : 'Удалить'}
                                </button>

                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <hr/>

            <div className="create-form">
                <h3>Создать команду</h3>
                <div className="mb-3 w-25 bg-transperent">
                    <label htmlFor="name" className="form-label">Название</label>
                    <input type="text" className="form-control"
                           style={{
                               background: 'transparent',
                               color: `white`,
                               borderRadius: `0%`,
                               border: `none`,
                               borderBottom: `solid 2px grey`
                           }}
                           id="name" value={name}
                           onChange={(e) => setName(e.target.value)}/>
                </div>
                <div className="mb-3 w-25">
                    <label htmlFor="lead" className="form-label ">Руководитель</label>
                    <select style={{
                        background: 'transparent',
                        color: `white`,
                        borderRadius: `0%`,
                        border: `none`,
                        borderBottom: `solid 2px grey`
                    }}
                            className="form-control " id="lead" value={lead} onChange={(e) => setLead(e.target.value)}>
                        <option style={{color: `black`, borderRadius: `0%`, borderBottom: `solid 3px grey`}}
                                value="">Выберите руководителя
                        </option>
                        {users.map(user => (
                            <option
                                style={{color: `black`, borderRadius: `0%`, border: `none`,}}
                                key={user.id} value={user.id}>{user.username}</option>
                        ))}
                    </select>
                </div>
                <button type="button" className="btn btn-primary" onClick={handleCreateTeam}>Создать</button>
            </div>
        </div>
    );
};
export default TeamManagement;