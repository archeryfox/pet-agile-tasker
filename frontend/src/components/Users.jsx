import React, {useEffect, useState} from "react";
import axios from 'axios';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selectedRolesBuffer, setSelectedRolesBuffer] = useState({});

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [nextPage, setNextPage] = useState(null);
    const [prevPage, setPrevPage] = useState(null);
    const [sortBy, setSortBy] = useState('id');
    const [filterBy, setFilterBy] = useState('');

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [selectedRoles, setSelectedRoles] = useState([]);

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, [currentPage, sortBy, filterBy]);

    const fetchRoles = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/roles/`);
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
            // await new Promise(r => setTimeout(r, 5000));
            await axios.put(`http://127.0.0.1:8000/api/l_users/${id}/`, updatedUser);
            fetchUsers();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleCreateUser = async () => {
        try {
            await axios.post("http://127.0.0.1:8000/api/users/", {
                username,
                email,
                password,
                roles: selectedRoles,
            });
            // Reset form fields after successful user creation
            setUsername("");
            setEmail("");
            setPassword("");
            setSelectedRoles([]);
            fetchUsers()
            // Optionally, you can add some feedback to the user here
        } catch (error) {
            console.error("Error creating user:", error);
            // Optionally, you can handle errors and provide feedback to the user
        }
    };

    const applySelectedRolesChanges = async () => {
        try {
            await Promise.all(Object.keys(selectedRolesBuffer).map(async id => {
                const userRoleId = users.find(user => user.id === parseInt(id)).role;
                const updatedUserRole = {
                    user: selectedRolesBuffer[id],
                    role: userRoleId
                };
                await axios.put(`http://127.0.0.1:8000/api/user_roles/${userRoleId}/`, updatedUserRole);
            }));
            fetchUsers();
        } catch (error) {
            console.error('Error updating user roles:', error);
        } finally {
            setSelectedRolesBuffer({});
        }
    };


    const handleToggleDelete = async (id) => {
        try {
            const userToDelete = users.find(user => user.id === id);
            const updatedUser = {...userToDelete, is_deleted: !userToDelete.is_deleted};
            await axios.put(`http://127.0.0.1:8000/api/l_users/${id}/`, updatedUser);
            fetchUsers(); // Перезагрузка списка пользователей после обновления данных
        } catch (error) {
            console.error('Error toggling delete status:', error);
        }
    };

    return (
        <div className="w-100">
            <h2 className="p-3">Управление пользователями</h2>
            <div className={`filter mb-3`}>
                <label className={`m-2`}>Сортировать по:</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="id">ID</option>
                    <option value="-id">ID dsc</option>
                    <option value="username">Имени</option>
                    <option value="token">Tокену</option>
                    <option value="-username">Имени dsc</option>
                    <option value="email">Почте</option>
                    <option value="-email">Почте dsc</option>
                    <option value="-is_deleted">Удалено</option>
                    <option value="is_deleted">Существует</option>
                </select>
                <label className={`p-2`}>Поиск:</label>
                <input className={`m-2`} type="text" value={filterBy} onChange={(e) => {
                    setFilterBy(e.target.value);
                    fetchUsers()
                }}/>
            </div>
            <table className={"d-flex table flex-column"} style={{color: "white", border: "transparent"}}>
                <thead>
                <tr className={`mb-5 d-flex justify-content-around align-items-start`}>
                    <th style={{fontSize: `0.65em`}}>Имя пользователя</th>
                    <th style={{fontSize: `0.65em`}}>Email</th>
                    <th style={{fontSize: `0.65em`}}>Роли</th>
                    <th style={{fontSize: `0.65em`}}>Токен</th>
                    <th style={{fontSize: `0.65em`}}>Удалено</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.id} className={`d-flex justify-content-around `}>
                        <td>
                            <input value={user.username}
                                   onChange={(e) => handleInputChange(user.id, 'username', e.target.value)}/>
                        </td>
                        <td>
                            <input value={user.email}
                                   onChange={(e) => handleInputChange(user.id, 'email', e.target.value)}/>
                        </td>
                        <td>
                            <select
                                value={user.roles.map(role => role.is_deleted ? null : role.id)}
                                onChange={(e) => handleInputChange(user.id, 'roles', Array.from(e.target.selectedOptions, option => option.value))}
                            >
                                {roles.map((role) => {
                                    if (user.roles.includes(role.id)) return <option key={role.id}
                                                                                     value={role.id}>{role.name}</option>
                                })}
                            </select>
                        </td>
                        <td>
                            <input value={user.token} disabled
                                   className={`fs-6`}
                                   onChange={(e) => {
                                   }}/>
                        </td>
                        <td>
                            <input
                                type="checkbox"
                                checked={user.is_deleted}
                                onChange={() => handleToggleDelete(user.id)}
                            />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div>
                <button className={`btn bg-primary border-0 m-3`} disabled={!prevPage}
                        onClick={() => setCurrentPage(currentPage - 1)}>Предыдущая
                </button>
                <span>{currentPage} / {totalPages}</span>
                <button className={`btn bg-primary border-0 m-3`} disabled={!nextPage}
                        onClick={() => setCurrentPage(currentPage + 1)}>Следующая
                </button>
            </div>
            <div>
                <h2>Создать пользователя</h2>
                <div>
                    <label>Логин:</label>
                    <input
                        className={`m-2 `}
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label>Почта:</label>
                    <input
                        className={`m-2 `}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label>Пароль:</label>
                    <input
                        className={`m-2 `}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="button" className={`btn m-2 button bg-primary`} style={{color: 'white'}}
                        onClick={handleCreateUser}>Создать
                </button>
            </div>
        </div>
    );
};

export default Users;
