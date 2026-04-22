import uuid
from django.db import models
from werkzeug.security import generate_password_hash, check_password_hash


# ─────────────────────────────────────────────────────────────────────────────
# Admin User
# ─────────────────────────────────────────────────────────────────────────────
class AdminUser(models.Model):
    """
    Custom admin model — no Django auth, no django.contrib.admin.
    Passwords are hashed using werkzeug PBKDF2-SHA256.
    """
    id           = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username     = models.CharField(max_length=150, unique=True)
    email        = models.EmailField(unique=True)
    password_hash = models.CharField(max_length=256)
    is_active    = models.BooleanField(default=True)
    created_at   = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'vnhc_admin_user'
        ordering = ['created_at']

    def set_password(self, raw_password: str):
        self.password_hash = generate_password_hash(raw_password)

    def check_password(self, raw_password: str) -> bool:
        return check_password_hash(self.password_hash, raw_password)

    def __str__(self):
        return self.username


# ─────────────────────────────────────────────────────────────────────────────
# Product
# ─────────────────────────────────────────────────────────────────────────────
def product_image_upload_path(instance, filename):
    ext = filename.rsplit('.', 1)[-1].lower()
    return f'products/{uuid.uuid4()}.{ext}'


class Product(models.Model):
    STOCK_CHOICES = [
        ('in_stock',     'In Stock'),
        ('low_stock',    'Low Stock'),
        ('out_of_stock', 'Out of Stock'),
    ]

    id           = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title        = models.CharField(max_length=255)
    description  = models.TextField(blank=True, null=True)
    category     = models.CharField(max_length=100)
    tag          = models.CharField(max_length=100, blank=True, null=True)
    price        = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    weight       = models.CharField(max_length=50, blank=True, null=True)
    sku          = models.CharField(max_length=100, blank=True, null=True)
    stock_status = models.CharField(max_length=20, choices=STOCK_CHOICES, default='in_stock')
    image        = models.ImageField(upload_to=product_image_upload_path, blank=True, null=True)
    created_by   = models.ForeignKey(
        AdminUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='products'
    )
    created_at   = models.DateTimeField(auto_now_add=True)
    updated_at   = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'vnhc_product'
        ordering = ['-created_at']

    def __str__(self):
        return self.title


# ─────────────────────────────────────────────────────────────────────────────
# Gallery Image / Video
# ─────────────────────────────────────────────────────────────────────────────
def gallery_file_upload_path(instance, filename):
    ext = filename.rsplit('.', 1)[-1].lower()
    return f'gallery/{uuid.uuid4()}.{ext}'


class GalleryItem(models.Model):
    id         = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title      = models.CharField(max_length=255, blank=True, null=True)
    file       = models.FileField(upload_to=gallery_file_upload_path)
    is_video   = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'vnhc_gallery_item'
        ordering = ['-created_at']

    def __str__(self):
        return self.title or str(self.id)


# ─────────────────────────────────────────────────────────────────────────────
# Contact Message
# ─────────────────────────────────────────────────────────────────────────────
class ContactMessage(models.Model):
    id         = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name       = models.CharField(max_length=255)
    email      = models.EmailField()
    phone      = models.CharField(max_length=20, blank=True, null=True)
    subject    = models.CharField(max_length=255, blank=True, null=True)
    message    = models.TextField()
    is_read    = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'vnhc_contact_message'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.name} — {self.subject or "No subject"}'
