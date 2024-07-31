import React, {useEffect, useState} from "react";
import axios from "axios";

const TaskCommentTable = () => {
    const [comments, setComments] = useState([]);
    const [users, setUsers] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [tasks, setTasks] = useState('');

    useEffect(() => {
        fetchComments();
        fetchTasks();
        fetchUsers();
    }, []);

    const fetchComments = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/task_comments');
            setComments(response.data.results);
        } catch (error) {
            console.error('Error fetching comments:', error);
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

    const fetchTasks = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/tasks/');
            setTasks(response.data.results);
        } catch (error) {
            console.error('Error fetching users:', error);
            setErrorMessage('Произошла ошибка при загрузке пользователей.');
        }
    };

    const handleInputChange = async (id, fieldName, value) => {
        try {
            await axios.put(`http://127.0.0.1:8000/task_comments/${id}/`, {[fieldName]: value});
            // Обновляем состояние, чтобы отобразить изменения без запроса на сервер
            setComments(prevComments =>
                prevComments.map(comment =>
                    comment.id === id ? {...comment, [fieldName]: value} : comment
                )
            );
        } catch (error) {
            console.error(`Error updating ${fieldName} for comment ${id}:`, error);
        }
    };

    return (
        <table className={`container mt-5`}>
            <title>Коментарии</title>
            <thead>
            <tr>
                <th>Задача</th>
                <th>Пользователь</th>
                <th>Текст комментария</th>
                <th>Дата комментария</th>
            </tr>
            </thead>
            <tbody>
            {comments.map(comment => (
                <tr key={comment.id}>
                      <td>{tasks.find(t => t.id === comment.task)?.name}{}</td>
                    <td>{users.find(u => u.id === comment.user)?.username}</td>
                    <td>
                        <textarea
                            type="text"
                            value={comment.comment_text}
                            onChange={e => handleInputChange(comment.id, 'comment_text', e.target.value)}
                        />
                    </td>
                    <td>{new Date(comment.comment_date).toLocaleString()}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};
export default TaskCommentTable;