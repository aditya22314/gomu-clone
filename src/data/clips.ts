import type { Backdrop, CastMember } from '../components/SceneArt';
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
  scene: string; // short emoji summary, used in lists
  color: string;
  backdrop: Backdrop;
  rain?: boolean;
  cast: CastMember[];
  lines: Line[];
  // Optional: real clip from YouTube's official embed player. Leave out for TTS scenes.
  youtube?: { videoId: string; start: number; end: number; channel: string };
};

// All scenes are original dialogues written for this app.
export const CLIPS: Clip[] = [
  {
    id: 'late-for-school', title: 'Late for school', category: 'anime', level: 'N5', scene: '🏃‍♀️🍞', color: '#3D5AFE',
    backdrop: 'street-morning',
    cast: [{ name: 'Haru', hair: 'spiky', hairColor: '#2A2238', shirt: '#2E3F6E' }, { name: 'Mei', hair: 'ponytail', hairColor: '#5A3A2A', shirt: '#F28BA8' }],
    lines: [
      { speaker: 'Haru', voice: 'a', jp: 'おはよう ！', en: 'Good morning!' },
      { speaker: 'Mei', voice: 'b', jp: 'やばい 、 遅刻 だ ！', en: "Oh no, I'm late!" },
      { speaker: 'Haru', voice: 'a', jp: '走れ ！ 急げ ！', en: 'Run! Hurry!' },
      { speaker: 'Mei', voice: 'b', jp: '待って 、 パン を 食べて いる ！', en: "Wait, I'm eating my bread!" },
    ],
  },
  {
    id: 'cafe', title: 'At the café', category: 'drama', level: 'N5', scene: '☕️🍰', color: '#8D6E63',
    backdrop: 'cafe',
    cast: [{ name: 'Staff', hair: 'bun', hairColor: '#3A2A22', shirt: '#8A5A44' }, { name: 'Customer', hair: 'short', hairColor: '#2A2238', shirt: '#3D7BD9' }],
    lines: [
      { speaker: 'Staff', voice: 'b', jp: 'いらっしゃいませ 。', en: 'Welcome.' },
      { speaker: 'Customer', voice: 'a', jp: 'コーヒー を ください 。', en: 'A coffee, please.' },
      { speaker: 'Staff', voice: 'b', jp: 'ホット です か 、 アイス です か ？', en: 'Hot or iced?' },
      { speaker: 'Customer', voice: 'a', jp: 'ホット で お願いします 。', en: 'Hot, please.' },
    ],
  },
  {
    id: 'self-intro', title: 'Introducing myself', category: 'podcast', level: 'N5', scene: '🎙️🗼', color: '#00897B',
    backdrop: 'studio-dusk',
    cast: [{ name: 'Yuki', hair: 'long', hairColor: '#2A2238', shirt: '#F4F4F4' }],
    lines: [
      { speaker: 'Yuki', voice: 'b', jp: 'はじめまして 、 ユキ です 。', en: "Nice to meet you, I'm Yuki." },
      { speaker: 'Yuki', voice: 'b', jp: '東京 に 住んで います 。', en: 'I live in Tokyo.' },
      { speaker: 'Yuki', voice: 'b', jp: '趣味 は 映画 です 。', en: 'My hobby is movies.' },
      { speaker: 'Yuki', voice: 'b', jp: 'よろしく お願いします 。', en: 'Nice to meet you all.' },
    ],
  },
  {
    id: 'rain', title: 'Caught in the rain', category: 'movie', level: 'N5', scene: '🌧️☂️', color: '#546E7A',
    backdrop: 'rain-station', rain: true,
    cast: [{ name: 'Sora', hair: 'short', hairColor: '#3A2A22', shirt: '#2E3F6E' }, { name: 'Aoi', hair: 'bob', hairColor: '#2A2238', shirt: '#E8C46A' }],
    lines: [
      { speaker: 'Sora', voice: 'a', jp: '雨 だ 。', en: "It's raining." },
      { speaker: 'Sora', voice: 'a', jp: '傘 、 持って る ？', en: 'Do you have an umbrella?' },
      { speaker: 'Aoi', voice: 'b', jp: 'ううん 、 ない 。', en: "No, I don't." },
      { speaker: 'Sora', voice: 'a', jp: 'じゃあ 、 一緒に 帰ろう 。', en: "Then let's walk home together." },
    ],
  },
  {
    id: 'why-help', title: 'Why help me?', category: 'anime', level: 'N4', scene: '🦊🌲', color: '#E65100',
    backdrop: 'forest',
    cast: [{ name: 'Kit', hair: 'short', hairColor: '#000', shirt: '#4E9A5B', fox: true }, { name: 'Ren', hair: 'spiky', hairColor: '#3A2A22', shirt: '#D94A3D' }],
    lines: [
      { speaker: 'Kit', voice: 'b', jp: 'なんで 助けて くれる の ？', en: 'Why are you helping me?' },
      { speaker: 'Ren', voice: 'a', jp: '友達 だ から 。', en: "Because we're friends." },
      { speaker: 'Kit', voice: 'b', jp: 'でも 、 危ない よ 。', en: "But it's dangerous." },
      { speaker: 'Ren', voice: 'a', jp: '大丈夫 。 一人 じゃ ない 。', en: "It's okay. You're not alone." },
    ],
  },
  {
    id: 'homework', title: 'Forgot my homework', category: 'drama', level: 'N4', scene: '🏫📓', color: '#5E35B1',
    backdrop: 'classroom',
    cast: [{ name: 'Student', hair: 'short', hairColor: '#2A2238', shirt: '#2E3F6E' }, { name: 'Teacher', hair: 'bun', hairColor: '#6B6B6B', shirt: '#7A5AC8', glasses: true }],
    lines: [
      { speaker: 'Student', voice: 'a', jp: '宿題 を 忘れました 。', en: 'I forgot my homework.' },
      { speaker: 'Teacher', voice: 'b', jp: 'また です か ？', en: 'Again?' },
      { speaker: 'Student', voice: 'a', jp: 'すみません 。 明日 必ず 持って きます 。', en: "Sorry. I'll definitely bring it tomorrow." },
    ],
  },
  {
    id: 'weekend', title: 'Weekend hike', category: 'podcast', level: 'N4', scene: '⛰️🥾', color: '#2E7D32',
    backdrop: 'mountain',
    cast: [{ name: 'Host', hair: 'bob', hairColor: '#5A3A2A', shirt: '#14A38B' }, { name: 'Guest', hair: 'short', hairColor: '#2A2238', shirt: '#F08C00' }],
    lines: [
      { speaker: 'Host', voice: 'b', jp: '週末 は 何 を して いました か ？', en: 'What did you do on the weekend?' },
      { speaker: 'Guest', voice: 'a', jp: '友達 と 山 に 登りました 。', en: 'I climbed a mountain with friends.' },
      { speaker: 'Guest', voice: 'a', jp: '景色 が とても きれい でした 。', en: 'The view was really beautiful.' },
    ],
  },
  {
    id: 'promise', title: 'A broken promise', category: 'drama', level: 'N3', scene: '🌆⌚️', color: '#AD1457',
    backdrop: 'city-dusk',
    cast: [{ name: 'Kai', hair: 'neat', hairColor: '#2A2238', shirt: '#2E3F6E' }, { name: 'Nana', hair: 'long', hairColor: '#7A4A3A', shirt: '#F28BA8' }],
    lines: [
      { speaker: 'Kai', voice: 'a', jp: '約束 を 守れなくて 、 ごめん 。', en: "Sorry I couldn't keep my promise." },
      { speaker: 'Nana', voice: 'b', jp: 'もう いい よ 。 気に しないで 。', en: "It's fine. Don't worry about it." },
      { speaker: 'Kai', voice: 'a', jp: '次 は 絶対 に 遅れない 。', en: "Next time I absolutely won't be late." },
    ],
  },
  {
    id: 'training', title: "Don't give up", category: 'anime', level: 'N3', scene: '🥋🔥', color: '#C62828',
    backdrop: 'dojo',
    cast: [{ name: 'Coach', hair: 'neat', hairColor: '#4A4A4A', shirt: '#F4F4F4' }, { name: 'Rin', hair: 'ponytail', hairColor: '#2A2238', shirt: '#F4F4F4' }],
    lines: [
      { speaker: 'Coach', voice: 'a', jp: '諦める な ！ まだ 終わって ない ！', en: "Don't give up! It's not over yet!" },
      { speaker: 'Rin', voice: 'b', jp: 'でも 、 もう 限界 だ …', en: "But I'm at my limit..." },
      { speaker: 'Coach', voice: 'a', jp: 'お前 なら できる 。 信じて る 。', en: 'You can do it. I believe in you.' },
    ],
  },
  {
    id: 'moving', title: 'Moving to Osaka', category: 'movie', level: 'N3', scene: '📦🚄', color: '#0277BD',
    backdrop: 'platform',
    cast: [{ name: 'Mio', hair: 'bob', hairColor: '#3A2A22', shirt: '#E8C46A' }, { name: 'Taku', hair: 'short', hairColor: '#2A2238', shirt: '#4E9A5B' }],
    lines: [
      { speaker: 'Mio', voice: 'b', jp: '来月 、 大阪 に 引っ越す こと に なった 。', en: "It's been decided: I'm moving to Osaka next month." },
      { speaker: 'Taku', voice: 'a', jp: '急 だ ね 。 寂しく なる な 。', en: "That's sudden. I'll miss you." },
      { speaker: 'Mio', voice: 'b', jp: '連絡 する から 、 心配 しないで 。', en: "I'll keep in touch, so don't worry." },
    ],
  },
  {
    id: 'work-life', title: 'Too much work', category: 'podcast', level: 'N2', scene: '💼😮‍💨', color: '#455A64',
    backdrop: 'office',
    cast: [{ name: 'Guest', hair: 'neat', hairColor: '#2A2238', shirt: '#6B7280' }, { name: 'Host', hair: 'long', hairColor: '#5A3A2A', shirt: '#14A38B' }],
    lines: [
      { speaker: 'Guest', voice: 'a', jp: '最近 、 仕事 に 追われて いて 、 なかなか 休めない んです 。', en: "Lately I'm swamped with work and can hardly rest." },
      { speaker: 'Host', voice: 'b', jp: 'それ は 大変 です ね 。', en: 'That sounds tough.' },
      { speaker: 'Host', voice: 'b', jp: 'たまに は 思い切って 休暇 を 取る べき です よ 。', en: 'Sometimes you should just go for it and take a vacation.' },
    ],
  },
  {
    id: 'negotiation', title: 'The negotiation', category: 'drama', level: 'N2', scene: '🤝📄', color: '#37474F',
    backdrop: 'meeting',
    cast: [{ name: 'Client', hair: 'neat', hairColor: '#4A4A4A', shirt: '#2E3F6E', glasses: true }, { name: 'Sales', hair: 'bob', hairColor: '#2A2238', shirt: '#7A5AC8' }],
    lines: [
      { speaker: 'Client', voice: 'a', jp: 'この 条件 で は 、 契約 しかねます 。', en: "We can't sign the contract on these terms." },
      { speaker: 'Sales', voice: 'b', jp: 'では 、 価格 を 見直す という こと で いかが でしょう か 。', en: 'Then how about we review the price?' },
      { speaker: 'Client', voice: 'a', jp: '前向き に 検討 させて いただきます 。', en: "We'll give it positive consideration." },
    ],
  },
  {
    id: 'rival', title: 'The rival', category: 'anime', level: 'N2', scene: '⚔️⚡️', color: '#4527A0',
    backdrop: 'rooftop-night',
    cast: [{ name: 'Jin', hair: 'spiky', hairColor: '#E8C46A', shirt: '#D94A3D' }, { name: 'Sho', hair: 'spiky', hairColor: '#2A2238', shirt: '#2E3F6E' }],
    lines: [
      { speaker: 'Jin', voice: 'a', jp: 'お前 に だけ は 負ける わけ に は いかない 。', en: "You're the one person I can't afford to lose to." },
      { speaker: 'Sho', voice: 'a', jp: '口先 だけ じゃ ない こと を 証明 して みろ 。', en: "Then prove it's not just talk." },
    ],
  },
  {
    id: 'detective', title: 'The detective', category: 'movie', level: 'N1', scene: '🕵️🔍', color: '#263238',
    backdrop: 'mansion',
    cast: [{ name: 'Detective', hair: 'neat', hairColor: '#3A2A22', shirt: '#8A5A44', glasses: true }, { name: 'Guest', hair: 'long', hairColor: '#2A2238', shirt: '#7A5AC8' }],
    lines: [
      { speaker: 'Detective', voice: 'a', jp: '犯人 は 、 この 中 に いる に違いない 。', en: 'The culprit must be among us.' },
      { speaker: 'Guest', voice: 'b', jp: '根拠 も ない のに 、 疑う の は 早計 だ 。', en: "Suspecting us with no evidence is premature." },
      { speaker: 'Detective', voice: 'a', jp: '根拠 なら 、 既に 揃って いる 。', en: 'As for evidence, I already have it all.' },
    ],
  },
  {
    id: 'society', title: 'An aging society', category: 'podcast', level: 'N1', scene: '📈🏙️', color: '#004D40',
    backdrop: 'skyline',
    cast: [{ name: 'Analyst', hair: 'neat', hairColor: '#2A2238', shirt: '#6B7280', glasses: true }],
    lines: [
      { speaker: 'Analyst', voice: 'a', jp: '少子 高齢化 に伴い 、 労働力 不足 が 懸念 されて います 。', en: 'With a falling birthrate and aging population, labor shortages are a concern.' },
      { speaker: 'Analyst', voice: 'a', jp: '抜本的 な 対策 が 求められて いる と言わざるを得ません 。', en: 'I have to say that drastic measures are needed.' },
    ],
  },
  {
    id: 'resignation', title: 'The resignation', category: 'drama', level: 'N1', scene: '🏛️📰', color: '#6D4C41',
    backdrop: 'newsroom',
    cast: [{ name: 'Reporter', hair: 'bob', hairColor: '#2A2238', shirt: '#D94A3D' }, { name: 'Anchor', hair: 'neat', hairColor: '#4A4A4A', shirt: '#2E3F6E' }],
    lines: [
      { speaker: 'Reporter', voice: 'b', jp: '彼 の 辞任 は 、 避けられない 事態 だった と言える 。', en: 'His resignation could be called unavoidable.' },
      { speaker: 'Anchor', voice: 'a', jp: 'とはいえ 、 あまりにも 唐突 だった 。', en: 'Even so, it was far too sudden.' },
    ],
  },
  {
    id: 'konbini', title: 'At the convenience store', category: 'drama', level: 'N5', scene: '🏪', color: '#00897B',
    backdrop: 'cafe',
    cast: [{ name: 'Clerk', hair: 'neat', hairColor: '#2A2238', shirt: '#14A38B' }, { name: 'Ken', hair: 'short', hairColor: '#3A2A22', shirt: '#F08C00' }],
    lines: [
      { speaker: 'Clerk', voice: 'b', jp: '袋 は いります か ？', en: 'Do you need a bag?' },
      { speaker: 'Ken', voice: 'a', jp: 'いいえ 、 大丈夫 です 。', en: 'No, I\'m fine.' },
      { speaker: 'Clerk', voice: 'b', jp: '温めます か ？', en: 'Shall I heat it up?' },
      { speaker: 'Ken', voice: 'a', jp: 'はい 、 お願いします 。', en: 'Yes, please.' },
    ],
  },
  {
    id: 'directions', title: 'Where\'s the station?', category: 'drama', level: 'N5', scene: '🗺️', color: '#3949AB',
    backdrop: 'street-morning',
    cast: [{ name: 'Tourist', hair: 'bob', hairColor: '#E8C46A', shirt: '#3D7BD9' }, { name: 'Local', hair: 'neat', hairColor: '#2A2238', shirt: '#6B7280' }],
    lines: [
      { speaker: 'Tourist', voice: 'b', jp: 'すみません 、 駅 は どこ です か ？', en: 'Excuse me, where is the station?' },
      { speaker: 'Local', voice: 'a', jp: 'まっすぐ 行って 、 右 です 。', en: 'Go straight, then it\'s on the right.' },
      { speaker: 'Tourist', voice: 'b', jp: '遠いです か ？', en: 'Is it far?' },
      { speaker: 'Local', voice: 'a', jp: 'いいえ 、 五分 ぐらい です 。', en: 'No, about five minutes.' },
    ],
  },
  {
    id: 'birthday', title: 'Happy birthday', category: 'anime', level: 'N5', scene: '🎂', color: '#D81B60',
    backdrop: 'classroom',
    cast: [{ name: 'Saki', hair: 'ponytail', hairColor: '#5A3A2A', shirt: '#F28BA8' }, { name: 'Yuta', hair: 'spiky', hairColor: '#2A2238', shirt: '#3D7BD9' }],
    lines: [
      { speaker: 'Saki', voice: 'b', jp: '誕生日 おめでとう ！', en: 'Happy birthday!' },
      { speaker: 'Yuta', voice: 'a', jp: 'えっ 、 覚えてた の ？', en: 'Huh, you remembered?' },
      { speaker: 'Saki', voice: 'b', jp: 'もちろん 。 これ 、 プレゼント 。', en: 'Of course. This is a present.' },
      { speaker: 'Yuta', voice: 'a', jp: 'ありがとう ！ 開けて も いい ？', en: 'Thank you! Can I open it?' },
    ],
  },
  {
    id: 'ramen', title: 'The ramen shop', category: 'movie', level: 'N5', scene: '🍜', color: '#BF360C',
    backdrop: 'cafe',
    cast: [{ name: 'Chef', hair: 'neat', hairColor: '#2A2238', shirt: '#F4F4F4' }, { name: 'Hana', hair: 'bob', hairColor: '#3A2A22', shirt: '#D94A3D' }],
    lines: [
      { speaker: 'Hana', voice: 'b', jp: 'ラーメン を 一つ ください 。', en: 'One ramen, please.' },
      { speaker: 'Chef', voice: 'a', jp: 'はい 、 少々 お待ち ください 。', en: 'Sure, just a moment.' },
      { speaker: 'Hana', voice: 'b', jp: 'わあ 、 おいしそう ！', en: 'Wow, that looks delicious!' },
      { speaker: 'Hana', voice: 'b', jp: 'いただきます ！', en: 'Let\'s eat!' },
    ],
  },
  {
    id: 'weather', title: 'Today\'s weather', category: 'podcast', level: 'N5', scene: '☀️', color: '#F9A825',
    backdrop: 'mountain',
    cast: [{ name: 'Host', hair: 'bob', hairColor: '#5A3A2A', shirt: '#F08C00' }],
    lines: [
      { speaker: 'Host', voice: 'b', jp: '今日 は とても いい 天気 です ね 。', en: 'It\'s really nice weather today.' },
      { speaker: 'Host', voice: 'b', jp: '空 が 青くて 、 暖かいです 。', en: 'The sky is blue and it\'s warm.' },
      { speaker: 'Host', voice: 'b', jp: '明日 は 雨 が 降るでしょう 。', en: 'It will probably rain tomorrow.' },
    ],
  },
  {
    id: 'cat', title: 'A lost cat', category: 'anime', level: 'N5', scene: '🐈', color: '#6D4C41',
    backdrop: 'street-morning',
    cast: [{ name: 'Nao', hair: 'bob', hairColor: '#2A2238', shirt: '#E8C46A' }, { name: 'Riku', hair: 'short', hairColor: '#3A2A22', shirt: '#4E9A5B' }],
    lines: [
      { speaker: 'Nao', voice: 'b', jp: 'あ 、 猫 が いる ！', en: 'Oh, there\'s a cat!' },
      { speaker: 'Riku', voice: 'a', jp: '小さい ね 。 お母さん は どこ か な 。', en: 'It\'s small. I wonder where its mother is.' },
      { speaker: 'Nao', voice: 'b', jp: 'お腹 が 空いている みたい 。', en: 'It looks hungry.' },
      { speaker: 'Riku', voice: 'a', jp: 'じゃあ 、 牛乳 を あげよう 。', en: 'Then let\'s give it some milk.' },
    ],
  },
  {
    id: 'train-ticket', title: 'Buying a ticket', category: 'drama', level: 'N5', scene: '🎫', color: '#1565C0',
    backdrop: 'platform',
    cast: [{ name: 'Staff', hair: 'neat', hairColor: '#2A2238', shirt: '#2E3F6E' }, { name: 'Emma', hair: 'long', hairColor: '#E8C46A', shirt: '#D94A3D' }],
    lines: [
      { speaker: 'Emma', voice: 'b', jp: '京都 まで いくら です か ？', en: 'How much is it to Kyoto?' },
      { speaker: 'Staff', voice: 'a', jp: '一万四千円 です 。', en: 'It\'s fourteen thousand yen.' },
      { speaker: 'Emma', voice: 'b', jp: '次 の 電車 は 何時 です か ？', en: 'What time is the next train?' },
      { speaker: 'Staff', voice: 'a', jp: '十時半 です 。', en: 'Ten thirty.' },
    ],
  },
  {
    id: 'family', title: 'My family', category: 'podcast', level: 'N5', scene: '👨‍👩‍👧', color: '#2E7D32',
    backdrop: 'studio-dusk',
    cast: [{ name: 'Taro', hair: 'short', hairColor: '#2A2238', shirt: '#3D7BD9' }],
    lines: [
      { speaker: 'Taro', voice: 'a', jp: '私 の 家族 は 四人 です 。', en: 'There are four people in my family.' },
      { speaker: 'Taro', voice: 'a', jp: '父 と 母 と 妹 が います 。', en: 'I have a father, a mother and a younger sister.' },
      { speaker: 'Taro', voice: 'a', jp: '妹 は 高校生 です 。', en: 'My younger sister is a high school student.' },
      { speaker: 'Taro', voice: 'a', jp: '週末 は よく 一緒 に 料理 を します 。', en: 'We often cook together on weekends.' },
    ],
  },
  {
    id: 'night-sky', title: 'Stars tonight', category: 'anime', level: 'N5', scene: '🌌', color: '#283593',
    backdrop: 'rooftop-night',
    cast: [{ name: 'Hikari', hair: 'long', hairColor: '#2A2238', shirt: '#7A5AC8' }, { name: 'Sora', hair: 'short', hairColor: '#3A2A22', shirt: '#2E3F6E' }],
    lines: [
      { speaker: 'Hikari', voice: 'b', jp: '見て 、 星 が きれい 。', en: 'Look, the stars are beautiful.' },
      { speaker: 'Sora', voice: 'a', jp: '本当 だ 。 月 も 明るい ね 。', en: 'You\'re right. The moon is bright too.' },
      { speaker: 'Hikari', voice: 'b', jp: 'ずっと ここ に いたい な 。', en: 'I want to stay here forever.' },
    ],
  },
  {
    id: 'doctor', title: 'At the doctor', category: 'drama', level: 'N4', scene: '🏥', color: '#00838F',
    backdrop: 'office',
    cast: [{ name: 'Doctor', hair: 'neat', hairColor: '#4A4A4A', shirt: '#F4F4F4', glasses: true }, { name: 'Patient', hair: 'short', hairColor: '#2A2238', shirt: '#3D7BD9' }],
    lines: [
      { speaker: 'Doctor', voice: 'a', jp: '今日 は どう しました か ？', en: 'What seems to be the problem today?' },
      { speaker: 'Patient', voice: 'b', jp: '昨日 から 頭 が 痛い ん です 。', en: 'I\'ve had a headache since yesterday.' },
      { speaker: 'Doctor', voice: 'a', jp: '熱 も あります ね 。 この 薬 を 飲んでください 。', en: 'You have a fever too. Please take this medicine.' },
      { speaker: 'Patient', voice: 'b', jp: 'ありがとう ございます 。', en: 'Thank you very much.' },
    ],
  },
  {
    id: 'part-time', title: 'First day at work', category: 'drama', level: 'N4', scene: '🧑‍🍳', color: '#EF6C00',
    backdrop: 'cafe',
    cast: [{ name: 'Manager', hair: 'neat', hairColor: '#2A2238', shirt: '#8A5A44' }, { name: 'Aki', hair: 'ponytail', hairColor: '#5A3A2A', shirt: '#14A38B' }],
    lines: [
      { speaker: 'Manager', voice: 'a', jp: '今日 から よろしく ね 。', en: 'Looking forward to working with you from today.' },
      { speaker: 'Aki', voice: 'b', jp: 'はい 、 頑張ります ！', en: 'Yes, I\'ll do my best!' },
      { speaker: 'Manager', voice: 'a', jp: '分からない こと が あったら 、 何 でも 聞いて ね 。', en: 'If there\'s anything you don\'t understand, ask me anything.' },
    ],
  },
  {
    id: 'lost-wallet', title: 'The lost wallet', category: 'movie', level: 'N4', scene: '👛', color: '#5D4037',
    backdrop: 'street-morning',
    cast: [{ name: 'Officer', hair: 'neat', hairColor: '#2A2238', shirt: '#2E3F6E' }, { name: 'Mika', hair: 'bob', hairColor: '#3A2A22', shirt: '#F28BA8' }],
    lines: [
      { speaker: 'Mika', voice: 'b', jp: '財布 を なくしてしまいました 。', en: 'I\'ve lost my wallet.' },
      { speaker: 'Officer', voice: 'a', jp: 'どこ で 落とした か 覚えています か ？', en: 'Do you remember where you dropped it?' },
      { speaker: 'Mika', voice: 'b', jp: 'たぶん 、 公園 だ と 思います 。', en: 'I think it was probably the park.' },
      { speaker: 'Officer', voice: 'a', jp: 'じゃあ 、 一緒 に 探し に 行きましょう 。', en: 'Then let\'s go look for it together.' },
    ],
  },
  {
    id: 'festival', title: 'Summer festival', category: 'anime', level: 'N4', scene: '🎆', color: '#AD1457',
    backdrop: 'city-dusk',
    cast: [{ name: 'Rina', hair: 'bun', hairColor: '#2A2238', shirt: '#F28BA8' }, { name: 'Kenta', hair: 'spiky', hairColor: '#3A2A22', shirt: '#2E3F6E' }],
    lines: [
      { speaker: 'Rina', voice: 'b', jp: '浴衣 、 似合ってる ？', en: 'Does my yukata suit me?' },
      { speaker: 'Kenta', voice: 'a', jp: 'う 、 うん 。 すごく かわいい 。', en: 'Y-yeah. It\'s really cute.' },
      { speaker: 'Rina', voice: 'b', jp: '早く 行こう ！ 花火 が 始まっちゃう ！', en: 'Let\'s hurry! The fireworks are going to start!' },
    ],
  },
  {
    id: 'exam', title: 'Before the exam', category: 'anime', level: 'N4', scene: '📝', color: '#4527A0',
    backdrop: 'classroom',
    cast: [{ name: 'Shun', hair: 'neat', hairColor: '#2A2238', shirt: '#2E3F6E', glasses: true }, { name: 'Mai', hair: 'ponytail', hairColor: '#5A3A2A', shirt: '#7A5AC8' }],
    lines: [
      { speaker: 'Mai', voice: 'b', jp: 'テスト 、 緊張する ね 。', en: 'The test is making me nervous.' },
      { speaker: 'Shun', voice: 'a', jp: 'ちゃんと 勉強した から 、 きっと 大丈夫 だ よ 。', en: 'You studied properly, so you\'ll surely be fine.' },
      { speaker: 'Mai', voice: 'b', jp: '終わったら 、 カラオケ に 行かない ？', en: 'Want to go to karaoke when it\'s over?' },
      { speaker: 'Shun', voice: 'a', jp: 'いい ね 、 行こう ！', en: 'Sounds good, let\'s go!' },
    ],
  },
  {
    id: 'hotel', title: 'Checking in', category: 'drama', level: 'N4', scene: '🏨', color: '#37474F',
    backdrop: 'meeting',
    cast: [{ name: 'Front desk', hair: 'bun', hairColor: '#2A2238', shirt: '#2E3F6E' }, { name: 'Guest', hair: 'short', hairColor: '#E8C46A', shirt: '#6B7280' }],
    lines: [
      { speaker: 'Guest', voice: 'a', jp: '予約した スミス です 。', en: 'I\'m Smith, I have a reservation.' },
      { speaker: 'Front desk', voice: 'b', jp: 'お待ちしておりました 。 二泊 です ね 。', en: 'We\'ve been expecting you. Two nights, right?' },
      { speaker: 'Guest', voice: 'a', jp: '朝 ご飯 は 何時 から です か ？', en: 'What time is breakfast from?' },
      { speaker: 'Front desk', voice: 'b', jp: '七時 から 九時 まで です 。', en: 'From seven to nine.' },
    ],
  },
  {
    id: 'cooking', title: 'Making curry', category: 'podcast', level: 'N4', scene: '🍛', color: '#F57F17',
    backdrop: 'cafe',
    cast: [{ name: 'Chef Yumi', hair: 'bun', hairColor: '#5A3A2A', shirt: '#F4F4F4' }],
    lines: [
      { speaker: 'Chef Yumi', voice: 'b', jp: 'まず 、 野菜 を 小さく 切ります 。', en: 'First, cut the vegetables small.' },
      { speaker: 'Chef Yumi', voice: 'b', jp: '次に 、 肉 と 一緒 に 炒めてください 。', en: 'Next, please fry them together with the meat.' },
      { speaker: 'Chef Yumi', voice: 'b', jp: '最後 に ルー を 入れて 、 二十分 煮たら 完成 です 。', en: 'Finally, add the roux and simmer for twenty minutes, and it\'s done.' },
    ],
  },
  {
    id: 'phone-call', title: 'Running late', category: 'drama', level: 'N4', scene: '📱', color: '#0277BD',
    backdrop: 'platform',
    cast: [{ name: 'Daichi', hair: 'short', hairColor: '#2A2238', shirt: '#4E9A5B' }, { name: 'Erika', hair: 'long', hairColor: '#3A2A22', shirt: '#F28BA8' }],
    lines: [
      { speaker: 'Daichi', voice: 'a', jp: 'もしもし 、 ごめん 、 電車 が 遅れてて 。', en: 'Hello, sorry, the train is delayed.' },
      { speaker: 'Erika', voice: 'b', jp: '大丈夫 だ よ 。 何分 ぐらい かかりそう ？', en: 'It\'s fine. About how many minutes will it take?' },
      { speaker: 'Daichi', voice: 'a', jp: 'あと 十五分 で 着く と 思う 。', en: 'I think I\'ll arrive in fifteen more minutes.' },
      { speaker: 'Erika', voice: 'b', jp: 'わかった 。 駅 の 前 で 待ってる ね 。', en: 'Got it. I\'ll wait in front of the station.' },
    ],
  },
  {
    id: 'confession', title: 'The confession', category: 'anime', level: 'N3', scene: '🌸', color: '#C2185B',
    backdrop: 'rooftop-night',
    cast: [{ name: 'Haruto', hair: 'short', hairColor: '#2A2238', shirt: '#2E3F6E' }, { name: 'Sakura', hair: 'long', hairColor: '#5A3A2A', shirt: '#F28BA8' }],
    lines: [
      { speaker: 'Haruto', voice: 'a', jp: 'ずっと 言いたかった こと が ある ん だ 。', en: 'There\'s something I\'ve always wanted to say.' },
      { speaker: 'Sakura', voice: 'b', jp: '… 何 ？', en: '...What is it?' },
      { speaker: 'Haruto', voice: 'a', jp: '初めて 会った 時 から 、 君 の こと が 好き だった 。', en: 'I\'ve liked you since the first time we met.' },
      { speaker: 'Sakura', voice: 'b', jp: '私 も 、 同じ 気持ち だ よ 。', en: 'I feel the same way.' },
    ],
  },
  {
    id: 'job-interview', title: 'The job interview', category: 'drama', level: 'N3', scene: '💼', color: '#455A64',
    backdrop: 'meeting',
    cast: [{ name: 'Interviewer', hair: 'neat', hairColor: '#4A4A4A', shirt: '#2E3F6E', glasses: true }, { name: 'Ryo', hair: 'neat', hairColor: '#2A2238', shirt: '#2A2238' }],
    lines: [
      { speaker: 'Interviewer', voice: 'a', jp: 'どうして 弊社 を 選んだ ん です か ？', en: 'Why did you choose our company?' },
      { speaker: 'Ryo', voice: 'b', jp: '新しい こと に 挑戦 できる 環境 だ と 思った から です 。', en: 'Because I thought it was an environment where I could take on new challenges.' },
      { speaker: 'Interviewer', voice: 'a', jp: 'あなた の 長所 を 教えてください 。', en: 'Please tell us your strengths.' },
      { speaker: 'Ryo', voice: 'b', jp: '最後 まで 諦めない ところ です 。', en: 'That I never give up until the end.' },
    ],
  },
  {
    id: 'ghost', title: 'Something in the hallway', category: 'anime', level: 'N3', scene: '👻', color: '#311B92',
    backdrop: 'mansion',
    cast: [{ name: 'Yui', hair: 'bob', hairColor: '#2A2238', shirt: '#7A5AC8' }, { name: 'Takeshi', hair: 'spiky', hairColor: '#3A2A22', shirt: '#D94A3D' }],
    lines: [
      { speaker: 'Yui', voice: 'b', jp: '今 、 何 か 音 が しなかった ？', en: 'Didn\'t you just hear a sound?' },
      { speaker: 'Takeshi', voice: 'a', jp: '気 の せい だろう 。 風の音 だ よ 。', en: 'It\'s just your imagination. It\'s the wind.' },
      { speaker: 'Yui', voice: 'b', jp: 'でも 、 誰 か が 歩いている みたい だった 。', en: 'But it sounded like someone was walking.' },
      { speaker: 'Takeshi', voice: 'a', jp: '… やっぱり 、 帰ろう か 。', en: '...Maybe we should go home after all.' },
    ],
  },
  {
    id: 'old-friend', title: 'An old friend', category: 'movie', level: 'N3', scene: '☕', color: '#6D4C41',
    backdrop: 'cafe',
    cast: [{ name: 'Kenji', hair: 'neat', hairColor: '#2A2238', shirt: '#8A5A44' }, { name: 'Aya', hair: 'long', hairColor: '#5A3A2A', shirt: '#14A38B' }],
    lines: [
      { speaker: 'Aya', voice: 'b', jp: '久しぶり ！ 全然 変わってない ね 。', en: 'Long time no see! You haven\'t changed at all.' },
      { speaker: 'Kenji', voice: 'a', jp: 'そっち こそ 。 十年ぶり か な 。', en: 'Neither have you. Has it been ten years?' },
      { speaker: 'Aya', voice: 'b', jp: 'あの 頃 は 毎日 一緒 に 帰ってた よ ね 。', en: 'Back then we used to walk home together every day.' },
      { speaker: 'Kenji', voice: 'a', jp: '懐かしい な 。', en: 'That brings back memories.' },
    ],
  },
  {
    id: 'soccer', title: 'The final match', category: 'anime', level: 'N3', scene: '⚽', color: '#2E7D32',
    backdrop: 'mountain',
    cast: [{ name: 'Captain', hair: 'spiky', hairColor: '#2A2238', shirt: '#3D7BD9' }, { name: 'Taiga', hair: 'short', hairColor: '#3A2A22', shirt: '#3D7BD9' }],
    lines: [
      { speaker: 'Captain', voice: 'a', jp: 'みんな 、 最後 の 試合 だ 。 悔い の ない よう に 戦おう ！', en: 'Everyone, this is our last match. Let\'s fight with no regrets!' },
      { speaker: 'Taiga', voice: 'b', jp: 'おう ！ 絶対 に 勝つ ぞ ！', en: 'Yeah! We\'re definitely going to win!' },
      { speaker: 'Captain', voice: 'a', jp: '今 まで の 練習 を 信じろ 。', en: 'Trust all the practice we\'ve done.' },
    ],
  },
  {
    id: 'apology', title: 'I was wrong', category: 'drama', level: 'N3', scene: '🙇', color: '#5E35B1',
    backdrop: 'city-dusk',
    cast: [{ name: 'Sota', hair: 'short', hairColor: '#2A2238', shirt: '#6B7280' }, { name: 'Kana', hair: 'bob', hairColor: '#3A2A22', shirt: '#E8C46A' }],
    lines: [
      { speaker: 'Sota', voice: 'a', jp: '昨日 は ひどい こと を 言って 、 本当に 悪かった 。', en: 'I said awful things yesterday, I\'m truly sorry.' },
      { speaker: 'Kana', voice: 'b', jp: '私 も 言い過ぎた と 思う 。', en: 'I think I said too much too.' },
      { speaker: 'Sota', voice: 'a', jp: 'これから は 、 もっと ちゃんと 話 を 聞く よ 。', en: 'From now on, I\'ll listen to you properly.' },
    ],
  },
  {
    id: 'travel-plan', title: 'Planning a trip', category: 'podcast', level: 'N3', scene: '✈️', color: '#0097A7',
    backdrop: 'studio-dusk',
    cast: [{ name: 'Host', hair: 'bob', hairColor: '#5A3A2A', shirt: '#14A38B' }, { name: 'Guest', hair: 'short', hairColor: '#2A2238', shirt: '#F08C00' }],
    lines: [
      { speaker: 'Host', voice: 'b', jp: '冬休み は どこ に 行く 予定 です か ？', en: 'Where are you planning to go for winter break?' },
      { speaker: 'Guest', voice: 'a', jp: '北海道 に 行って 、 スキー を する つもり です 。', en: 'I intend to go to Hokkaido and ski.' },
      { speaker: 'Host', voice: 'b', jp: 'いいです ね 。 雪 祭り も 有名 です よ 。', en: 'Nice. The snow festival is famous too.' },
    ],
  },
  {
    id: 'startup', title: 'Starting a company', category: 'podcast', level: 'N2', scene: '🚀', color: '#1A237E',
    backdrop: 'office',
    cast: [{ name: 'Founder', hair: 'neat', hairColor: '#2A2238', shirt: '#2A2238' }, { name: 'Host', hair: 'long', hairColor: '#5A3A2A', shirt: '#14A38B' }],
    lines: [
      { speaker: 'Host', voice: 'b', jp: '起業しよう と 思った きっかけ は 何 です か ？', en: 'What made you decide to start a company?' },
      { speaker: 'Founder', voice: 'a', jp: '前 の 会社 で は 、 自分 の アイデア を 実現 できなかった ん です 。', en: 'At my previous company, I couldn\'t make my ideas a reality.' },
      { speaker: 'Founder', voice: 'a', jp: '失敗 を 恐れず に 、 とにかく やってみる こと が 大切 だ と 思います 。', en: 'I think it\'s important to just try, without fearing failure.' },
    ],
  },
  {
    id: 'news-weather', title: 'Typhoon warning', category: 'drama', level: 'N2', scene: '🌀', color: '#263238',
    backdrop: 'newsroom',
    cast: [{ name: 'Anchor', hair: 'neat', hairColor: '#4A4A4A', shirt: '#2E3F6E' }],
    lines: [
      { speaker: 'Anchor', voice: 'a', jp: '大型 の 台風 が 明日 の 朝 、 関東 地方 に 接近する 見込み です 。', en: 'A large typhoon is expected to approach the Kanto region tomorrow morning.' },
      { speaker: 'Anchor', voice: 'a', jp: '不要 な 外出 は 控える よう に してください 。', en: 'Please refrain from going out unnecessarily.' },
      { speaker: 'Anchor', voice: 'a', jp: '交通 機関 に も 大きな 影響 が 出る 恐れ が あります 。', en: 'There is a risk of major disruption to public transport.' },
    ],
  },
  {
    id: 'mentor', title: 'Advice from a senior', category: 'drama', level: 'N2', scene: '🧑‍🏫', color: '#4E342E',
    backdrop: 'office',
    cast: [{ name: 'Senpai', hair: 'neat', hairColor: '#4A4A4A', shirt: '#6B7280' }, { name: 'Kohai', hair: 'short', hairColor: '#2A2238', shirt: '#3D7BD9' }],
    lines: [
      { speaker: 'Kohai', voice: 'b', jp: 'また 上司 に 怒られてしまいました 。', en: 'I got scolded by my boss again.' },
      { speaker: 'Senpai', voice: 'a', jp: '最初 は みんな そう だ よ 。 大切 な の は 、 同じ ミス を 繰り返さない こと だ 。', en: 'Everyone\'s like that at first. What matters is not repeating the same mistake.' },
      { speaker: 'Kohai', voice: 'b', jp: '肝 に 銘じます 。', en: 'I\'ll take that to heart.' },
    ],
  },
  {
    id: 'rivals-chess', title: 'The shogi match', category: 'anime', level: 'N2', scene: '♟️', color: '#3E2723',
    backdrop: 'dojo',
    cast: [{ name: 'Master', hair: 'neat', hairColor: '#E8E8E8', shirt: '#2A2238' }, { name: 'Kaito', hair: 'spiky', hairColor: '#2A2238', shirt: '#D94A3D' }],
    lines: [
      { speaker: 'Master', voice: 'a', jp: '焦り は 禁物 だ 。 一手先 で は なく 、 十手先 を 読め 。', en: 'Impatience is your enemy. Read ten moves ahead, not one.' },
      { speaker: 'Kaito', voice: 'b', jp: 'でも 、 相手 の 考え が 全然 読めない ん です 。', en: 'But I can\'t read my opponent\'s thinking at all.' },
      { speaker: 'Master', voice: 'a', jp: 'ならば 、 相手 の 立場 に なって 考えてみる こと だ 。', en: 'Then try thinking from your opponent\'s position.' },
    ],
  },
  {
    id: 'environment', title: 'Plastic waste', category: 'podcast', level: 'N2', scene: '🌊', color: '#00695C',
    backdrop: 'skyline',
    cast: [{ name: 'Expert', hair: 'bob', hairColor: '#2A2238', shirt: '#14A38B', glasses: true }],
    lines: [
      { speaker: 'Expert', voice: 'b', jp: '海 に 流れ込む プラスチック の 量 は 年々 増加しています 。', en: 'The amount of plastic flowing into the sea is increasing year by year.' },
      { speaker: 'Expert', voice: 'b', jp: '一人ひとり が 意識 を 変えなければ 、 問題 は 解決しないでしょう 。', en: 'Unless each of us changes our awareness, the problem probably won\'t be solved.' },
    ],
  },
  {
    id: 'courtroom', title: 'In court', category: 'drama', level: 'N1', scene: '⚖️', color: '#212121',
    backdrop: 'meeting',
    cast: [{ name: 'Lawyer', hair: 'neat', hairColor: '#2A2238', shirt: '#2A2238', glasses: true }, { name: 'Prosecutor', hair: 'bob', hairColor: '#4A4A4A', shirt: '#6B7280' }],
    lines: [
      { speaker: 'Lawyer', voice: 'a', jp: '被告人 が 犯行 に 及んだ という 証拠 は 、 どこ に も ありません 。', en: 'There is no evidence anywhere that the defendant committed the crime.' },
      { speaker: 'Prosecutor', voice: 'b', jp: 'しかし 、 防犯 カメラ の 映像 が 全て を 物語っています 。', en: 'However, the security camera footage tells the whole story.' },
      { speaker: 'Lawyer', voice: 'a', jp: 'その 映像 の 信憑性 こそ 、 疑わしい と 言わざる を 得ません 。', en: 'It is precisely the reliability of that footage that I must call into question.' },
    ],
  },
  {
    id: 'samurai', title: 'The last samurai', category: 'movie', level: 'N1', scene: '🗡️', color: '#4E342E',
    backdrop: 'dojo',
    cast: [{ name: 'Lord', hair: 'neat', hairColor: '#2A2238', shirt: '#8A5A44' }, { name: 'Retainer', hair: 'spiky', hairColor: '#2A2238', shirt: '#2E3F6E' }],
    lines: [
      { speaker: 'Lord', voice: 'a', jp: 'この 城 を 明け渡す くらい なら 、 潔く 散る まで だ 。', en: 'Rather than surrender this castle, I\'ll fall with honor.' },
      { speaker: 'Retainer', voice: 'b', jp: '殿 、 どうか お考え直しください 。', en: 'My lord, I beg you to reconsider.' },
      { speaker: 'Lord', voice: 'a', jp: '武士 に 二言 は ない 。', en: 'A samurai never goes back on his word.' },
    ],
  },
  {
    id: 'economy', title: 'The weak yen', category: 'podcast', level: 'N1', scene: '💴', color: '#1B5E20',
    backdrop: 'skyline',
    cast: [{ name: 'Economist', hair: 'neat', hairColor: '#4A4A4A', shirt: '#6B7280', glasses: true }],
    lines: [
      { speaker: 'Economist', voice: 'a', jp: '円安 が 続く 中 、 輸入品 の 価格 高騰 が 家計 を 圧迫しています 。', en: 'As the weak yen continues, soaring prices of imports are squeezing household budgets.' },
      { speaker: 'Economist', voice: 'a', jp: '賃金 の 上昇 が 物価 に 追いつかない 限り 、 景気 回復 は 実感しにくいでしょう 。', en: 'Unless wages catch up with prices, the recovery will be hard to feel.' },
    ],
  },
  {
    id: 'philosophy', title: 'What is happiness?', category: 'podcast', level: 'N1', scene: '🌿', color: '#33691E',
    backdrop: 'forest',
    cast: [{ name: 'Professor', hair: 'neat', hairColor: '#E8E8E8', shirt: '#4E9A5B', glasses: true }],
    lines: [
      { speaker: 'Professor', voice: 'a', jp: '幸福 と は 、 他人 と 比較して 得られる もの で は ありません 。', en: 'Happiness is not something you get by comparing yourself with others.' },
      { speaker: 'Professor', voice: 'a', jp: 'むしろ 、 日々 の 些細 な 出来事 に 感謝 できる か どう か に かかっている の です 。', en: 'Rather, it depends on whether you can be grateful for the small things in daily life.' },
    ],
  },
  {
    id: 'scientist', title: 'The breakthrough', category: 'movie', level: 'N1', scene: '🔬', color: '#006064',
    backdrop: 'office',
    cast: [{ name: 'Dr. Mori', hair: 'bob', hairColor: '#2A2238', shirt: '#F4F4F4', glasses: true }, { name: 'Assistant', hair: 'short', hairColor: '#3A2A22', shirt: '#F4F4F4' }],
    lines: [
      { speaker: 'Assistant', voice: 'b', jp: '先生 、 実験 の 結果 が 出ました ！ 仮説 が 立証されました ！', en: 'Professor, the results are in! The hypothesis has been proven!' },
      { speaker: 'Dr. Mori', voice: 'a', jp: '喜ぶ の は まだ 早い 。 再現性 を 確かめる まで は 、 公表 は 差し控えよう 。', en: 'It\'s too early to celebrate. Let\'s hold off on announcing it until we confirm it\'s reproducible.' },
    ],
  },
];
