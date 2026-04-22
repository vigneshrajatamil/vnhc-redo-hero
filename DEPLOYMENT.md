# VNHC VPS deployment notes

## Local development ports

- Backend Django app: `8181`
- Frontend Vite app: `5171`

## Environment files

Frontend file: `vnhc-redo-hero/.env`

```env
VITE_API_URL=
```

Backend file: `vnhc-backend/.env`

```env
DEBUG=False
SECRET_KEY=change-this-in-production
ALLOWED_HOSTS=your-domain.com,www.your-domain.com,server-ip,127.0.0.1,localhost
CSRF_TRUSTED_ORIGINS=https://your-domain.com,https://www.your-domain.com
CORS_ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
DB_NAME=vnhc_db
DB_USER=vnhc_user
DB_PASSWORD=change-me
DB_HOST=127.0.0.1
DB_PORT=3306
MEDIA_URL=/media/
MEDIA_ROOT=media
```

## Database bootstrap

Import the base schema first:

```powershell
mysql -u root -p < vnhc-backend/schema.sql
```

Then run Django migrations anyway so framework-managed tables stay aligned:

```powershell
cd vnhc-backend
python manage.py migrate
python manage.py create_admin --username admin --email admin@example.com --password ChangeMe123!
```

## Backend run command

Development:

```powershell
cd vnhc-backend
python manage.py runserver 0.0.0.0:8181
```

Production example with Gunicorn:

```powershell
cd vnhc-backend
gunicorn vnhc.wsgi:application --bind 127.0.0.1:8181
```

## Frontend run command

Development:

```powershell
cd vnhc-redo-hero
npm install
npm run dev -- --host 0.0.0.0 --port 5171
```

Production build:

```powershell
cd vnhc-redo-hero
npm install
npm run build
```

The build output will be in `vnhc-redo-hero/dist`. On the VPS, nginx should serve that directory and reverse proxy `/api/` plus `/media/` to the backend on `127.0.0.1:8181`.
