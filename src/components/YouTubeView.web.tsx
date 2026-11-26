// Web build: the Reels screen shows a link to YouTube instead of the player, so no player is bundled here.
import React from 'react';

export type YoutubeIframeRef = { getCurrentTime: () => Promise<number> };

export default React.forwardRef<YoutubeIframeRef, Record<string, unknown>>(function YouTubeView() {
  return null;
});

export async function getYoutubeMeta(videoId: string): Promise<{ title: string; author_name: string }> {
  const r = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
  return r.json();
}
