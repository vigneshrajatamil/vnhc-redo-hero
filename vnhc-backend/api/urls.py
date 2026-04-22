from django.urls import path
from api import views

urlpatterns = [

    # ── Auth ──────────────────────────────────────────────────────────────────
    path('auth/csrf/',   views.csrf_view,   name='auth-csrf'),
    path('auth/me/',     views.auth_me,     name='auth-me'),
    path('auth/login/',  views.auth_login,  name='auth-login'),
    path('auth/logout/', views.auth_logout, name='auth-logout'),

    # ── Products ──────────────────────────────────────────────────────────────
    path('products/',          views.products_list,   name='products-list'),
    path('products/create/',   views.products_create, name='products-create'),
    path('products/<uuid:pk>/update/', views.products_update, name='products-update'),
    path('products/<uuid:pk>/delete/', views.products_delete, name='products-delete'),

    # ── Gallery ───────────────────────────────────────────────────────────────
    path('gallery/',                    views.gallery_list,   name='gallery-list'),
    path('gallery/upload/',             views.gallery_upload, name='gallery-upload'),
    path('gallery/<uuid:pk>/delete/',   views.gallery_delete, name='gallery-delete'),

    # ── Contact ───────────────────────────────────────────────────────────────
    path('contact/',                        views.contact_submit,    name='contact-submit'),
    path('contact/messages/',               views.contact_list,      name='contact-list'),
    path('contact/<uuid:pk>/read/',         views.contact_mark_read, name='contact-read'),
    path('contact/<uuid:pk>/delete/',       views.contact_delete,    name='contact-delete'),

    # ── Admin User Management ─────────────────────────────────────────────────
    path('admin-users/',                    views.admin_users_list,   name='admin-users-list'),
    path('admin-users/create/',             views.admin_users_create, name='admin-users-create'),
    path('admin-users/<uuid:pk>/delete/',   views.admin_users_delete, name='admin-users-delete'),
    path('admin-users/<uuid:pk>/toggle/',   views.admin_users_toggle, name='admin-users-toggle'),
]
