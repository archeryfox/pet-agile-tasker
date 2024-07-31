from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager


class Role(models.Model):
    name = models.CharField(max_length=255)
    is_deleted = models.BooleanField(default=False)  # Добавлено поле для множественного логического удаления

    def __str__(self):
        return self.name

    def delete(self, using=None, keep_parents=False):
        self.is_deleted = True
        self.save(using=using)

    def restore(self):
        self.is_deleted = False
        self.save()

    class Meta:
        verbose_name = 'Роль'
        verbose_name_plural = 'Роли'


class LogicUser(models.Model):
    username = models.CharField(max_length=255, verbose_name='Имя пользователя')
    email = models.CharField(max_length=255, verbose_name='Email')
    password = models.CharField(max_length=255, verbose_name='Пароль')
    roles = models.ManyToManyField(Role, through='UserRole', related_name='users')
    token = models.CharField(max_length=255, verbose_name='Токен', default="", editable=False)
    is_deleted = models.BooleanField(default=False)  # Добавлено поле для множественного логического удаления

    def __str__(self):
        return self.username

    def delete(self, using=None, keep_parents=False):
        self.is_deleted = True
        self.save(using=using)

    def restore(self):
        self.is_deleted = False
        self.save()


class UserManager(BaseUserManager):
    def create_user(self, email, username, password=None):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, username=username)
        user.is_active = True
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None):
        user = self.create_user(email, username, password=password)
        user.is_admin = True
        user.save(using=self._db)
        return user

class User(AbstractBaseUser):
    username = models.CharField(max_length=255, verbose_name='Имя пользователя')
    email = models.CharField(max_length=255, verbose_name='Email')
    password = models.CharField(max_length=255, verbose_name='Пароль')
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    last_login = models.DateTimeField(blank=True, null=True, auto_created=True)
    objects = UserManager()
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['username', 'password']

    def has_perm(self, perm, obj=None):
        return self.is_admin

    def has_module_perms(self, app_label):
        return self.is_admin

class Project(models.Model):
    name = models.CharField(max_length=255, verbose_name='Название')
    description = models.CharField(max_length=255, verbose_name='Описание')
    start_date = models.DateField(verbose_name='Дата начала')
    end_date = models.DateField(verbose_name='Дата окончания')
    is_deleted = models.BooleanField(default=False)  # Добавлено поле для множественного логического удаления

    def __str__(self):
        return self.name

    def delete(self, using=None, keep_parents=False):
        self.is_deleted = True
        self.save(using=using)

    def restore(self):
        self.is_deleted = False
        self.save()

    class Meta:
        verbose_name = 'Проект'
        verbose_name_plural = 'Проекты'


class Team(models.Model):
    name = models.CharField(max_length=255, verbose_name='Название')
    lead = models.ForeignKey(LogicUser, on_delete=models.CASCADE, verbose_name='Руководитель')
    is_deleted = models.BooleanField(default=False)  # Добавлено поле для множественного логического удаления

    def __str__(self):
        return self.name

    def delete(self, using=None, keep_parents=False):
        self.is_deleted = True
        self.save(using=using)

    def restore(self):
        self.is_deleted = False
        self.save()

    class Meta:
        verbose_name = 'Команда'
        verbose_name_plural = 'Команды'


class Employee(models.Model):
    user = models.ForeignKey(LogicUser, on_delete=models.CASCADE, verbose_name='Пользователь')
    team = models.ForeignKey(Team, on_delete=models.CASCADE, verbose_name='Команда')

    def __str__(self):
        return self.user.username

    class Meta:
        verbose_name = 'Сотрудник'
        verbose_name_plural = 'Сотрудники'
        unique_together = ('user', 'team')

class Priority(models.Model):
    name = models.CharField(max_length=255, verbose_name='Название')
    is_deleted = models.BooleanField(default=False)  # Добавлено поле для множественного логического удаления

    def __str__(self):
        return self.name

    def delete(self, using=None, keep_parents=False):
        self.is_deleted = True
        self.save(using=using)

    def restore(self):
        self.is_deleted = False
        self.save()

    class Meta:
        verbose_name = 'Приоритет'
        verbose_name_plural = 'Приоритеты'


class TaskStatus(models.Model):
    name = models.CharField(max_length=255, verbose_name='Название')
    is_deleted = models.BooleanField(default=False)  # Добавлено поле для множественного логического удаления

    def __str__(self):
        return self.name

    def delete(self, using=None, keep_parents=False):
        self.is_deleted = True
        self.save(using=using)

    def restore(self):
        self.is_deleted = False
        self.save()

    class Meta:
        verbose_name = 'Статус задачи'
        verbose_name_plural = 'Статусы задач'


class Task(models.Model):
    name = models.CharField(max_length=255, verbose_name='Название')
    description = models.CharField(max_length=255, verbose_name='Описание')
    status = models.ForeignKey(TaskStatus, on_delete=models.CASCADE, verbose_name='Статус')
    priority = models.ForeignKey(Priority, on_delete=models.CASCADE, verbose_name='Приоритет')
    start_date = models.DateField(verbose_name='Дата начала')
    due_date = models.DateField(verbose_name='Дата окончания')
    assigned_to = models.ForeignKey(Employee, on_delete=models.CASCADE, verbose_name='Исполнитель')
    project = models.ForeignKey(Project, on_delete=models.CASCADE, verbose_name='Проект')

    is_deleted = models.BooleanField(default=False)  # Добавлено поле для множественного логического удаления

    def __str__(self):
        return self.name

    def delete(self, using=None, keep_parents=False):
        self.is_deleted = True
        self.save(using=using)

    def restore(self):
        self.is_deleted = False
        self.save()

    class Meta:
        verbose_name = 'Задача'
        verbose_name_plural = 'Задачи'


class TaskComment(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, verbose_name='Задача')
    user = models.ForeignKey(LogicUser, on_delete=models.CASCADE, verbose_name='Пользователь')
    comment_text = models.CharField(max_length=255, verbose_name='Текст комментария')
    comment_date = models.DateTimeField(verbose_name='Дата комментария', auto_now_add=True)
    is_deleted = models.BooleanField(default=False)  # Добавлено поле для множественного логического удаления

    def __str__(self):
        return self.comment_text

    def delete(self, using=None, keep_parents=False):
        self.is_deleted = True
        self.save(using=using)

    def restore(self):
        self.is_deleted = False
        self.save()

    class Meta:
        verbose_name = 'Комментарий к задаче'
        verbose_name_plural = 'Комментарии к задачам'


class History(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, verbose_name='Задача')
    user = models.ForeignKey(LogicUser, on_delete=models.CASCADE, verbose_name='Пользователь')
    field_changed = models.CharField(max_length=255, verbose_name='Измененное поле')
    old_value = models.CharField(max_length=255, verbose_name='Старое значение')
    new_value = models.CharField(max_length=255, verbose_name='Новое значение')
    change_date = models.DateTimeField(verbose_name='Дата изменения', auto_now_add=True)
    is_deleted = models.BooleanField(default=False)  # Добавлено поле для множественного логического удаления

    def __str__(self):
        return self.field_changed

    def delete(self, using=None, keep_parents=False):
        self.is_deleted = True
        self.save(using=using)

    def restore(self):
        self.is_deleted = False
        self.save()

    class Meta:
        verbose_name = 'История изменений'
        verbose_name_plural = 'История изменений'


class Log(models.Model):
    user = models.ForeignKey(LogicUser, on_delete=models.CASCADE, verbose_name='Пользователь')
    action = models.CharField(max_length=255, verbose_name='Действие')
    timestamp = models.DateTimeField(verbose_name='Временная метка', auto_now_add=True)
    is_deleted = models.BooleanField(default=False)  # Добавлено поле для множественного логического удаления

    def __str__(self):
        return self.action

    def delete(self, using=None, keep_parents=False):
        self.is_deleted = True
        self.save(using=using)

    def restore(self):
        self.is_deleted = False
        self.save()

    class Meta:
        verbose_name = 'Лог'
        verbose_name_plural = 'Логи'


class UserRole(models.Model):
    user = models.ForeignKey(LogicUser, on_delete=models.CASCADE, verbose_name='Пользователь')
    role = models.ForeignKey(Role, on_delete=models.CASCADE, verbose_name='Роль')

    def __str__(self):
        return f"{self.user} - {self.role.name}"

    class Meta:
        verbose_name = 'Роль пользователя'
        verbose_name_plural = 'Роли пользователей'
        unique_together = ('user', 'role')