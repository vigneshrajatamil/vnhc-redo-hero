# VNHC Production Notes

## Structure

- `vnhc-backend`: Django API, sessions, admin auth, uploads
- `vnhc-redo-hero`: Vite/React frontend

## Runtime flow

1. Browser loads static frontend files from nginx.
2. Frontend calls same-origin API paths such as `/api/auth/csrf/` and `/api/products/`.
3. nginx forwards `/api/` to Gunicorn on `127.0.0.1:8181`.
4. Gunicorn serves Django.
5. Django uses MySQL for application data and session storage.
6. nginx serves `/static/` and `/media/` directly from disk.

## Ports

- Frontend dev server: `5171`
- Backend dev server / Gunicorn target: `8181`

## Security controls in the system

- HTTPS is terminated by nginx with Certbot-managed certificates.
- Django sessions are stored server-side in MySQL.
- Session cookie is HTTP-only and can be marked secure in production.
- CSRF protection is enforced for mutating authenticated requests.
- Frontend now uses same-origin API calls in production, which avoids cross-origin CSRF and referer problems.
- Admin and object identifiers use UUIDs instead of incrementing public ids.
- Admin passwords are hashed before storage.
- Admin password creation now requires:
  - minimum 12 characters
  - uppercase letter
  - lowercase letter
  - number
  - special character
  - must not contain username or email name
- Mutating API endpoints are now restricted with explicit HTTP method checks.
- Frontend admin routes are guarded and redirect unauthenticated users to `/admin/login`.

## Required production environment

Backend `.env`:

```env
SECRET_KEY=replace-with-a-long-random-secret
DEBUG=False
ALLOWED_HOSTS=vnhc.in,www.vnhc.in,localhost,127.0.0.1
DB_HOST=127.0.0.1
DB_USER=vnhc_user
DB_PASSWORD=replace-with-a-strong-db-password
DB_NAME=vnhc_db
DB_PORT=3306
CORS_ALLOWED_ORIGINS=https://vnhc.in,https://www.vnhc.in
CSRF_TRUSTED_ORIGINS=https://vnhc.in,https://www.vnhc.in
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
MEDIA_URL=/media/
MEDIA_ROOT=media
```

Frontend `.env`:

```env
VITE_API_URL=
```

## Deployment method

1. Pull the repo to the VPS.
2. Install backend dependencies.
3. Install frontend dependencies and run `npm run build`.
4. Run `python3 manage.py migrate`.
5. Run `python3 manage.py collectstatic --noinput`.
6. Create the first admin using `python3 manage.py create_admin ...`.
7. Run Gunicorn through `systemd` on `127.0.0.1:8181`.
8. Configure nginx:
   - `root` -> `vnhc-redo-hero/dist`
   - `/api/` proxy -> `127.0.0.1:8181`
   - `/static/` alias -> backend `staticfiles`
   - `/media/` alias -> backend `media`
9. Use Certbot for `vnhc.in` and `www.vnhc.in`.

## Important operational notes

- Do not import `schema.sql` and then also run normal Django app-table migrations on the same database. Use Django migrations as the source of truth for production.
- Do not use MySQL `root` as the application user in production.
- Do not run production with `DEBUG=True`.
- Do not keep weak admin passwords.
- Use a single canonical admin URL consistently, preferably `https://vnhc.in/admin/login`.

## API methods

- `GET /api/auth/csrf/`: issue CSRF cookie
- `GET /api/auth/me/`: current admin session
- `POST /api/auth/login/`: admin login
- `POST /api/auth/logout/`: admin logout
- `GET /api/products/`: public product list
- `POST /api/products/create/`: admin create product
- `PUT|PATCH /api/products/<uuid>/update/`: admin update product
- `DELETE /api/products/<uuid>/delete/`: admin delete product
- `GET /api/gallery/`: public gallery list
- `POST /api/gallery/upload/`: admin upload gallery item
- `DELETE /api/gallery/<uuid>/delete/`: admin delete gallery item
- `POST /api/contact/`: public contact submission
- `GET /api/contact/messages/`: admin inquiry list
- `PATCH /api/contact/<uuid>/read/`: admin mark inquiry read
- `DELETE /api/contact/<uuid>/delete/`: admin delete inquiry
- `GET /api/admin-users/`: admin user list
- `POST /api/admin-users/create/`: admin create user
- `DELETE /api/admin-users/<uuid>/delete/`: admin delete user
- `PATCH /api/admin-users/<uuid>/toggle/`: admin activate/deactivate user

## Service ownership

- `nginx`: TLS termination, static serving, reverse proxy
- `vnhc.service`: Gunicorn process manager for Django
- `MySQL`: application database + Django sessions
- `React frontend`: browser UI only, no secret storage

## Recommended next hardening steps

- Move from MySQL `root` to a dedicated `vnhc_user`.
- Rotate `SECRET_KEY`.
- Add centralized rate limiting with Redis or nginx for login attempts.
- Add content validation for uploaded media beyond MIME checks.
- Add backup, log rotation, and monitoring for nginx, Gunicorn, and MySQL.
