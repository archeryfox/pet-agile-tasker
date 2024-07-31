import React, {useEffect, useState} from "react";
import axios from 'axios';


export const Task = () => {
    const [tasks, setTasks] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('');
    const [priority, setPriority] = useState('');
    const [startDate, setStartDate] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [users, setUsers] = useState([]);

    const [project, setProject] = useState('');
    const [statuses, setStatuses] = useState([]);
    const [priorities, setPriorities] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [projects, setProjects] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [nextPage, setNextPage] = useState(null);
    const [prevPage, setPrevPage] = useState(null);
    const [sortBy, setSortBy] = useState('id'); // По умолчанию сортируем по ID
    const [filterBy, setFilterBy] = useState('');

    useEffect(() => {
        fetchTasks();
        fetchStatuses();
        fetchPriorities();
        fetchProjects();
        fetchUsers()
        fetchEmployees();
    }, [currentPage, sortBy, filterBy]);

    const fetchTasks = async () => {
        try {
            // Добавляем параметры запроса для сортировки и фильтрации
            const response = await axios.get(`http://127.0.0.1:8000/api/tasks/?page=${currentPage}&ordering=${sortBy}&search=${filterBy}`);
            setTasks(response.data.results);
            setTotalPages(Math.ceil(response.data.count / 10));
            setNextPage(response.data.next);
            setPrevPage(response.data.previous);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const handleNextPage = () => {
        if (nextPage) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (prevPage) {
            setCurrentPage(currentPage - 1);
        }
    };

    const fetchStatuses = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/task_statuses/');
            setStatuses(response.data.results);
        } catch (error) {
            console.error('Error fetching statuses:', error);
        }
    };

    const fetchPriorities = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/priorities/');
            setPriorities(response.data.results);
        } catch (error) {
            console.error('Error fetching priorities:', error);
        }
    };

    const fetchEmployees = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/employees/');
            setEmployees(response.data.results);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const fetchProjects = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/projects/');
            setProjects(response.data.results);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };
    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/l_users/');
            setUsers(response.data.results);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleToggleDelete = async (id) => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/tasks/${id}/`, {
                ...tasks.find(task => task.id === id),
                is_deleted: !tasks.find(task => task.id === id).is_deleted
            });
            fetchTasks();
        } catch (error) {
            console.error('Error toggling delete status:', error);
        }
    };

    const handleInputChange = async (id, fieldName, value) => {
        try {
            const taskToUpdate = tasks.find(task => task.id === id);
            const updatedTask = {...taskToUpdate, [fieldName]: value};
            // await Promise(r => setTimeout(r, 5000));
            await axios.put(`http://127.0.0.1:8000/api/tasks/${id}/`, updatedTask);

            fetchTasks();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };


    const handleCreateTask = async () => {
        try {
            await axios.post('http://127.0.0.1:8000/api/tasks/', {
                name,
                description,
                status,
                priority,
                start_date: startDate,
                due_date: dueDate,
                assigned_to: assignedTo,
                project,
            });
            fetchTasks();
            // Очистить поля после успешного создания задачи
            setName('');
            setDescription('');
            setStatus('');
            setPriority('');
            setStartDate('');
            setDueDate('');
            setAssignedTo('');
            setProject('');
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/tasks/${id}/`);
            fetchTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    return (
        <div className={`w-100`}>
            <title>Задачи</title>
            <h2 className={"p-3"}>Задчи</h2>
            <div className={`filter mb-3`}>
                <label className={`m-2`}>Сортировать по:</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="id">ID</option>
                    <option value="name">Названию</option>
                    <option value="status">Статусу</option>
                    <option value="priority">Приоритету</option>
                    <option value="startDate">Старту</option>
                    <option value="dueDate">Сроку</option>
                    <option value="project">Проекту</option>
                    <option value="assigned_to">Исполнитель</option>
                </select>
                <label className={`p-2`}>Поиск:</label>
                <input className={`m-2`} type="text" value={filterBy} onChange={(e) => setFilterBy(e.target.value)}/>
            </div>
            <table className={"d-flex flex-column"}>
                <thead>
                <tr className={`mb-5 d-flex justify-content-around align-items-start`}>
                    <th colSpan="2" style={{fontSize: `0.65em`}}>Название</th>
                    <th colSpan="2" style={{fontSize: `0.65em`}}>Описание</th>
                    <th style={{fontSize: `0.65em`}}>Статус</th>
                    <th style={{fontSize: `0.65em`}}>Приоритет</th>
                    <th style={{fontSize: `0.65em`}}>Создано</th>
                    <th style={{fontSize: `0.65em`}}>Срок сдачи</th>
                    <th style={{fontSize: `0.65em`}}>Выполняет</th>
                    <th style={{fontSize: `0.65em`}}>Проект</th>
                    <th style={{fontSize: `0.65em`}}>Удалено</th>
                </tr>
                </thead>
                <tbody>
                {tasks.map((task) => (
                    <tr key={task.id} className={`d-flex justify-content-around `}>
                        <td colSpan="2">
                            <input value={task.name}
                                   onChange={(e) => handleInputChange(task.id, 'name', e.target.value)}/>
                        </td>
                        <td colSpan="2">
                            <textarea value={task.description}
                                      onChange={(e) => handleInputChange(task.id, 'description', e.target.value)}/>
                        </td>
                        <td>
                            <select value={task.status}
                                    onChange={(e) => handleInputChange(task.id, 'status', e.target.value)}>
                                {statuses.map((status) => (
                                    <option key={status.id} value={status.id}>{status.name}</option>
                                ))}
                            </select>
                        </td>
                        <td>
                            <select value={task.priority}
                                    onChange={(e) => handleInputChange(task.id, 'priority', e.target.value)}>
                                {priorities.map((priority) => (
                                    <option key={priority.id} value={priority.id}>{priority.name}</option>
                                ))}
                            </select>
                        </td>
                        <td><input type="date" value={task.start_date}
                                   onChange={(e) => handleInputChange(task.id, 'start_date', e.target.value)}/></td>
                        <td><input type="date" value={task.due_date}
                                   onChange={(e) => handleInputChange(task.id, 'due_date', e.target.value)}/></td>
                        <td>
                            <select value={task.assigned_to}
                                    onChange={(e) => handleInputChange(task.id, 'assigned_to', e.target.value)}>
                                {employees.map((employee) => (
                                    <option key={employee.id}
                                            value={employee.id}>{users.find(u => u.id === employee.user)?.username}</option>
                                ))}
                            </select>
                        </td>
                        <td>
                            <select value={task.project}
                                    onChange={(e) => handleInputChange(task.id, 'project', e.target.value)}>
                                {projects.map((project) => (
                                    <option key={project.id} value={project.id}>{project.name}</option>
                                ))}
                            </select>
                        </td>
                        <td>
                            <input
                                type="checkbox"
                                checked={task.is_deleted}
                                onChange={() => handleToggleDelete(task.id)}
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
            <div className={`w-100 p-5`}>
                <h2>Создание задачи</h2>
                <form className={'mt-1  form-container'} onSubmit={handleCreateTask}>
                    <div className="form-block pb-0 mb-0 p-2 d-flex flex-column">
                        <input className={`m-1 w-25 text-light place bg-transparent  left border-transperent p-1`}
                               type="text"
                               value={name} onChange={(e) => setName(e.target.value)} placeholder="Название задачи"/>
                        <br/>
                        <textarea className={`m-1 mt-0 w-75 text-light place bg-transparent border-transperent p-1`}
                                  style={{height: `7em`}}
                                  value={description} onChange={(e) => setDescription(e.target.value)}
                                  placeholder="Что делать надо"/>
                    </div>
                    <div className="form-block p-2 d-flex flex-column">
                        <select className={`m-1 w-25 text-light place border-transperent p-1`} value={status}
                                onChange={(e) => setStatus(e.target.value)}>
                            <option value="">Выберите статус</option>
                            {statuses.map((status) => (
                                <option key={status.id} value={status.id}>{status.name}</option>
                            ))}
                        </select>
                        <select className={`m-1 w-25 text-light place border-transperent p-1`} value={priority}
                                onChange={(e) => setPriority(e.target.value)}>
                            <option value="">Выберите приоритет</option>
                            {priorities.map((priority) => (
                                <option key={priority.id} value={priority.id}>{priority.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-block p-2 d-flex flex-column">
                        <p className={`m-1 w-25 fs-5 text-light place bg-transparent border-transperent p-1`}>Дата
                            начала</p>
                        <input className={`m-1 w-25 text-light place bg-transparent border-transperent p-1`} type="date"
                               value={startDate} onChange={(e) => setStartDate(e.target.value)}
                               placeholder="Дата начала"/>

                        <p className={`m-1 w-25 fs-5 text-light place bg-transparent border-transperent p-1`}>Срок
                            выполнения</p>
                        <input className={`m-1 w-25 text-light place bg-transparent border-transperent p-1`} type="date"
                               value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                               placeholder="Срок выполнения"/>
                    </div>
                    <div className="form-block p-2 d-flex flex-column">
                        <select className={`m-1 w-25 text-light place border-transperent p-1`} value={assignedTo}
                                onChange={(e) => setAssignedTo(e.target.value)}>
                            <option value="">Выберите исполнителя</option>
                            {employees.map((employee) => (
                                <option key={employee.id}
                                        value={employee.id}>{users.find(u => u.id === employee.user)?.username}</option>
                            ))}
                        </select>
                        <select className={`m-1 w-25 text-light place border-transperent p-1`} value={project}
                                onChange={(e) => setProject(e.target.value)}>
                            <option value="">Выберите проект</option>
                            {projects.map((project) => (
                                <option key={project.id} value={project.id}>{project.name}</option>
                            ))}
                        </select>
                    </div>
                    <button className={`btn bg-info`} type="submit">Создать задачу</button>
                </form>

            </div>
        </div>
    );
};
export default Task;