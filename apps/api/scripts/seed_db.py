"""Initialize an empty database.

Content is intentionally created through the admin UI/API; this script does not add
sample users, rooms, learning paths, modules, or challenges.
"""
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.database.base import Base, engine


def seed() -> None:
    Base.metadata.create_all(bind=engine)
    print("[+] Database schema initialized without fixture content.")


if __name__ == "__main__":
    seed()
