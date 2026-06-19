from pathlib import Path


def read_context(hot_md_path: str, project_current_path: str, user_profile_path: str) -> dict:
    def _read(path: str) -> str:
        try:
            return Path(path).read_text(encoding="utf-8")
        except FileNotFoundError:
            return f"[File not found: {path}]"

    return {
        "hot_md": _read(hot_md_path),
        "project_current": _read(project_current_path),
        "user_profile": _read(user_profile_path),
    }


def extract_current_focus(hot_md_text: str) -> str:
    in_section = False
    result = []
    for line in hot_md_text.splitlines():
        if line.startswith("## Current Focus"):
            in_section = True
            continue
        if in_section:
            if line.startswith("## "):
                break
            result.append(line)
    content = "\n".join(result).strip()
    return content if content else "[Current Focus not found]"
