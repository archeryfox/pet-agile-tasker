from rest_framework import filters, permissions
from rest_framework.pagination import PageNumberPagination

from task_tracker_api.models import LogicUser


class CustomPagination(PageNumberPagination):
    page_size = 10  # Количество элементов на странице
    page_query_param = 'page'  # Имя параметра запроса для указания номера страницы
    page_size_query_param = 'page_size'  # Имя параметра запроса для указания размера страницы
    max_page_size = 1000  # Максимальное количество элементов на странице

class UserFilter(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        # Получаем параметры фильтрации из запроса
        role = request.query_params.get('roles')
        email = request.query_params.get('email')
        print(role)
        # Фильтруем queryset на основе параметров
        if role:
            queryset = LogicUser.objects.filter(roles=role)
        if email:
            queryset = LogicUser.objects.filter(email=email)
        if role and email:
            queryset = LogicUser.objects.filter(email=email, roles=role)
        print(queryset)

        return queryset
