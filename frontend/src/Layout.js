import {Link} from "react-router-dom";
import React, {useContext, useEffect} from "react";
import {AuthContext} from './AuthProvider'

export const Layout = () => {
    const {isAuthenticated, setIsAuthenticated} = useContext(AuthContext);

    useEffect(() => {

    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return null; // Возвращаем null, если пользователь не аутентифицирован
    } else {
        return (
            <div className={`w-100  align-items-start  justify-content-around  d-flex`}>
                <div className={`d-flex flex-column nav navbar-link`}>
                    <Link style={{textDecoration: `none`, color: `white`}} to='/tasks'>Задачи</Link>
                    <Link style={{textDecoration: `none`, color: `white`}} to='/projects'>Проекты</Link>
                </div>
                <div className={`d-flex flex-column nav navbar-link`}>
                    <Link style={{textDecoration: `none`, color: `white`}} to='/employee'>Работники</Link>
                    <Link style={{textDecoration: `none`, color: `white`}} to='/users'>Пользователи</Link>
                </div>
                <div className={`d-flex flex-column nav navbar-link`}>
                    <Link style={{textDecoration: `none`, color: `white`}} to='/teams'>Команды</Link>
                    <Link style={{textDecoration: `none`, color: `white`}} to='/history'>Изменения</Link>
                </div>
                <div className={`d-flex flex-column nav navbar-link`}>
                    <Link style={{textDecoration: `none`, color: `white`}} to='/role'>Роли</Link>
                    <Link style={{textDecoration: `none`, color: `white`}} to='/priority'>Приоритеты</Link>
                </div>
                <div className={`d-flex flex-column nav navbar-link`}>
                    <Link style={{textDecoration: `none`, color: `white`}} to='/logs'>Логи</Link>
                    <Link style={{textDecoration: `none`, color: `white`}} to='/coments'>Коменты</Link>
                </div>
            </div>
        )
    }
}