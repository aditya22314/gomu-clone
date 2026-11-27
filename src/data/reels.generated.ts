// The subtitle lines come from scripts/import-subtitles.ts, which writes reels.generated.json.
import type { Reel } from './reels';
import data from './reels.generated.json';

export const GENERATED_REELS = data as Reel[];
