import os
from typing import Optional, List
from sys import gettrace

from supabase import create_client, Client
from dotenv import load_dotenv


debug_mode = False


def debug_print(var):
    # Only prints when debugging or debug_mode is True
    if gettrace() is not None or debug_mode is True:
        print(var)


class SupabaseDatabase:
    """
    Helper for interacting with the Supabase `UserKarma` table.

    Usage:
        db = SupabaseDatabase()
        db.upsert_user_karma(3, "shaurya", ["TOXICITY", "SEVERE_TOXICITY"])
        karma = db.get_karma(3)
    """

    def __init__(
        self,
        url: Optional[str] = None,
        key: Optional[str] = None,
        table: str = "UserKarma",
    ):
        load_dotenv()
        url = url or os.environ.get("SUPABASE_URL")
        key = key or os.environ.get("SUPABASE_KEY")

        if not url or not key:
            raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in environment or passed in.")

        self.supabase: Client = create_client(url, key)
        self.table_name = table

    def upsert_user_karma(
        self,
        user_id: int,
        username: str,
        increment_list: Optional[List[str]] = None,
    ) -> None:
        """
        Upserts user karma data into the table.

        Args:
            user_id: The user's ID.
            username: The username (Discord, app name, etc.).
            increment_list: e.g. ["TOXICITY", "SEVERE_TOXICITY", "INSULT", "THREAT"].
        """
        if increment_list is None:
            increment_list = []

        data_to_upsert = {"userID": user_id}
        attributes = ["TOXICITY", "SEVERE_TOXICITY", "INSULT", "THREAT"]

        try:
            existing = (
                self.supabase
                .table(self.table_name)
                .select("*", count="exact")
                .eq("userID", user_id)
                .execute()
            )
            debug_print(existing.data)

            if not existing.data:
                # No existing record
                raise IndexError

            # If username changed, update it
            if existing.data[0].get("username") != username:
                debug_print("Username changed; updating username.")
                data_to_upsert["username"] = username

        except IndexError:
            # No user row yet, create a new one with zeros
            print("User not found, creating new record.")
            data_to_upsert["username"] = username
            existing = type("Obj", (), {})()  # simple dummy with .data
            existing.data = [
                {
                    "TOXICITY": 0,
                    "SEVERE_TOXICITY": 0,
                    "INSULT": 0,
                    "THREAT": 0,
                }
            ]
        except Exception as e:
            print(f"Error fetching user data: {e}")
            return

        # Increment attributes if requested
        for attr_name in attributes:
            if attr_name in increment_list:
                current_val = existing.data[0].get(attr_name, 0)
                data_to_upsert[attr_name] = current_val + 1
                debug_print(f"Incremented {attr_name} to {data_to_upsert[attr_name]}")

        print(f"Upserting: {data_to_upsert}")

        try:
            # New supabase-py returns a single Response; no (result, count) tuple
            response = (
                self.supabase
                .table(self.table_name)
                .upsert(data_to_upsert, on_conflict="userID", count="exact")
                .execute()
            )
            debug_print(f"Upsert response: {response}")
        except Exception as e:
            print(f"Error upserting data: {e}")
            return

    def get_karma(self, user_id: int) -> dict:
        """
        Get saved karma data of a user.

        Returns:
            dict like:
            {
              'userID': 123,
              'username': 'name',
              'TOXICITY': 0,
              'SEVERE_TOXICITY': 0,
              'THREAT': 0,
              'INSULT': 0
            }
        """
        empty_dict = {
            "userID": user_id,
            "username": "Error, couldn't find user",
            "TOXICITY": "error",
            "SEVERE_TOXICITY": "error",
            "INSULT": "error",
            "THREAT": "error",
        }

        try:
            debug_print(user_id)
            result = (
                self.supabase
                .table(self.table_name)
                .select("*", count="exact")
                .eq("userID", user_id)
                .execute()
            )
            debug_print(result.data)

            if not result.data:
                return empty_dict
            return result.data[0]
        except Exception as e:
            print(f"Error fetching user data: {e}")
            print("or wrong user id")
            return empty_dict


if __name__ == "__main__":
    sup = SupabaseDatabase()
    sup.upsert_user_karma(1, "shr", ["TOXICITY"])
