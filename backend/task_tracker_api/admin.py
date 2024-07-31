from django.contrib import admin
from .models import Role, LogicUser, Project, Team, Employee, Priority, TaskStatus, Task, TaskComment, History, Log, UserRole

# Register your models here.

@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']


@admin.register(LogicUser)
class UserAdmin(admin.ModelAdmin):
    list_display = ['id', 'username', 'email', 'token']


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'start_date', 'end_date']

@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']

@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'team']

@admin.register(Priority)
class PriorityAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']

@admin.register(TaskStatus)
class TaskStatusAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'status', 'priority', 'assigned_to', 'project']

@admin.register(TaskComment)
class TaskCommentAdmin(admin.ModelAdmin):
    list_display = ['id', 'task', 'user', 'comment_text', 'comment_date']

@admin.register(History)
class HistoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'task', 'user', 'field_changed', 'old_value', 'new_value', 'change_date']

@admin.register(Log)
class LogAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'action', 'timestamp']

@admin.register(UserRole)
class UserRoleAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'role']

