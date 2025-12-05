"""
Application startup initialization functions.

This module contains functions that run when the application starts,
such as promoting an existing user to superuser based on environment variables.
"""

import logging

from fastapi_users.db import SQLAlchemyUserDatabase

from app.config import settings
from app.database import async_session_maker
from app.models import User

logger = logging.getLogger(__name__)


async def init_superuser_from_env():
    """
    Promote an existing user to superuser based on environment variables on application startup.

    This function:
    1. Checks if SUPERUSER_EMAIL environment variable is set
    2. If not set, skips the operation
    3. If set, looks up the user with that email
    4. If user exists and is not a superuser, promotes them to superuser
    5. If user does not exist, skips (does not create new user)
    6. If user is already a superuser, skips
    """
    # Check if environment variable is set
    if not settings.SUPERUSER_EMAIL:
        logger.debug(
            "SUPERUSER_EMAIL environment variable is not set. "
            "Skipping superuser switching."
        )
        return

    async with async_session_maker() as session:
        try:
            user_db: SQLAlchemyUserDatabase = SQLAlchemyUserDatabase(session, User)

            # Check if user with the email exists
            existing_user = await user_db.get_by_email(settings.SUPERUSER_EMAIL)
            if not existing_user:
                logger.info(
                    f"User with email {settings.SUPERUSER_EMAIL} does not exist. "
                    "Skipping superuser switching."
                )
                return

            # Check if user is already a superuser
            if existing_user.is_superuser:
                logger.info(
                    f"User with email {settings.SUPERUSER_EMAIL} is already a superuser. "
                    "No action needed."
                )
                return

            # Promote user to superuser
            logger.info(f"Promoting user {settings.SUPERUSER_EMAIL} to superuser.")
            existing_user.is_superuser = True
            existing_user.is_verified = True
            await session.commit()
            await session.refresh(existing_user)
            logger.info(
                f"Successfully promoted user {existing_user.email} to superuser."
            )
        except Exception as e:
            logger.error(
                f"Error promoting user to superuser from environment variables: {e}",
                exc_info=True,
            )
            # Don't raise the exception to prevent app startup failure
            # This allows the app to start even if superuser switching fails
