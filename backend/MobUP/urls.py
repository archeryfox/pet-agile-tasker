from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from task_tracker_api.controllers import RoleViewSet, UserViewSet, ProjectViewSet, TeamViewSet, EmployeeViewSet, \
    PriorityViewSet, TaskStatusViewSet, TaskViewSet, TaskCommentViewSet, HistoryViewSet, LogViewSet, UserRoleViewSet, \
    AuthToken, LogicUserViewSet

router = routers.DefaultRouter()
router.register('roles', RoleViewSet)
router.register('users', UserViewSet)
router.register('l_users', LogicUserViewSet)
router.register('user_roles', UserRoleViewSet)
router.register('projects', ProjectViewSet)
router.register('teams', TeamViewSet)
router.register('employees', EmployeeViewSet)
router.register('priorities', PriorityViewSet)
router.register('tasks', TaskViewSet)
router.register('task_statuses', TaskStatusViewSet)
router.register('task_comments', TaskCommentViewSet)
router.register('history', HistoryViewSet)
router.register('logs', LogViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('auth/', AuthToken.as_view()),
]
