import json
import os
import re
import time

from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_http_methods

from api.models import AdminUser, Product, GalleryItem, ContactMessage


# ═════════════════════════════════════════════════════════════════════════════
#  AUTH GUARD DECORATOR
# ═════════════════════════════════════════════════════════════════════════════

def require_admin(view_func):
    """Protect a view — valid admin session required."""
    def wrapper(request, *args, **kwargs):
        admin_id = request.session.get('admin_id')
        if not admin_id:
            return JsonResponse({'error': 'Authentication required.'}, status=401)
        try:
            admin = AdminUser.objects.get(id=admin_id, is_active=True)
            request.admin = admin
        except AdminUser.DoesNotExist:
            request.session.flush()
            return JsonResponse({'error': 'Invalid or expired session.'}, status=401)
        return view_func(request, *args, **kwargs)
    wrapper.__name__ = view_func.__name__
    return wrapper


# ═════════════════════════════════════════════════════════════════════════════
#  AUTH VIEWS
# ═════════════════════════════════════════════════════════════════════════════

# Simple in-memory rate limiter (max 10 login attempts per IP per 5 min)
_login_attempts: dict = {}


def _rate_limit_ok(ip: str) -> bool:
    now = time.time()
    history = [t for t in _login_attempts.get(ip, []) if now - t < 300]
    if len(history) >= 10:
        return False
    history.append(now)
    _login_attempts[ip] = history
    return True


@ensure_csrf_cookie
def csrf_view(request):
    """GET /api/auth/csrf/  — sets CSRF cookie so the frontend can read it."""
    return JsonResponse({'detail': 'CSRF cookie set.'})


def auth_me(request):
    """GET /api/auth/me/  — returns current admin or null."""
    admin_id = request.session.get('admin_id')
    if not admin_id:
        return JsonResponse({'admin': None})
    try:
        admin = AdminUser.objects.get(id=admin_id, is_active=True)
        return JsonResponse({'admin': {'id': str(admin.id), 'username': admin.username, 'email': admin.email}})
    except AdminUser.DoesNotExist:
        request.session.flush()
        return JsonResponse({'admin': None})


def auth_login(request):
    """POST /api/auth/login/"""
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed.'}, status=405)

    ip = request.META.get('HTTP_X_FORWARDED_FOR', request.META.get('REMOTE_ADDR', ''))
    if not _rate_limit_ok(ip):
        return JsonResponse({'error': 'Too many login attempts. Try again in 5 minutes.'}, status=429)

    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON body.'}, status=400)

    username = body.get('username', '').strip()
    password = body.get('password', '').strip()

    if not username or not password:
        return JsonResponse({'error': 'Username and password are required.'}, status=400)

    try:
        admin = AdminUser.objects.get(username=username, is_active=True)
    except AdminUser.DoesNotExist:
        return JsonResponse({'error': 'Invalid credentials.'}, status=401)

    if not admin.check_password(password):
        return JsonResponse({'error': 'Invalid credentials.'}, status=401)

    # Rotate session key to prevent fixation attacks
    request.session.cycle_key()
    request.session['admin_id'] = str(admin.id)

    return JsonResponse({'id': str(admin.id), 'username': admin.username, 'email': admin.email})


@require_admin
def auth_logout(request):
    """POST /api/auth/logout/"""
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed.'}, status=405)
    request.session.flush()
    return JsonResponse({'detail': 'Logged out successfully.'})


# ═════════════════════════════════════════════════════════════════════════════
#  PRODUCT VIEWS
# ═════════════════════════════════════════════════════════════════════════════

ALLOWED_IMAGE_TYPES = {'image/jpeg', 'image/png', 'image/webp', 'image/gif'}


def _product_dict(p: Product, request) -> dict:
    image_url = request.build_absolute_uri(settings.MEDIA_URL + p.image.name) if p.image else None
    return {
        'id':           str(p.id),
        'title':        p.title,
        'description':  p.description,
        'category':     p.category,
        'tag':          p.tag,
        'price':        float(p.price) if p.price is not None else None,
        'weight':       p.weight,
        'sku':          p.sku,
        'stock_status': p.stock_status,
        'image_url':    image_url,
        'created_at':   p.created_at.isoformat(),
    }


def products_list(request):
    """GET /api/products/"""
    products = Product.objects.all()
    return JsonResponse({'products': [_product_dict(p, request) for p in products]})


@require_admin
def products_create(request):
    """POST /api/products/  — multipart/form-data"""
    title    = request.POST.get('title', '').strip()
    category = request.POST.get('category', '').strip()
    if not title or not category:
        return JsonResponse({'error': 'title and category are required.'}, status=400)

    image = request.FILES.get('image')
    if image:
        if image.content_type not in ALLOWED_IMAGE_TYPES:
            return JsonResponse({'error': 'Invalid image type. Use JPEG, PNG, WebP or GIF.'}, status=400)
        if image.size > settings.FILE_UPLOAD_MAX_MEMORY_SIZE:
            return JsonResponse({'error': 'Image too large (max 50 MB).'}, status=400)

    price_raw = request.POST.get('price', '').strip()
    try:
        price = float(price_raw) if price_raw else None
    except ValueError:
        return JsonResponse({'error': 'Invalid price value.'}, status=400)

    product = Product(
        title=title,
        description=request.POST.get('description', '').strip() or None,
        category=category,
        tag=request.POST.get('tag', '').strip() or None,
        price=price,
        weight=request.POST.get('weight', '').strip() or None,
        sku=request.POST.get('sku', '').strip() or None,
        stock_status=request.POST.get('stock_status', 'in_stock'),
        created_by=request.admin,
    )
    if image:
        product.image = image
    product.save()
    return JsonResponse(_product_dict(product, request), status=201)


@require_admin
def products_update(request, pk):
    """PUT/PATCH /api/products/<pk>/  — supports multipart or JSON"""
    try:
        product = Product.objects.get(id=pk)
    except Product.DoesNotExist:
        return JsonResponse({'error': 'Product not found.'}, status=404)

    if 'multipart' in request.content_type:
        data  = request.POST
        image = request.FILES.get('image')
    else:
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON.'}, status=400)
        image = None

    if 'title'        in data: product.title        = data['title'].strip()
    if 'description'  in data: product.description  = data.get('description', '').strip() or None
    if 'category'     in data: product.category     = data['category'].strip()
    if 'tag'          in data: product.tag           = data.get('tag', '').strip() or None
    if 'weight'       in data: product.weight        = data.get('weight', '').strip() or None
    if 'sku'          in data: product.sku           = data.get('sku', '').strip() or None
    if 'stock_status' in data: product.stock_status  = data['stock_status']
    if 'price'        in data:
        p = str(data.get('price', '')).strip()
        product.price = float(p) if p else None

    if image:
        if image.content_type not in ALLOWED_IMAGE_TYPES:
            return JsonResponse({'error': 'Invalid image type.'}, status=400)
        # Delete old image file
        if product.image:
            old = product.image.path
            if os.path.exists(old):
                os.remove(old)
        product.image = image

    product.save()
    return JsonResponse(_product_dict(product, request))


@require_admin
def products_delete(request, pk):
    """DELETE /api/products/<pk>/"""
    try:
        product = Product.objects.get(id=pk)
    except Product.DoesNotExist:
        return JsonResponse({'error': 'Product not found.'}, status=404)

    if product.image:
        path = product.image.path
        if os.path.exists(path):
            os.remove(path)
    product.delete()
    return JsonResponse({'detail': 'Product deleted.'})


# ═════════════════════════════════════════════════════════════════════════════
#  GALLERY VIEWS
# ═════════════════════════════════════════════════════════════════════════════

ALLOWED_VIDEO_TYPES = {'video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'}


def _gallery_dict(item: GalleryItem, request) -> dict:
    file_url = request.build_absolute_uri(settings.MEDIA_URL + item.file.name) if item.file else None
    return {
        'id':         str(item.id),
        'title':      item.title,
        'image_url':  file_url,
        'is_video':   item.is_video,
        'created_at': item.created_at.isoformat(),
    }


def gallery_list(request):
    """GET /api/gallery/"""
    items = GalleryItem.objects.all()
    return JsonResponse({'images': [_gallery_dict(i, request) for i in items]})


@require_admin
def gallery_upload(request):
    """POST /api/gallery/  — multipart/form-data"""
    file = request.FILES.get('file')
    if not file:
        return JsonResponse({'error': 'No file provided.'}, status=400)

    is_video = file.content_type in ALLOWED_VIDEO_TYPES
    is_image = file.content_type in ALLOWED_IMAGE_TYPES

    if not is_image and not is_video:
        return JsonResponse({'error': 'Invalid file type. Images and videos only.'}, status=400)
    if file.size > settings.FILE_UPLOAD_MAX_MEMORY_SIZE:
        return JsonResponse({'error': 'File too large (max 50 MB).'}, status=400)

    title = request.POST.get('title', '').strip() or file.name.rsplit('.', 1)[0]
    item  = GalleryItem(title=title, file=file, is_video=is_video)
    item.save()
    return JsonResponse(_gallery_dict(item, request), status=201)


@require_admin
def gallery_delete(request, pk):
    """DELETE /api/gallery/<pk>/"""
    try:
        item = GalleryItem.objects.get(id=pk)
    except GalleryItem.DoesNotExist:
        return JsonResponse({'error': 'Item not found.'}, status=404)

    if item.file:
        path = item.file.path
        if os.path.exists(path):
            os.remove(path)
    item.delete()
    return JsonResponse({'detail': 'Deleted.'})


# ═════════════════════════════════════════════════════════════════════════════
#  CONTACT VIEWS
# ═════════════════════════════════════════════════════════════════════════════

def _msg_dict(m: ContactMessage) -> dict:
    return {
        'id':         str(m.id),
        'name':       m.name,
        'email':      m.email,
        'phone':      m.phone,
        'subject':    m.subject,
        'message':    m.message,
        'is_read':    m.is_read,
        'created_at': m.created_at.isoformat(),
    }


def contact_submit(request):
    """POST /api/contact/  — public"""
    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON.'}, status=400)

    name    = body.get('name', '').strip()
    email   = body.get('email', '').strip()
    message = body.get('message', '').strip()

    if not name or not email or not message:
        return JsonResponse({'error': 'name, email, and message are required.'}, status=400)
    if not re.match(r'^[^@\s]+@[^@\s]+\.[^@\s]+$', email):
        return JsonResponse({'error': 'Invalid email address.'}, status=400)

    ContactMessage.objects.create(
        name=name[:255],
        email=email[:254],
        phone=body.get('phone', '').strip()[:20] or None,
        subject=body.get('subject', '').strip()[:255] or None,
        message=message,
    )
    return JsonResponse({'detail': "Message received. We'll get back to you soon."}, status=201)


@require_admin
def contact_list(request):
    """GET /api/contact/  — admin only"""
    msgs = ContactMessage.objects.all()
    return JsonResponse({'messages': [_msg_dict(m) for m in msgs]})


@require_admin
def contact_mark_read(request, pk):
    """PATCH /api/contact/<pk>/read/"""
    try:
        msg = ContactMessage.objects.get(id=pk)
    except ContactMessage.DoesNotExist:
        return JsonResponse({'error': 'Not found.'}, status=404)
    msg.is_read = True
    msg.save(update_fields=['is_read'])
    return JsonResponse(_msg_dict(msg))


@require_admin
def contact_delete(request, pk):
    """DELETE /api/contact/<pk>/"""
    try:
        msg = ContactMessage.objects.get(id=pk)
    except ContactMessage.DoesNotExist:
        return JsonResponse({'error': 'Not found.'}, status=404)
    msg.delete()
    return JsonResponse({'detail': 'Deleted.'})


# ═════════════════════════════════════════════════════════════════════════════
#  ADMIN USER MANAGEMENT VIEWS
# ═════════════════════════════════════════════════════════════════════════════

def _admin_user_dict(u: AdminUser) -> dict:
    return {
        'id':         str(u.id),
        'username':   u.username,
        'email':      u.email,
        'is_active':  u.is_active,
        'created_at': u.created_at.isoformat(),
    }


@require_admin
def admin_users_list(request):
    """GET /api/admin-users/"""
    users = AdminUser.objects.all()
    return JsonResponse({'users': [_admin_user_dict(u) for u in users]})


@require_admin
def admin_users_create(request):
    """POST /api/admin-users/"""
    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON.'}, status=400)

    username = body.get('username', '').strip()
    email    = body.get('email', '').strip()
    password = body.get('password', '').strip()

    if not username or not email or not password:
        return JsonResponse({'error': 'username, email, and password required.'}, status=400)
    if len(password) < 8:
        return JsonResponse({'error': 'Password must be at least 8 characters.'}, status=400)
    if AdminUser.objects.filter(username=username).exists():
        return JsonResponse({'error': 'Username already taken.'}, status=400)
    if AdminUser.objects.filter(email=email).exists():
        return JsonResponse({'error': 'Email already in use.'}, status=400)

    user = AdminUser(username=username, email=email)
    user.set_password(password)
    user.save()
    return JsonResponse(_admin_user_dict(user), status=201)


@require_admin
def admin_users_delete(request, pk):
    """DELETE /api/admin-users/<pk>/"""
    if str(request.admin.id) == str(pk):
        return JsonResponse({'error': 'You cannot delete your own account.'}, status=403)
    try:
        user = AdminUser.objects.get(id=pk)
    except AdminUser.DoesNotExist:
        return JsonResponse({'error': 'User not found.'}, status=404)
    user.delete()
    return JsonResponse({'detail': 'Admin user deleted.'})


@require_admin
def admin_users_toggle(request, pk):
    """PATCH /api/admin-users/<pk>/toggle/  — activate / deactivate"""
    if str(request.admin.id) == str(pk):
        return JsonResponse({'error': 'You cannot deactivate your own account.'}, status=403)
    try:
        user = AdminUser.objects.get(id=pk)
    except AdminUser.DoesNotExist:
        return JsonResponse({'error': 'User not found.'}, status=404)
    user.is_active = not user.is_active
    user.save(update_fields=['is_active'])
    return JsonResponse(_admin_user_dict(user))
