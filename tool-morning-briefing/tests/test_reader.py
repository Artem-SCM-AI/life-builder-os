from pathlib import Path

import pytest

from reader import read_context


def test_read_context_returns_file_contents(tmp_path):
    hot = tmp_path / "hot.md"
    hot.write_text("hot content", encoding="utf-8")
    proj = tmp_path / "project.md"
    proj.write_text("project content", encoding="utf-8")
    profile = tmp_path / "profile.md"
    profile.write_text("profile content", encoding="utf-8")

    result = read_context(str(hot), str(proj), str(profile))

    assert result["hot_md"] == "hot content"
    assert result["project_current"] == "project content"
    assert result["user_profile"] == "profile content"


def test_read_context_handles_missing_file(tmp_path):
    existing = tmp_path / "exists.md"
    existing.write_text("data", encoding="utf-8")

    result = read_context(
        str(tmp_path / "missing.md"),
        str(existing),
        str(existing),
    )

    assert "[File not found:" in result["hot_md"]
    assert result["project_current"] == "data"
