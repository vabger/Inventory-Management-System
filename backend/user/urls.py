from django.urls import path

from .views import LoginView,RegisterView

urlpatterns = [
    path("login", LoginView.as_view(), name="login"),
    # path("logout",views.logout,name="logout"),
    path("register",RegisterView.as_view(),name="register")
]

