import { Level } from './dictionary';

export type Category = 'anime' | 'drama' | 'movie' | 'podcast';

export const CATEGORIES: { key: Category; jp: string; label: string }[] = [
  { key: 'anime', jp: 'アニメ', label: 'Anime style' },
  { key: 'drama', jp: 'ドラマ', label: 'Drama' },
  { key: 'movie', jp: '映画', label: 'Movie' },
  { key: 'podcast', jp: 'ラジオ', label: 'Podcast' },
];

export type Line = {
  speaker: string;
  voice?: 'a' | 'b'; // which voice pitch to use
  jp: string; // tokens separated by single spaces
  en: string;
};

export type Clip = {
  id: string;
  title: string;
  category: Category;
  level: Level;
  scene: string; // short emoji scene
  color: string;
  lines: Line[];
  // Optional: real clip from YouTube's official embed player. Leave out for TTS scenes.
  youtube?: { videoId: string; start: number; end: number; channel: string };
};

// All scenes are original dialogues written for this app.
export const CLIPS: Clip[] = [
  {
    id: 'late-for-school', title: 'Late for school', category: 'anime', level: 'N5', scene: '🏃‍♀️🍞', color: '#3D5AFE',
    lines: [
      { speaker: 'Haru', voice: 'a', jp: 'おはよう ！', en: 'Good morning!' },
      { speaker: 'Mei', voice: 'b', jp: 'やばい 、 遅刻 だ ！', en: "Oh no, I'm late!" },
      { speaker: 'Haru', voice: 'a', jp: '走れ ！ 急げ ！', en: 'Run! Hurry!' },
      { speaker: 'Mei', voice: 'b', jp: '待って 、 パン を 食べて いる ！', en: "Wait, I'm eating my bread!" },
    ],
  },
  {
    id: 'cafe', title: 'At the café', category: 'drama', level: 'N5', scene: '☕️🍰', color: '#8D6E63',
    lines: [
      { speaker: 'Staff', voice: 'b', jp: 'いらっしゃいませ 。', en: 'Welcome.' },
      { speaker: 'Customer', voice: 'a', jp: 'コーヒー を ください 。', en: 'A coffee, please.' },
      { speaker: 'Staff', voice: 'b', jp: 'ホット です か 、 アイス です か ？', en: 'Hot or iced?' },
      { speaker: 'Customer', voice: 'a', jp: 'ホット で お願いします 。', en: 'Hot, please.' },
    ],
  },
  {
    id: 'self-intro', title: 'Introducing myself', category: 'podcast', level: 'N5', scene: '🎙️🗼', color: '#00897B',
    lines: [
      { speaker: 'Yuki', voice: 'b', jp: 'はじめまして 、 ユキ です 。', en: "Nice to meet you, I'm Yuki." },
      { speaker: 'Yuki', voice: 'b', jp: '東京 に 住んで います 。', en: 'I live in Tokyo.' },
      { speaker: 'Yuki', voice: 'b', jp: '趣味 は 映画 です 。', en: 'My hobby is movies.' },
      { speaker: 'Yuki', voice: 'b', jp: 'よろしく お願いします 。', en: 'Nice to meet you all.' },
    ],
  },
  {
    id: 'rain', title: 'Caught in the rain', category: 'movie', level: 'N5', scene: '🌧️☂️', color: '#546E7A',
    lines: [
      { speaker: 'Sora', voice: 'a', jp: '雨 だ 。', en: "It's raining." },
      { speaker: 'Sora', voice: 'a', jp: '傘 、 持って る ？', en: 'Do you have an umbrella?' },
      { speaker: 'Aoi', voice: 'b', jp: 'ううん 、 ない 。', en: "No, I don't." },
      { speaker: 'Sora', voice: 'a', jp: 'じゃあ 、 一緒に 帰ろう 。', en: "Then let's walk home together." },
    ],
  },
  {
    id: 'why-help', title: 'Why help me?', category: 'anime', level: 'N4', scene: '🦊🌲', color: '#E65100',
    lines: [
      { speaker: 'Kit', voice: 'b', jp: 'なんで 助けて くれる の ？', en: 'Why are you helping me?' },
      { speaker: 'Ren', voice: 'a', jp: '友達 だ から 。', en: "Because we're friends." },
      { speaker: 'Kit', voice: 'b', jp: 'でも 、 危ない よ 。', en: "But it's dangerous." },
      { speaker: 'Ren', voice: 'a', jp: '大丈夫 。 一人 じゃ ない 。', en: "It's okay. You're not alone." },
    ],
  },
  {
    id: 'homework', title: 'Forgot my homework', category: 'drama', level: 'N4', scene: '🏫📓', color: '#5E35B1',
    lines: [
      { speaker: 'Student', voice: 'a', jp: '宿題 を 忘れました 。', en: 'I forgot my homework.' },
      { speaker: 'Teacher', voice: 'b', jp: 'また です か ？', en: 'Again?' },
      { speaker: 'Student', voice: 'a', jp: 'すみません 。 明日 必ず 持って きます 。', en: "Sorry. I'll definitely bring it tomorrow." },
    ],
  },
  {
    id: 'weekend', title: 'Weekend hike', category: 'podcast', level: 'N4', scene: '⛰️🥾', color: '#2E7D32',
    lines: [
      { speaker: 'Host', voice: 'b', jp: '週末 は 何 を して いました か ？', en: 'What did you do on the weekend?' },
      { speaker: 'Guest', voice: 'a', jp: '友達 と 山 に 登りました 。', en: 'I climbed a mountain with friends.' },
      { speaker: 'Guest', voice: 'a', jp: '景色 が とても きれい でした 。', en: 'The view was really beautiful.' },
    ],
  },
  {
    id: 'promise', title: 'A broken promise', category: 'drama', level: 'N3', scene: '🌆⌚️', color: '#AD1457',
    lines: [
      { speaker: 'Kai', voice: 'a', jp: '約束 を 守れなくて 、 ごめん 。', en: "Sorry I couldn't keep my promise." },
      { speaker: 'Nana', voice: 'b', jp: 'もう いい よ 。 気に しないで 。', en: "It's fine. Don't worry about it." },
      { speaker: 'Kai', voice: 'a', jp: '次 は 絶対 に 遅れない 。', en: "Next time I absolutely won't be late." },
    ],
  },
  {
    id: 'training', title: "Don't give up", category: 'anime', level: 'N3', scene: '🥋🔥', color: '#C62828',
    lines: [
      { speaker: 'Coach', voice: 'a', jp: '諦める な ！ まだ 終わって ない ！', en: "Don't give up! It's not over yet!" },
      { speaker: 'Rin', voice: 'b', jp: 'でも 、 もう 限界 だ …', en: "But I'm at my limit..." },
      { speaker: 'Coach', voice: 'a', jp: 'お前 なら できる 。 信じて る 。', en: 'You can do it. I believe in you.' },
    ],
  },
  {
    id: 'moving', title: 'Moving to Osaka', category: 'movie', level: 'N3', scene: '📦🚄', color: '#0277BD',
    lines: [
      { speaker: 'Mio', voice: 'b', jp: '来月 、 大阪 に 引っ越す こと に なった 。', en: "It's been decided: I'm moving to Osaka next month." },
      { speaker: 'Taku', voice: 'a', jp: '急 だ ね 。 寂しく なる な 。', en: "That's sudden. I'll miss you." },
      { speaker: 'Mio', voice: 'b', jp: '連絡 する から 、 心配 しないで 。', en: "I'll keep in touch, so don't worry." },
    ],
  },
  {
    id: 'work-life', title: 'Too much work', category: 'podcast', level: 'N2', scene: '💼😮‍💨', color: '#455A64',
    lines: [
      { speaker: 'Guest', voice: 'a', jp: '最近 、 仕事 に 追われて いて 、 なかなか 休めない んです 。', en: "Lately I'm swamped with work and can hardly rest." },
      { speaker: 'Host', voice: 'b', jp: 'それ は 大変 です ね 。', en: 'That sounds tough.' },
      { speaker: 'Host', voice: 'b', jp: 'たまに は 思い切って 休暇 を 取る べき です よ 。', en: 'Sometimes you should just go for it and take a vacation.' },
    ],
  },
  {
    id: 'negotiation', title: 'The negotiation', category: 'drama', level: 'N2', scene: '🤝📄', color: '#37474F',
    lines: [
      { speaker: 'Client', voice: 'a', jp: 'この 条件 で は 、 契約 しかねます 。', en: "We can't sign the contract on these terms." },
      { speaker: 'Sales', voice: 'b', jp: 'では 、 価格 を 見直す という こと で いかが でしょう か 。', en: 'Then how about we review the price?' },
      { speaker: 'Client', voice: 'a', jp: '前向き に 検討 させて いただきます 。', en: "We'll give it positive consideration." },
    ],
  },
  {
    id: 'rival', title: 'The rival', category: 'anime', level: 'N2', scene: '⚔️⚡️', color: '#4527A0',
    lines: [
      { speaker: 'Jin', voice: 'a', jp: 'お前 に だけ は 負ける わけ に は いかない 。', en: "You're the one person I can't afford to lose to." },
      { speaker: 'Sho', voice: 'a', jp: '口先 だけ じゃ ない こと を 証明 して みろ 。', en: "Then prove it's not just talk." },
    ],
  },
  {
    id: 'detective', title: 'The detective', category: 'movie', level: 'N1', scene: '🕵️🔍', color: '#263238',
    lines: [
      { speaker: 'Detective', voice: 'a', jp: '犯人 は 、 この 中 に いる に違いない 。', en: 'The culprit must be among us.' },
      { speaker: 'Guest', voice: 'b', jp: '根拠 も ない のに 、 疑う の は 早計 だ 。', en: "Suspecting us with no evidence is premature." },
      { speaker: 'Detective', voice: 'a', jp: '根拠 なら 、 既に 揃って いる 。', en: 'As for evidence, I already have it all.' },
    ],
  },
  {
    id: 'society', title: 'An aging society', category: 'podcast', level: 'N1', scene: '📈🏙️', color: '#004D40',
    lines: [
      { speaker: 'Analyst', voice: 'a', jp: '少子 高齢化 に伴い 、 労働力 不足 が 懸念 されて います 。', en: 'With a falling birthrate and aging population, labor shortages are a concern.' },
      { speaker: 'Analyst', voice: 'a', jp: '抜本的 な 対策 が 求められて いる と言わざるを得ません 。', en: 'I have to say that drastic measures are needed.' },
    ],
  },
  {
    id: 'resignation', title: 'The resignation', category: 'drama', level: 'N1', scene: '🏛️📰', color: '#6D4C41',
    lines: [
      { speaker: 'Reporter', voice: 'b', jp: '彼 の 辞任 は 、 避けられない 事態 だった と言える 。', en: 'His resignation could be called unavoidable.' },
      { speaker: 'Anchor', voice: 'a', jp: 'とはいえ 、 あまりにも 唐突 だった 。', en: 'Even so, it was far too sudden.' },
    ],
  },
];
