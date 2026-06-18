# Hypergrowth Check — Claude Code Skill

It scores any idea or business against the AI Sales-Led Hypergrowth framework (based on Seva Ustinov's benchmark research — 17 companies, $75B+ valuation). Returns a structured audit: Growth Laws score, Sales Laws score, archetype classification, and specific gaps with fixes backed by real company examples.

## Installation

1. Unzip `hypergrowth-skill.zip`
2. Copy `.agents/skills/hypergrowth-check/` into your project root (or into `~/.claude/agents/skills/` for global access)
3. Copy `hypergrowth_pages/` into your project root — the skill reads these files at runtime
4. That's it. Claude Code picks it up automatically on next session start

## Usage

Just describe an idea, offer, or go-to-market approach in Claude Code. The skill activates when you're pressure-testing an idea, structuring pricing, or evaluating whether to pursue a project.

Example prompts:
- *"Evaluate this business model against the hypergrowth framework"*
- *"What am I missing in this GTM approach?"*
- *"Score this idea before I pitch it"*
