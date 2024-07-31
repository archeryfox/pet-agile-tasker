from django.contrib.auth import authenticate
from rest_framework import viewsets, filters
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework import status
from django_filters.rest_framework import DjangoFilterBackend
from .filters import UserFilter, CustomPagination
from .models import Role, Project, Team, Employee, Priority, TaskStatus, Task, TaskComment, History, Log, UserRole, \
    LogicUser
from django.contrib.auth.models import User
from .serializers import RoleSerializer, UserSerializer, ProjectSerializer, TeamSerializer, EmployeeSerializer, \
    PrioritySerializer, TaskStatusSerializer, TaskSerializer, TaskCommentSerializer, HistorySerializer, LogSerializer, \
    UserRoleSerializer, LogicUserSerializer


class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    http_method_names = ['get', 'post', 'put', 'delete', 'head']
    pagination_class = CustomPagination
    # Направление сортировки: 'asc' для по возрастанию, '-desc' для по убыванию
    ordering_fields = ['id', 'name', 'is_deleted']
    search_fields = ['name']
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]


class LogicUserViewSet(viewsets.ModelViewSet):
    queryset = LogicUser.objects.all()
    serializer_class = LogicUserSerializer
    http_method_names = ['get', 'post', 'put', 'delete', 'head']
    pagination_class = CustomPagination  # Добавляем пагинацию к представлению ProjectViewSet
    filter_backends = [DjangoFilterBackend, UserFilter, filters.OrderingFilter,  filters.SearchFilter]
    # Добавляем OrderingFilter для сортировки
    # Указываем поля, по которым можно сортировать
    ordering_fields = ['id', 'username', 'email', 'roles', 'is_deleted']  # Замените на ваши поля
    search_fields = ['username', 'email']  # Замените на ваши поля
    # Направление сортировки: 'asc' для по возрастанию, '-desc' для по убыванию
    ordering = ['id']  # Замените на ваши предпочтительные параметры сортировки



class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    http_method_names = ['get', 'post', 'put', 'delete', 'head']

    def create(self, request, *args, **kwargs):
        print(request.data)
        new_user_data = request.data.get("components")
        if not new_user_data:
            new_user_data = {
                "username": request.data['username'],
                "password": request.data['password'],
                "email": request.data['email']
            }
            if not 'username' in new_user_data and not 'username' in new_user_data and not 'username' in new_user_data:
                return Response({'error': 'components data is not'}, status=status.HTTP_400_BAD_REQUEST)
        User.objects.create_user(
            username=new_user_data.get('username'),
            email=new_user_data.get('email'),
            password=new_user_data.get('password')
        )
        user = authenticate(request, username=new_user_data.get('username'), password=new_user_data.get('password'))
        # print("Authenticated user:", user)  # Отладочный вывод
        if user is None:
            return Response({'error': 'Failed to authenticate user'}, status=status.HTTP_400_BAD_REQUEST)

        # Получаем или создаем токен пользователя
        token, _ = Token.objects.get_or_create(user=user)
        lsu = LogicUser(
            username=new_user_data.get('username'),
            email=new_user_data.get('email'),
            password=user.password,
            token=token
        )
        lsu.save()

        # Возвращаем успешный ответ с данными созданного пользователя и токеном
        serializer = UserSerializer(user)
        return Response({'user': serializer.data, 'token': token.key, 'salt': lsu.password.split('$')[2]},
                        status=status.HTTP_201_CREATED)


class AuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        print(request.data)
        serializer = self.serializer_class(data=request.data, context={'request': request})
        if serializer.is_valid():
            print(serializer.validated_data)
            user = serializer.validated_data['user']
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    http_method_names = ['get', 'post', 'put', 'delete', 'head']
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]  # Добавляем фильтры
    pagination_class = CustomPagination
    # Указываем поля, по которым можно сортировать
    ordering_fields = ['id', 'name', 'start_date', 'end_date', 'is_deleted']

    # Указываем поля, по которым можно осуществлять поиск
    search_fields = ['name', 'name','description']


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    http_method_names = ['get', 'post', 'put', 'delete', 'head']
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    ordering_fields = ['id', 'name', 'is_deleted']
    search_fields = ['name', 'lead__username', 'lead__email']  # Поиск по имени команды и руководителю


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    http_method_names = ['get', 'post', 'put', 'delete', 'head']
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]

    ordering_fields = ['id', 'is_deleted']
    search_fields = ['user__username', 'team__name']  # Поиск по имени пользователя и названию команды


class PriorityViewSet(viewsets.ModelViewSet):
    queryset = Priority.objects.all()
    serializer_class = PrioritySerializer
    http_method_names = ['get', 'post', 'put', 'delete', 'head']
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]

    ordering_fields = ['id', 'name', 'is_deleted']
    search_fields = ['name']


class TaskStatusViewSet(viewsets.ModelViewSet):
    queryset = TaskStatus.objects.all()
    serializer_class = TaskStatusSerializer
    http_method_names = ['get', 'post', 'put', 'delete', 'head']
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]

    ordering_fields = ['id', 'name', 'is_deleted']
    search_fields = ['name']


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    http_method_names = ['get', 'post', 'put', 'delete', 'head']
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]

    ordering_fields = ['id', 'name', 'start_date', 'due_date', 'is_deleted']
    search_fields = ['name', 'description']


    def create(self, request, *args, **kwargs):
        # Вывод отладочной информации о том, что получено в теле POST запроса
        print(request.data)

        # Продолжаем создание объекта, вызывая метод create() родительского класса
        return super().create(request, *args, **kwargs)

class TaskCommentViewSet(viewsets.ModelViewSet):
    queryset = TaskComment.objects.all()
    serializer_class = TaskCommentSerializer
    http_method_names = ['get', 'post', 'put', 'delete', 'head']
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]

    ordering_fields = ['id', 'comment_date', 'is_deleted']
    search_fields = ['comment_text']


class HistoryViewSet(viewsets.ModelViewSet):
    queryset = History.objects.all()
    serializer_class = HistorySerializer
    http_method_names = ['get', 'post', 'put', 'delete', 'head']
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]

    ordering_fields = ['id', 'change_date', 'is_deleted']
    search_fields = ['field_changed', 'old_value', 'new_value']


class LogViewSet(viewsets.ModelViewSet):
    queryset = Log.objects.all()
    serializer_class = LogSerializer
    http_method_names = ['get', 'post', 'put', 'delete', 'head']
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]

    ordering_fields = ['id', 'timestamp', 'is_deleted']
    search_fields = ['action']


class UserRoleViewSet(viewsets.ModelViewSet):
    queryset = UserRole.objects.all()
    serializer_class = UserRoleSerializer
    http_method_names = ['get', 'post', 'put', 'delete', 'head']
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]

    ordering_fields = ['id', 'is_deleted', 'user', 'role']
    search_fields = ['user__username', 'role__name']
