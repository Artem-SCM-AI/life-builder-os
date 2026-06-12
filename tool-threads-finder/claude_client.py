import anthropic

MAX_REPLY_CHARS = 280
MODEL = "claude-sonnet-4-6"

_SYSTEM = """Ти — Артем Степаненко. Пишеш від першої особи коментар у Threads.

Правила:
- Мова: українська
- Максимум 280 символів
- Без тире (— або –), без стрілок (→)
- Без coaching-мови ("розкрий потенціал", "зроби крок" тощо)
- Один конкретний інсайт або приклад із власного досвіду
- Закінчуй м'яким питанням або пропозицією
- Не рекламуй явно"""


class ClaudeClient:
    def __init__(self, api_key: str):
        self._client = anthropic.Anthropic(api_key=api_key)

    def generate_reply(self, segment: str, post_text: str) -> str:
        msg = self._client.messages.create(
            model=MODEL,
            max_tokens=150,
            system=_SYSTEM,
            messages=[{
                "role": "user",
                "content": f"Сегмент: {segment}\n\nПост:\n{post_text}\n\nНапиши коментар.",
            }],
        )
        reply = msg.content[0].text.strip()
        if len(reply) > MAX_REPLY_CHARS:
            reply = reply[:MAX_REPLY_CHARS].rsplit(' ', 1)[0]
        return reply
