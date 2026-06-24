# Script: TG Video — How to Build an HTML Presentation with Claude Code

**Duration:** 8–10 min  
**Tool:** Loom (screen + webcam bubble)  
**Platform:** Telegram channel "The Life Builder OS"  
**Visual style:** 8-bit retro (Super Mario / Contra / NES)  
**Approach:** Live build from scratch  

---

## Pre-Recording Checklist

- [ ] Fresh Claude Code session open (no prior context)
- [ ] Loom running — webcam bubble enabled, mic test done
- [ ] Terminal + browser ready (side by side or switch between)
- [ ] Claude Code usage/limits visible (screenshot before starting)
- [ ] Browser tab with finished Lukyan presentation open: https://artem-scm-ai.github.io/life-builder-os/lukyan-training/
- [ ] Git repo initialized in working folder, remote set up
- [ ] Internet stable (needed for git push + GitHub Pages)

---

## BLOCK 1 — Hook (0:00–0:30)

**[Screen: Lukyan presentation in browser — show 2–3 slides]**  
**[Webcam: visible, face lit]**

> "Вчора я показав в Телеграмі цю презентацію — я зробив її для футбольного тренування сина. Люди запитали: як це зробити? Сьогодні покажу — в прямому ефірі, з нуля. Погнали."

---

## BLOCK 2 — Lock In Limits (0:30–1:00)

**[Screen: Claude Code terminal — show usage/limits bar]**

> "Перш ніж починати — фіксую ліміти Клода. Ось де я зараз. Запам'ятайте цю цифру — в кінці відео покажу скільки коштувала вся задача. Відкриваю свіжу сесію."

---

## BLOCK 3 — Prompt 1: Structure (1:00–2:30)

**[Screen: Claude Code terminal, blank session]**

> "Отже, ми будуємо презентацію на тему — як будувати презентації. Так, мета. Але це найчесніший спосіб показати процес: ми будуємо рівно те, про що говоримо."

**[Type Prompt 1 — slowly, audience can read]**

> "Перший промпт — завжди структура. Кажу Клоду що будуємо, скільки слайдів, які теми. Нічого про дизайн — це окремий крок."

**[Claude generates — speed up x2 if slow]**

> "Важливо: Claude Code пише файл прямо на диск. Не в браузер, не в хмару — локальний HTML-файл у мене на машині."

**[Open index.html in browser]**

> "Відкриваємо. Структура є, тексти є — виглядає як HTML з 1996-го. Це нормально. Це крок один."

---

## BLOCK 4 — Prompt 2: 8-bit Design (2:30–3:30)

**[Screen: terminal]**

> "Тепер магія. Другий промпт — дизайн. І я хочу щось нестандартне."

**[Type Prompt 2]**

> "Press Start 2P — це піксельний шрифт з Google Fonts. Кольори NES. Pixel borders через CSS box-shadow. І перший слайд — як титульний екран гри зі словами PRESS START."

**[Claude generates and updates file]**

**[Refresh browser]**

> "О."

*(natural pause — let viewers see it)*

---

## BLOCK 5 — Prompt 3: Details (3:30–5:00)

**[Screen: browser — click through slides, comment what's missing]**

> "Клікаю по слайдах. Більшість добре. Але слайд з шаблоном промпту — хочу щоб там був блок коду який можна скопіювати. Фіксуємо."

**[Switch to terminal, type Prompt 3]**

**[Show usage counter while Claude generates]**

> "До речі — бачите лічильник? Claude Code рахує токени в реальному часі. Ось вартість того що ми щойно зробили."

**[Refresh browser, click through slides]**

> "Живі кнопки. Pixel borders. Блімаючий курсор. Все через CSS і JavaScript — жодного зовнішнього інструменту."

---

## BLOCK 6 — Live Fixes (5:00–6:30)

**[If anything looks off — show the fix prompt naturally]**

> "Бачу що [конкретна деталь] — не так. Один рядок Клоду і фіксуємо."

**[Type short fix prompt]**

> "Ось що важливо: ти не редагуєш HTML руками. Ти кажеш Клоду що змінити — і він змінює. Це різниця між 'вміти програмувати' і 'вміти ставити задачу'."

---

## BLOCK 7 — Final Walkthrough (6:30–7:30)

**[Screen: browser — walk through all 10 slides, 3–5 sec each]**

> "Слайд один — title screen, PRESS START мигає.  
> Два — що таке Claude Code.  
> Три — чому HTML, а не PowerPoint: тому що HTML — це посилання, не файл.  
> Чотири — перший промпт.  
> ..."

*(continue through all slides briefly)*

---

## BLOCK 8 — Git Push (7:30–8:30)

**[Screen: terminal]**

> "Деплоємо. GitHub Pages — безкоштовний хостинг від GitHub. Три команди."

```bash
git add .
git commit -m "feat: add 8-bit html tutorial presentation"
git push
```

> "Пуш пішов. Чекаємо секунд 30–60..."

**[Open GitHub Pages URL in browser]**

> "Живе посилання. Ділишся в Telegram — і все. Без Canva, без PowerPoint, без дизайнера."

---

## BLOCK 9 — Lock In Limits After (8:30–8:50)

**[Screen: Claude Code — show usage bar]**

> "Пам'ятаєте ліміти на початку? Ось де ми зараз. [X] токенів — ось реальна вартість однієї презентації з нуля."

---

## BLOCK 10 — Outro (8:50–9:10)

**[Webcam front-facing or screen with links]**

> "Посилання на готову презентацію і всі три промпти — в описі під відео. Якщо є питання — пиши в коменти. Побачимося."

---

## Prompts (copy-paste ready)

### Prompt 1 — Structure
```
Create a 10-slide HTML presentation titled "How to Build Any Presentation with Claude Code".

Slides:
1. Title screen
2. What is Claude Code
3. Why HTML and not PowerPoint
4. How to write the first prompt
5. How to iterate with follow-up prompts
6. How to add images
7. How to deploy to GitHub Pages
8. Real example — Lukyan's football training presentation
9. Template prompt to copy
10. Links and contacts

Single HTML file with embedded CSS and JS. Modern clean layout.
```

### Prompt 2 — 8-bit Design
```
Redesign completely in 8-bit retro pixel game style (Super Mario / Contra / NES era):

- Font: Press Start 2P from Google Fonts for all text
- Background: #000000
- Accent colors: #3dd68c (green), #e83c3c (red), #f5c518 (yellow), #3b9eed (blue)
- Pixel borders using CSS box-shadow pixel technique (no border-radius)
- Slide counter styled as NES level indicator: "1-1", "1-2", etc.
- Slide 1: full title screen — "PRESS START" blinking text, game intro style
- Navigation: ◄ ► arrows styled as D-pad buttons
- Blinking cursor animation on key headings
- No gradients, no shadows, no rounded corners — pure pixel aesthetic
- Lives counter top-right corner: ♥ ♥ ♥
```

### Prompt 3 — Details
```
On slide 9 (Template Prompt), add a copyable code block:
- Styled as a terminal/console in 8-bit theme
- Include a "COPY" button in the top-right of the block
- The block should contain a generic template prompt users can adapt

On slide 8 (Lukyan example), add a placeholder image box with the caption:
"[screenshot of finished presentation]"
```

---

## Recording Tips

- Speak slower than feels natural — screen recordings always feel fast on playback
- When Claude is generating, don't go silent — narrate what's happening
- If something breaks: "От бачите — це теж частина процесу" and fix it on camera
- Keep Loom webcam bubble bottom-right so it doesn't cover the terminal
