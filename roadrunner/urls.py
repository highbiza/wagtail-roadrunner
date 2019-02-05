from django.urls import path

from . import views

urlpatterns = [
    path("page/", views.page, name="page"),
    path("image/", views.image, name="image"),
    path("document/", views.document, name="document"),
]

app_name = "roadrunner"
