import React, {useEffect, useState} from "react";
import axios from 'axios';
import UserRole from "./UserRole";

const Role = () => {
    const [roles, setRoles] = useState([]);
    const [name, setName] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [nextPage, setNextPage] = useState(null);
    const [prevPage, setPrevPage] = useState(null);
    const [sortBy, setSortBy] = useState('id');
    const [filterBy, setFilterBy] = useState('');

    useEffect(() => {
        fetchRoles();
    }, [currentPage, sortBy, filterBy]);

    const fetchRoles = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/roles/?page=${currentPage}&ordering=${sortBy}&search=${filterBy}`);
            setRoles(response.data.results);
            setTotalPages(response.data.total_pages);
            setNextPage(response.data.next);
            setPrevPage(response.data.previous);
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    const handleCreateRole = async () => {
        try {
            await axios.post('http://127.0.0.1:8000/api/roles/', {
                name,
            });
            fetchRoles();
            setName('');
        } catch (error) {
            console.error('Error creating role:', error);
        }
    };

    const handleDeleteRole = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/roles/${id}/`);
            fetchRoles();
        } catch (error) {
            console.error('Error deleting role:', error);
        }
    };

    const handleRestoreRole = async (id) => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/roles/${id}/`, {
                ...roles.find(task => task.id === id),
                is_deleted: !roles.find(task => task.id === id).is_deleted
            });
            fetchRoles();
        } catch (error) {
            console.error('Error restoring role:', error);
        }
    };

    const [editedRoleName, setEditedRoleName] = useState("");

    const handleInputChange = async (id, fieldName, value) => {
        try {
            const roleToUpdate = roles.find(r => r.id === id);
            const updatedRole = {...roleToUpdate, [fieldName]: value};
            // await Promise(r => setTimeout(r, 5000));
            await axios.put(`http://127.0.0.1:8000/api/roles/${id}/`, updatedRole);
            fetchRoles();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleRoleChange = async (id, role) => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/roles/${id}/`, {
                "name": role
            });
            fetchRoles();
        } catch (error) {
            console.log('Error updating role:', error);;
        }
    };

    return (
        <div className="w-100">
            <title>Роли</title>
            <h2 className="p-3">Роли</h2>
            <div className={`filter mb-3`}>
                <label className={`m-2`}>Сортировать по:</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="id">ID</option>
                    <option value="name">Названию</option>
                </select>
                <label className={`p-2`}>Поиск:</label>
                <input className={`m-2`} type="text" value={filterBy} onChange={(e) => setFilterBy(e.target.value)}/>
            </div>
            <div className="creates mb-3">
                <input
                    className="m-2"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Название роли"
                />
                <button
                    className="btn bg-info"
                    onClick={handleCreateRole}
                >
                    Создать роль
                </button>
            </div>
            <table className="table flex-column">
                <thead>
                <tr>
                    <th style={{color: `white`}} scope="col">Название</th>
                    <th style={{color: `white`}} scope="col">Действия</th>
                </tr>
                </thead>
                <tbody>
                {roles.map((role) => (
                    <tr key={role.id} style={{border: `transparent`}}>
                        <td>
                            <input
                                type="text"
                                value={role.name}
                                onChange={(e) => handleInputChange(role.id, 'name', e.target.value)}
                            />
                        </td>
                        <td>
                            {role.is_deleted ? (
                                <button
                                    className="btn bg-success"
                                    onClick={() => handleRestoreRole(role.id)}
                                >
                                    Восстановить
                                </button>
                            ) : (
                                <button
                                    className="btn bg-danger"
                                    onClick={() => handleDeleteRole(role.id)}
                                >
                                    Удалить
                                </button>
                            )}
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
            <UserRole/>
        </div>
    );
};

export default Role;