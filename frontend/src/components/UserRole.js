import React, {useEffect, useState} from "react";
import axios from "axios";

export const UserRole = () => {
    const [userRoles, setUserRoles] = useState([]);
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [filterBy, setFilterBy] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [nextPage, setNextPage] = useState(null);
    const [prevPage, setPrevPage] = useState(null);

    useEffect(() => {
        fetchUsers();
        fetchRoles();
        fetchUserRoles();
    }, [currentPage, sortBy, filterBy]);

    const fetchUserRoles = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/user_roles/?page=${currentPage}&ordering=${sortBy}&search=${filterBy}`);
            setUserRoles(response.data.results);
            setTotalPages(response.data.total_pages);
            setNextPage(response.data.next);
            setPrevPage(response.data.previous);
        } catch (error) {
            alert('Error fetching user roles:', error);
        }
    };


    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/l_users/');
            setUsers(response.data.results);
        } catch (error) {
            alert('Error fetching users:', error);
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/roles/');
            setRoles(response.data.results);
        } catch (error) {
            alert('Error fetching roles:', error);
        }
    };

    const handleAssignRole = async () => {
        try {
            await axios.post('http://127.0.0.1:8000/api/user_roles/', {
                user: selectedUser,
                role: selectedRole
            });
            fetchUserRoles();
            setSelectedUser('');
            setSelectedRole('');
        } catch (error) {
            alert('Error assigning role:', error);
        }
    };

    const handleRemoveUserRole = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/user_roles/${id}/`);
            fetchUserRoles();
        } catch (error) {
            alert('Error removing user role:', error);
        }
    };

    const handleUserChange = async (id, userId) => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/user_roles/${id}/`, {
                user: userId,
                role: userRoles.find((userRole) => userRole.id === id).role
            });
            fetchUserRoles();
        } catch (error) {
            alert('Error updating user:', error);
        }
    };

    const handleRoleChange = async (id, roleId) => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/user_roles/${id}/`, {
                user: userRoles.find((userRole) => userRole.id === id).user,
                role: roleId
            });
            fetchUserRoles();
        } catch (error) {
            alert('Error updating role:', error);
        }
    };

    return (
        <div className="w-100">
            <h2 className="p-3">Управление ролями пользователей</h2>
            <div className="mb-3">
                <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
                    <option value="">Выберите пользователя</option>
                    {users.map(user => (
                        <option key={user.id} value={user.id}>{user.username}</option>
                    ))}
                </select>
                <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
                    <option value="">Выберите роль</option>
                    {roles.map((role) => (
                        <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                </select>
                <button className="btn bg-info" onClick={handleAssignRole}>Назначить роль</button>
            </div>
            <div className="mb-3">
                <label htmlFor="sort">Сортировать по:</label>
                <select id="sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="id">ID</option>
                    <option value="user">Пользователю</option>
                    <option value="role">Роли</option>
                </select>
                <label htmlFor="filter">Фильтровать по:</label>
                <input id="filter" type="text" value={filterBy} onChange={(e) => setFilterBy(e.target.value)}/>
            </div>
            <table className="table flex-column" style={{color: 'white'}}>
                <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Пользователь</th>
                    <th scope="col">Роль</th>
                    <th scope="col">Действия</th>
                </tr>
                </thead>
                <tbody>
                {userRoles.map((userRole) => (
                    <tr className={`h5`} style={{border: `transparent`}} key={userRole.id}>
                        <td>{userRole.id}</td>
                        <select
                            value={userRole.user}
                            onChange={(e) => handleUserChange(userRole.id, e.target.value)}>
                            <option value="">Выберите пользователя</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.username}
                                </option>
                            ))}
                        </select>
                        <td>
                            <select
                                value={userRole.role}
                                onChange={(e) => handleRoleChange(userRole.id, e.target.value)}>
                                <option value="">Выберите роль</option>
                                {roles.map((role) => (
                                    <option key={role.id} value={role.id}>
                                        {role.name}
                                    </option>
                                ))}
                            </select>
                        </td>
                        <td>
                            <button
                                className="btn bg-danger"
                                onClick={() => handleRemoveUserRole(userRole.id)}>
                                Удалить
                            </button>
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
        </div>
    );
};
export default UserRole;