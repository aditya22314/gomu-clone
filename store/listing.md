# Play Store listing and release notes

Everything needed to fill in Google Play Console for Mimi. Assets are in this folder.

## Store listing

- **App name:** Mimi: Learn Japanese by Listening (30 characters max)
- **Short description (80 max):** Learn Japanese from short scenes and clips. Tap any word, save it, review it.
- **Full description:**

  > Mimi helps you learn Japanese the way you actually hear it: in short scenes and real clips.
  >
  > • Swipe through a feed of 50 short scenes from N5 to N1, read aloud in Japanese
  > • Watch clips with subtitles you can tap, word by word
  > • Furigana, romaji and English under every line, each one can be turned off
  > • Tap any word for its reading, meaning and JLPT level, then save it with the line you heard it in
  > • Review saved words with spaced repetition, right before you'd forget them
  > • Quizzes for your saved words and for each JLPT level
  > • Streaks, daily goals, a 12-week activity calendar and badges
  > • A gentle daily reminder, if you want one
  >
  > Free, with no ads, no account and no tracking. Your progress stays on your phone, and you can back it up anytime.
  >
  > Word lookups use JMdict data via Jisho.org. Clips play in YouTube's official player and are credited to their channels.

- **Category:** Education
- **Tags:** Language learning
- **App icon:** `play-icon-512.png` (512x512)
- **Feature graphic:** `feature-graphic-1024x500.png`
- **Phone screenshots:** `screenshots/01-scene.png` … `06-progress.png` (1080x1920)
- **Privacy policy URL:** https://github.com/aditya22314/gomu-clone/blob/main/docs/privacy-policy.md

Keep show names and anime artwork out of the listing text and graphics. Mimi doesn't own them, and Play rejects
listings that use other people's trademarks to attract installs.

## Data safety form

- **Does your app collect or share any of the required user data types?** No.
  - Saved words, progress and settings never leave the device, so they don't count as collected.
  - Requests to YouTube and Jisho.org go straight from the phone to those services, and Mimi sends no personal data with them.
- **Is all of the user data collected by your app encrypted in transit?** Yes (all requests use HTTPS).
- **Do you provide a way for users to request that their data is deleted?** Yes: Profile > Danger zone > Delete everything, or uninstalling.

## App content answers

- **Ads:** No ads.
- **App access:** All functionality is available without special access (no login).
- **Content rating (IARC questionnaire):** Education. No violence, sexual content, gambling or user-to-user chat.
  Answer "yes" to "Does the app allow users to view content from the internet?" because of YouTube clips.
  Some anime clips can show cartoon fighting, so expect a Teen-style rating.
- **Target audience:** 13–15, 16–17 and 18+. Do not select under-13 groups (that brings in the Families policy).
- **News app:** No. **Government app:** No. **Health app:** No. **Financial features:** None.

## Credits to keep in the app and listing

- Dictionary data: JMdict (EDRDG, CC BY-SA 4.0) via Jisho.org.
- Clips: played through YouTube's embedded player, credited to the publishing channel on screen.

## Release checklist (needs your own accounts)

1. Create a Google Play developer account (one-time US$25) at https://play.google.com/console.
2. Sign in to Expo: `npx expo login` (free account at https://expo.dev/signup).
3. In the project folder, link it once: `npx eas-cli@latest init`.
4. Build the release bundle: `npx eas-cli@latest build -p android --profile production`. EAS creates and keeps the
   upload key for you. Download the `.aab` when it finishes.
5. In Play Console, create the app, fill in the listing, Data safety and App content answers above, and paste the privacy policy URL.
6. New personal developer accounts must run a **closed test with at least 12 testers for 14 days in a row** before
   applying for production. Upload the `.aab` to a closed testing track and invite testers by email.
7. After 14 days, apply for production access, then promote the build.
8. Later updates: run step 4 again (the version code goes up automatically), or `npx eas-cli@latest submit -p android`
   to upload straight to the internal track as a draft.

To try a build on your own phone first: `npx eas-cli@latest build -p android --profile preview` gives an installable `.apk`.
