import React, {useEffect, useState} from "react";
import axios from "axios";

export const History = () => {
    const [history, setHistory] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/history/');
            setHistory(response.data.results);
        } catch (error) {
            console.error('Error fetching history:', error);
            setErrorMessage('Произошла ошибка при загрузке истории.');
        }
    };

    return (
        <div className="w-100">
            <h2 className="p-3">История изменений</h2>
            <table className="table" style={{color: 'white'}}>
                <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Задача</th>
                    <th scope="col">Пользователь</th>
                    <th scope="col">Измененное поле</th>
                    <th scope="col">Старое значение</th>
                    <th scope="col">Новое значение</th>
                    <th scope="col">Дата изменения</th>
                    <th scope="col">Удалено</th>
                </tr>
                </thead>
                <tbody>
                {history.map((item) => (
                    <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.task.name}</td>
                        <td>{item.user.username}</td>
                        <td>{item.field_changed}</td>
                        <td>{item.old_value}</td>
                        <td>{item.new_value}</td>
                        <td>{item.change_date}</td>
                        <td>{item.is_deleted ? 'Да' : 'Нет'}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            {errorMessage && <p className="text-danger">{errorMessage}</p>}
        </div>
    );
};
export default History;