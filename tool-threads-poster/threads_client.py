import requests


class ThreadsAuthError(Exception):
    pass


class ThreadsAPIError(Exception):
    pass


class ThreadsClient:
    BASE_URL = "https://graph.threads.net/v1.0"

    def __init__(self, access_token: str):
        self._token = access_token

    def create_post(self, text: str) -> str:
        creation_id = self._create_container(text, reply_to_id=None)
        return self._publish(creation_id)

    def create_reply(self, post_id: str, text: str) -> str:
        creation_id = self._create_container(text, reply_to_id=post_id)
        return self._publish(creation_id)

    def _create_container(self, text: str, reply_to_id: str | None) -> str:
        params = {
            "media_type": "TEXT",
            "text": text,
            "access_token": self._token,
        }
        if reply_to_id:
            params["reply_to_id"] = reply_to_id
        resp = requests.post(f"{self.BASE_URL}/me/threads", params=params)
        self._check(resp)
        return resp.json()["id"]

    def _publish(self, creation_id: str) -> str:
        params = {"creation_id": creation_id, "access_token": self._token}
        resp = requests.post(f"{self.BASE_URL}/me/threads_publish", params=params)
        self._check(resp)
        return resp.json()["id"]

    def _check(self, resp: requests.Response) -> None:
        if resp.status_code == 401:
            raise ThreadsAuthError("Access token expired or invalid")
        if not resp.ok:
            raise ThreadsAPIError(f"API error {resp.status_code}: {resp.text}")
