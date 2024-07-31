# Используем базовый образ Python
FROM python:3.9

# Устанавливаем переменную окружения для отключения вывода буферизации
ENV PYTHONUNBUFFERED 1

# Создаем и переходим в рабочую директорию /app
WORKDIR /app

# Копируем файлы requirements.txt в рабочую директорию
COPY requirements.txt /app/

# Устанавливаем зависимости из requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Копируем все файлы проекта в рабочую директорию
COPY . /app/

# Открываем порт 8000 для веб-сервера Django
EXPOSE 8000

# Запускаем сервер Django при старте контейнера
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
