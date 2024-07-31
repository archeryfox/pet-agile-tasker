import React, {useEffect, useState} from "react";
import axios from "axios";

const Priority = () => {
    const [priorities, setPriorities] = useState([]);
    const [name, setName] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [nextPage, setNextPage] = useState(null);
    const [prevPage, setPrevPage] = useState(null);
    const [sortBy, setSortBy] = useState('id');
    const [filterBy, setFilterBy] = useState('');

    useEffect(() => {
        fetchPriorities();
    }, [currentPage, sortBy, filterBy]);

    const fetchPriorities = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/priorities/?page=${currentPage}&ordering=${sortBy}&search=${filterBy}`);
            setPriorities(response.data.results);
            setTotalPages(response.data.total_pages);
            setNextPage(response.data.next);
            setPrevPage(response.data.previous);
        } catch (error) {
            console.error('Error fetching priorities:', error);
        }
    };

    const handleCreatePriority = async () => {
        try {
            await axios.post('http://127.0.0.1:8000/api/priorities/', {
                name,
            });
            fetchPriorities();
            setName('');
        } catch (error) {
            console.error('Error creating priority:', error);
        }
    };

    const handleRestorePriority = async (id) => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/priorities/${id}/`, {
                ...priorities.find(p => p.id === id),
                is_deleted: !priorities.find(p => p.id === id).is_deleted
            });
            fetchPriorities();
        } catch (error) {
            console.error('Error restoring role:', error);
        }
    };

    const handleDeletePriority = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/priorities/${id}/`);
            fetchPriorities();
        } catch (error) {
            console.error('Error deleting priority:', error);
        }
    };

    return (
        <div className="w-100">
            <title>Приоритеты</title>
            <h2 className="p-3">Приоритеты</h2>
            <div className={`filter mb-3`}>
                <label className={`m-2`}>Сортировать по:</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="id">ID</option>
                    <option value="name">Названию</option>
                </select>
                <label className={`p-2`}>Поиск:</label>
                <input className={`m-2`} type="text" value={filterBy} onChange={(e) => setFilterBy(e.target.value)}/>
            </div>
            <div className="mb-3">
                <input
                    className="m-2"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Название приоритета"
                />
                <button
                    className="btn bg-info"
                    onClick={handleCreatePriority}
                >
                    Создать приоритет
                </button>
            </div>
            <table className="d-flex flex-column">
                <thead>
                <tr className="mb-5 d-flex justify-content-around align-items-start">
                    <th style={{fontSize: '0.65em'}}>Название</th>
                    <th style={{fontSize: '0.65em'}}>Удалено</th>
                    <th style={{fontSize: '0.65em'}}>Действия</th>
                </tr>
                </thead>
                <tbody>
                {priorities.map((priority) => (
                    <tr key={priority.id} className="d-flex justify-content-around ">
                        <td>
                            {priority.name}
                        </td>
                        <td>
                            {priority.is_deleted ? 'Да' : 'Нет'}
                        </td>
                        <td>
                            {priority.is_deleted ? (
                                <button
                                    className="btn bg-success"
                                    onClick={() => handleRestorePriority(priority.id)}
                                >
                                    Восстановить
                                </button>
                            ) : (
                                <button
                                    className="btn bg-danger"
                                    onClick={() => handleDeletePriority(priority.id)}
                                >
                                    Удалить
                                </button>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Priority;