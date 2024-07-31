import React, {useEffect, useState} from "react";
import axios from "axios";

const Project = () => {
    const [projects, setProjects] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [nextPage, setNextPage] = useState(null);
    const [prevPage, setPrevPage] = useState(null);
    const [sortBy, setSortBy] = useState('id');
    const [filterBy, setFilterBy] = useState('');

    useEffect(() => {
        fetchProjects();
    }, [currentPage, sortBy, filterBy]);

    const fetchProjects = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/projects/?page=${currentPage}&ordering=${sortBy}&search=${filterBy}`);
            setProjects(response.data.results);
            setTotalPages(response.data.total_pages);
            setNextPage(response.data.next);
            setPrevPage(response.data.previous);
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

    return (
        <div className="w-100">
            <title>Проекты</title>
            <h2 className="p-3">Проекты</h2>
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
                    placeholder="Название проекта"
                />
                <input
                    className="m-2"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Описание проекта"
                />
                <input
                    className="m-2"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="Дата начала"
                />
                <input
                    className="m-2"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="Дата окончания"
                />
                <button
                    className="btn bg-info"
                    onClick={handleCreateProject}
                >
                    Создать проект
                </button>
            </div>
            <table className="d-flex flex-column">
                <thead>
                <tr className="mb-5 d-flex justify-content-around align-items-start">
                    <th style={{fontSize: '0.65em'}}>Название</th>
                    <th style={{fontSize: '0.65em'}}>Описание</th>
                    <th style={{fontSize: '0.65em'}}>Дата начала</th>
                    <th style={{fontSize: '0.65em'}}>Дата окончания</th>
                    <th style={{fontSize: '0.65em'}}>Удалено</th>
                    <th style={{fontSize: '0.65em'}}>Действия</th>
                </tr>
                </thead>
                <tbody>
                {projects.map((project) => (
                    <tr key={project.id} className="d-flex justify-content-around ">
                        <td>
                            {project.name}
                        </td>
                        <td>
                            {project.description}
                        </td>
                        <td>
                            {project.start_date}
                        </td>
                        <td>
                            {project.end_date}
                        </td>
                        <td>
                            {project.is_deleted ? 'Да' : 'Нет'}
                        </td>
                        <td>
                            <button
                                className="btn bg-danger"
                                onClick={() => handleDeleteProject(project.id)}>
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

export default Project;