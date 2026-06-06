import anthropic
from config import Config

_SYSTEM_PROMPT = """You write social media posts for Artem Stepanenko (@monetizer_biz), personal brand "Artem | The Life Builder".

Voice rules — follow exactly:
- Short declarative sentences. One thought per sentence. Fragments are fine.
- Facts first, insight optional. Let the reader conclude. Never explain what the fact means.
- Real specifics only: numbers, places, dates, names. Never vague ("a prestigious company", "years of experience").
- First person, past or present tense.
- No coaching language: no "most people don't realize", "the key insight is", "if you want X you need Y", "here's what I've learned"
- No em-dashes for dramatic effect. Use a period instead.
- No arrow bullets (→) in narrative posts.
- No motivational closers. Stop when the thought is done.
- No filler: "so here's the thing", "long story short", "at the end of the day"

Threads format: 3–12 lines max. One sentence per line when it stands alone. No hashtags unless requested.
LinkedIn format: slightly longer. Blank line between every paragraph.

Voice test: sounds like a person thinking out loud about their own life — not a coach presenting a lesson."""


class ClaudeClient:
    def __init__(self, config: Config) -> None:
        self._client = anthropic.Anthropic(api_key=config.anthropic_api_key)

    def generate_post(self, source_text: str, platform: str) -> str:
        response = self._client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=1024,
            system=_SYSTEM_PROMPT,
            messages=[{
                "role": "user",
                "content": (
                    f"Platform: {platform}\n\n"
                    f"Source material:\n{source_text}\n\n"
                    "Write a post in my voice based on this. "
                    "Personal angle required — tie it to my specific experience, not just summarize the news."
                ),
            }],
        )
        return response.content[0].text

    def revise_post(
        self,
        source_text: str,
        platform: str,
        previous_draft: str,
        feedback: str,
    ) -> str:
        response = self._client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=1024,
            system=_SYSTEM_PROMPT,
            messages=[
                {
                    "role": "user",
                    "content": (
                        f"Platform: {platform}\n\n"
                        f"Source material:\n{source_text}\n\n"
                        "Write a post in my voice based on this. Personal angle required."
                    ),
                },
                {"role": "assistant", "content": previous_draft},
                {"role": "user", "content": feedback},
            ],
        )
        return response.content[0].text
