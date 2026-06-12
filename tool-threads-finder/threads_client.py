import time
import requests

BASE_URL = "https://graph.threads.net/v1.0"
CONTAINER_READY_DELAY = 5


class ThreadsAuthError(Exception):
    pass


class ThreadsAPIError(Exception):
    pass


class ThreadsClient:
    def __init__(self, access_token: str):
        self._token = access_token

    def search(self, keyword: str) -> list[dict]:
        """Search public posts by keyword."""
        resp = requests.get(
            f"{BASE_URL}/threads/keyword_search",
            params={
                "q": keyword,
                "fields": "id,text,timestamp,username,permalink",
                "access_token": self._token,
            },
            timeout=10,
        )
        self._check(resp)
        return resp.json().get("data", [])

    def reply(self, post_id: str, text: str) -> str:
        """Post a reply to a thread. Returns our reply ID."""
        resp = requests.post(
            f"{BASE_URL}/me/threads",
            params={
                "media_type": "TEXT",
                "text": text,
                "reply_to_id": post_id,
                "access_token": self._token,
            },
            timeout=10,
        )
        self._check(resp)
        data = resp.json()
        creation_id = data.get("id")
        if not creation_id:
            raise ThreadsAPIError("No creation_id in /me/threads response")
        time.sleep(CONTAINER_READY_DELAY)
        pub = requests.post(
            f"{BASE_URL}/me/threads_publish",
            params={"creation_id": creation_id, "access_token": self._token},
            timeout=10,
        )
        self._check(pub)
        pub_data = pub.json()
        result_id = pub_data.get("id")
        if not result_id:
            raise ThreadsAPIError("No id in /me/threads_publish response")
        return result_id

    def get_replies(self, thread_id: str) -> list[dict]:
        """Get replies to one of our comments."""
        resp = requests.get(
            f"{BASE_URL}/{thread_id}/replies",
            params={
                "fields": "id,text,timestamp,username",
                "access_token": self._token,
            },
            timeout=10,
        )
        self._check(resp)
        return resp.json().get("data", [])

    def _check(self, resp: requests.Response) -> None:
        if resp.status_code == 401:
            raise ThreadsAuthError("Access token expired or invalid")
        if not resp.ok:
            raise ThreadsAPIError(f"API error {resp.status_code}: {resp.text[:200]}")
