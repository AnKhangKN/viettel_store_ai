from app.core.database import pool


class AuthRepository:

    @staticmethod
    async def find_by_email(email):

        sql = """
            SELECT
                id,
                name,
                email,
                password,
                role
            FROM users
            WHERE email=$1
        """

        return await pool.fetchrow(
            sql,
            email
        )