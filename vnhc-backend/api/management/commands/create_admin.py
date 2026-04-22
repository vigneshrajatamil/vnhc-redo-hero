from django.core.management.base import BaseCommand
from api.models import AdminUser


class Command(BaseCommand):
    help = 'Create the first admin user for the VNHC admin portal.'

    def add_arguments(self, parser):
        parser.add_argument('--username', default='admin',    help='Admin username (default: admin)')
        parser.add_argument('--email',    default='admin@vnhc.com', help='Admin email')
        parser.add_argument('--password', default='Admin@1234',     help='Admin password (min 8 chars)')

    def handle(self, *args, **options):
        username = options['username']
        email    = options['email']
        password = options['password']

        if len(password) < 8:
            self.stderr.write(self.style.ERROR('Password must be at least 8 characters.'))
            return

        if AdminUser.objects.filter(username=username).exists():
            self.stdout.write(self.style.WARNING(f'Admin "{username}" already exists. Skipping.'))
            return

        user = AdminUser(username=username, email=email)
        user.set_password(password)
        user.save()

        self.stdout.write(self.style.SUCCESS(
            f'\nAdmin user created successfully!\n'
            f'   Username : {username}\n'
            f'   Email    : {email}\n'
            f'   Password : {password}\n'
            f'\nLogin at /admin/login in your browser.\n'
        ))
