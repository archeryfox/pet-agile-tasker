# Как собрать проект
## Способ 1
```shell
git clone https://github.com/archeryfox/pet-agile-tasker
cd pet-agile-tasker
```
Или просто скачиваем через
![image](https://github.com/user-attachments/assets/19099c0d-2ba7-4f34-a807-c6d5124c2403)
Затем разворачиваем через доктор компот
```shell
docker-compose up
```
## Способ 2
![image](https://github.com/user-attachments/assets/b4230f72-065c-4fb6-a41e-7b1aa0867491)
Через этих товарищей
```
docker pull ghcr.io/archeryfox/pet-agile-tasker/mobile:latest
docker pull ghcr.io/archeryfox/pet-agile-tasker/frontend:latest
docker pull ghcr.io/archeryfox/fullstack-agile/backend:0.5.0
```
И готово, открываем http://localhost:3000(десктоп), http://localhost:8000(бекенд апи, по сути можно не открывать), http://localhost:8081(мобильная версия на React Native)  
Вход логин 123 пароль 123
