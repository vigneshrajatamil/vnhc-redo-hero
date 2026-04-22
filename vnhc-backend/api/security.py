import re

from django.core.exceptions import ValidationError


def validate_admin_password(password: str, username: str = "", email: str = "") -> None:
    errors = []

    if len(password) < 12:
        errors.append("Password must be at least 12 characters long.")
    if not re.search(r"[A-Z]", password):
        errors.append("Password must include at least one uppercase letter.")
    if not re.search(r"[a-z]", password):
        errors.append("Password must include at least one lowercase letter.")
    if not re.search(r"\d", password):
        errors.append("Password must include at least one number.")
    if not re.search(r"[^A-Za-z0-9]", password):
        errors.append("Password must include at least one special character.")

    lowered = password.lower()
    username = username.strip().lower()
    email_local = email.strip().split("@", 1)[0].lower() if email else ""

    if username and username in lowered:
        errors.append("Password must not contain the username.")
    if email_local and email_local in lowered:
        errors.append("Password must not contain the email name.")

    if errors:
        raise ValidationError(errors)
