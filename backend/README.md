# Bonemia — Backend

Django REST API for Bonemia: passwordless email authentication (one-time codes), JWT sessions, and subscription inquiries.

## Stack

| Piece | Role |
|--------|------|
| **Django** | Web framework |
| **Django REST Framework** | API layer |
| **Djoser** | User registration and auth-related routes under `/auth/` |
| **djangorestframework-simplejwt** | JWT access and refresh tokens |
| **drf-spectacular** | OpenAPI 3 schema and Swagger / Redoc UI |

## Project layout

```
backend/
├── bonemia/          # Project settings, root URLconf, WSGI
├── account/          # Custom user model, sign-up serializer, JWT obtain serializer
├── inquiries/        # Subscription catalog and inquiry submissions
├── manage.py
├── requirements.txt
└── README.md
```

## Prerequisites

- Python 3.12+ (match your deployment; Django 6.x requires a supported Python)
- A virtual environment (recommended)

## Setup

From the `backend` directory:

```bash
python -m venv .venv
.venv\Scripts\activate          # Windows
# source .venv/bin/activate     # macOS / Linux

pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

The API defaults to `http://127.0.0.1:8000/`.
Swagger to `http://127.0.0.1:8000/api/docs/`.

## Configuration

### Environment variables

The app loads a `.env` file from the `backend` folder (via `python-dotenv`). For SMTP (verification emails on sign-up), set at least:

| Variable | Purpose |
|----------|---------|
| `EMAIL_HOST_USER` | SMTP username (e.g. Gmail address) |
| `EMAIL_HOST_PASSWORD` | SMTP app password or account password |

Use **dotenv format without spaces** around `=`:

```env
EMAIL_HOST_USER=your-address@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

`bonemia/settings.py` also configures `EMAIL_HOST`, `EMAIL_PORT`, and TLS for Gmail-compatible SMTP; adjust if you use another provider.

### Database

Database connection is defined in `bonemia/settings.py` under `DATABASES`. Point it at your real database (for example PostgreSQL with `django.db.backends.postgresql` and a proper `NAME` / `HOST` / `PORT`) before production. Keep credentials out of version control; prefer environment variables or a secrets manager.

### Security (production)

- Set `SECRET_KEY` from the environment, not a hard-coded value.
- Set `DEBUG = False`, configure `ALLOWED_HOSTS`, HTTPS, and secure cookies as appropriate.

## API documentation

| URL | Description |
|-----|-------------|
| `/api/schema/` | OpenAPI schema (JSON / YAML) |
| `/api/docs/` | Swagger UI |
| `/api/docs/redoc/` | ReDoc |

## Authentication flow

Users are identified by **email** (`USERNAME_FIELD`). Passwords are optional for normal users; sign-up uses an **email verification code**, and sign-in can use **email + code** or **email + password** (e.g. staff).

### 1. Register

`POST /auth/users/`

```json
{ "email": "user@example.com" }
```

Optional: `"password": "..."` if you want a traditional password as well.

The server creates the user (inactive until first successful code login), stores a one-time code, and sends it by email.

### 2. Sign in (JWT)

`POST /auth/jwt/create/`

**Passwordless (typical):**

```json
{ "email": "user@example.com", "code": "123456" }
```

Omit `password` or send it empty; `code` is the value from the email.

**With password (e.g. superuser):**

```json
{ "email": "admin@example.com", "password": "..." }
```

Response includes `access` and `refresh` tokens.

### 3. Authenticated requests

Send the access token:

```http
Authorization: Bearer <access_token>
```

JWT is enabled globally via `REST_FRAMEWORK["DEFAULT_AUTHENTICATION_CLASSES"]`; Djoser’s public routes still allow unauthenticated access where configured.

### Other Djoser routes

Standard Djoser paths are mounted under `/auth/` (user profile, password reset, JWT refresh/verify, etc.). See [Djoser documentation](https://djoser.readthedocs.io/) for the full route list.

## Application API

### Create inquiry

`POST /api/inquiries/` — **requires authentication.**

```json
{
  "name": "Ada Lovelace",
  "phone_number": "+22501234567",
  "subscription": 1
}
```

`subscription` is the primary key of a `Subscription` row (create plans in Django admin or via the shell). Saving an inquiry updates the linked user’s `name` and `phone_number` on the account model.

Response includes `id`, `name`, `phone_number`, `subscription`, and `created_at`.

## Django apps

### `account`

- **`CustomUser`**: email, optional `name` / `phone_number`, verification code fields, flags for staff and verification.
- **`PasswordlessUserCreateSerializer`**: Djoser `user_create` hook — email-only registration and outbound code email.
- **`EmailCodeTokenObtainPairSerializer`**: Custom SimpleJWT obtain serializer (wired in `SIMPLE_JWT["TOKEN_OBTAIN_SERIALIZER"]`).

### `inquiries`

- **`Subscription`**: product name, price in CFA, billing period.
- **`Inquiry`**: links a user to a subscription with submitted contact details.

## Common commands

```bash
python manage.py migrate
python manage.py makemigrations
python manage.py createsuperuser
python manage.py runserver
python manage.py check
```

## License

Proprietary — Bonemia. Add or replace with your chosen license when you publish the repo.
