# Mimi 耳: learn Japanese by listening

Mimi is a free, open source mobile app (iOS and Android, built with Expo / React Native) for learning Japanese
from short scenes. Swipe through a feed of scenes, tap any word for its reading, meaning and JLPT level, save it,
and review it with spaced repetition right before you'd forget it.

No ads, no account, no tracking. Everything is stored on the device.

## Features

- **Scene feed.** A vertical, swipeable feed of 50 short dialogues in four styles (anime, drama, movie, podcast), from N5 to N1, each with its own painted backdrop (sky, clouds, light rays, floating petals or fireflies, a slow camera drift) and anime-style characters with glossy eyes and layered hair who blink, breathe and lip-sync while they speak. Filter by your level, all levels, or style.
- **Reels.** Real Japanese YouTube videos played through YouTube's official embedded player with Japanese captions. Add any video or Short by pasting its link, look up words you hear (Jisho.org), and save them with the video as context. Curated reels with timed, tap-to-learn subtitles can be added with `scripts/import-subtitles.ts`.
- **Japanese audio.** Each scene is read aloud line by line with the phone's built-in Japanese voice. Pause, repeat a line, go back, or switch to slow audio.
- **Smart subtitles.** Furigana above kanji, romaji and English under each line. Each one can be turned off.
- **Tap any word.** A word card shows the reading, romaji, meaning, part of speech, dictionary form, JLPT level and the line you heard it in, with audio and a Jisho.org link.
- **Save words.** One tap saves a word with its source line.
- **Spaced repetition review.** An SM-2 style scheduler with Again / Hard / Good / Easy. Each button shows when the word will come back, and words you miss come round again before the session ends. The Words tab shows what's due and what's mastered (scheduled 3+ weeks out), with search and a level filter.
- **Quizzes.** A saved-word quiz (meaning, reading, listening and fill-the-gap questions built from the line you saved the word in, which also update the review schedule, with a recap of missed words) and a level quiz for each JLPT level. Score 80% or more to be offered the next level.
- **Progress.** Day streak and best streak, daily goal in minutes, minutes per day this week, a 12-week activity calendar, saved words by JLPT level, totals and badges. A banner pops up when you earn a badge.
- **Daily reminder.** One local notification a day at a time you choose.
- **Onboarding.** Level, reasons for learning, hardest areas, daily goal and reminder.
- **Backup and restore.** Profile > Backup exports everything as text (share sheet on phones, clipboard on the web) and restores it on another device.
- **Haptics.** Light touch feedback when you save a word, grade a review or answer a quiz question (phones only).
- **Delete everything.** Profile > Danger zone wipes all data on the device after a second confirmation.

## Run it

```bash
npm install
npx expo start        # then scan the QR code with Expo Go on your phone
npm run web           # or try it in a browser
npm run check         # type-check, content check and logic tests
```

Build installable apps with [EAS Build](https://docs.expo.dev/build/introduction/): `npx eas build -p android` or `-p ios`.

## Adding scenes

Scenes live in `src/data/clips.ts` and words in `src/data/dictionary.ts`. Write each line as space-separated tokens,
and give every token a dictionary entry. `npm run check` reports any word that is missing.

A clip can also carry an optional `youtube` field (video id, start and end, channel) for a future version that plays
real clips through YouTube's official embedded player. Only add clips you have the right to use, and credit the channel.

## Adding curated reels

1. Download a video's Japanese captions as WebVTT (and English ones if available). Only use videos whose captions you may reuse, and keep the channel credit.
2. List them in a JSON file: `[{ "videoId": "...", "title": "...", "channel": "...", "level": "N4", "subtitles": "ja.vtt", "translations": "en.vtt" }]`.
3. Run `npx tsx scripts/import-subtitles.ts path/to/reels.json`. It splits every line into words with kuromoji and writes `src/data/reels.generated.ts`.

Words in reels that aren't in the built-in dictionary are looked up on Jisho.org when tapped, and saved with the card so reviews work offline.

`scripts/tokenize-scenes.ts` helps write new scenes: it splits lines into words and lists the ones that still need a dictionary entry.

## Not included yet

- Accounts and automatic cloud sync (needs a backend such as Supabase; use Backup to move between devices for now)
- A starter set of curated reels with timed subtitles

## Licence

MIT. All scenes and app artwork are original to this project.
