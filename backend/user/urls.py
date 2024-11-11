from django.urls import path

from .views import LoginView,RegisterView,UserListView,UserDeleteView

urlpatterns = [
    path("login", LoginView.as_view(), name="login"),
    path("register",RegisterView.as_view(),name="register"),
    path("",UserListView.as_view(),name="list"),
    path("delete",UserDeleteView.as_view(),name="delete")

]

