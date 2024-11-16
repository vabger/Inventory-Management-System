from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import LoginView,RegisterView,UserListView,UserDeleteView

urlpatterns = [
    path("login", LoginView.as_view(), name="login"),
    path("register",RegisterView.as_view(),name="create_user"),
    path("",UserListView.as_view(),name="list_user"),
    path("delete",UserDeleteView.as_view(),name="delete_user"),
    path("refresh",TokenRefreshView.as_view(),name="refresh_token")
]

