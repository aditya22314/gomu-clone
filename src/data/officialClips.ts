import type { Level } from './dictionary';

// Clips from anime that the rights holders publish themselves on YouTube (Crunchyroll, Aniplex).
// They play through YouTube's own embedded player: nothing is downloaded or re-hosted, the views
// and ads go to the channel, and the channel is credited on screen. If a channel turns off
// embedding or a clip is blocked in the viewer's country, the player reports an error and the
// card offers "Open on YouTube" and "Next clip" instead.
//
// `jaCaptions` marks clips where YouTube has Japanese captions, so they show in the player.

// lv: rough JLPT level, or Other for words that are not on the usual lists
export type ShowWord = { w: string; r: string; en: string; lv?: Level | 'Other' };

export type Show = {
  id: string;
  name: string;
  jp: string;
  color: string;
  // everyday words that come up in this show, to tap and save while watching
  words: ShowWord[];
};

export const SHOWS: Show[] = [
  {
    id: 'naruto',
    name: 'Naruto',
    jp: 'ナルト',
    color: '#F08C00',
    words: [
      { w: '忍者', r: 'にんじゃ', en: 'ninja', lv: 'Other' },
      { w: '仲間', r: 'なかま', en: 'friend, comrade', lv: 'N3' },
      { w: '夢', r: 'ゆめ', en: 'dream', lv: 'N3' },
      { w: '約束', r: 'やくそく', en: 'promise' },
      { w: '諦める', r: 'あきらめる', en: 'to give up' },
      { w: '火影', r: 'ほかげ', en: 'Hokage (village leader)', lv: 'Other' },
    ],
  },
  {
    id: 'demon-slayer',
    name: 'Demon Slayer',
    jp: '鬼滅の刃',
    color: '#14A38B',
    words: [
      { w: '鬼', r: 'おに', en: 'demon, ogre', lv: 'Other' },
      { w: '刀', r: 'かたな', en: 'sword', lv: 'Other' },
      { w: '呼吸', r: 'こきゅう', en: 'breathing', lv: 'N2' },
      { w: '妹', r: 'いもうと', en: 'younger sister' },
      { w: '守る', r: 'まもる', en: 'to protect', lv: 'N3' },
      { w: '強い', r: 'つよい', en: 'strong', lv: 'N5' },
    ],
  },
  {
    id: 'spy-family',
    name: 'Spy x Family',
    jp: 'スパイファミリー',
    color: '#E64980',
    words: [
      { w: '家族', r: 'かぞく', en: 'family' },
      { w: '任務', r: 'にんむ', en: 'mission', lv: 'N1' },
      { w: '秘密', r: 'ひみつ', en: 'secret', lv: 'N3' },
      { w: '学校', r: 'がっこう', en: 'school', lv: 'N5' },
      { w: '父', r: 'ちち', en: '(my) father' },
      { w: '平和', r: 'へいわ', en: 'peace', lv: 'N3' },
    ],
  },
  {
    id: 'frieren',
    name: 'Frieren',
    jp: '葬送のフリーレン',
    color: '#3D8BFD',
    words: [
      { w: '魔法', r: 'まほう', en: 'magic', lv: 'Other' },
      { w: '旅', r: 'たび', en: 'journey', lv: 'N3' },
      { w: '勇者', r: 'ゆうしゃ', en: 'hero', lv: 'Other' },
      { w: '思い出', r: 'おもいで', en: 'memory', lv: 'N3' },
      { w: '弟子', r: 'でし', en: 'apprentice', lv: 'N1' },
      { w: '時間', r: 'じかん', en: 'time', lv: 'N5' },
    ],
  },
  {
    id: 'one-piece',
    name: 'One Piece',
    jp: 'ワンピース',
    color: '#D93838',
    words: [
      { w: '海賊', r: 'かいぞく', en: 'pirate', lv: 'Other' },
      { w: '船', r: 'ふね', en: 'ship', lv: 'N4' },
      { w: '宝', r: 'たから', en: 'treasure', lv: 'N2' },
      { w: '帽子', r: 'ぼうし', en: 'hat', lv: 'N5' },
      { w: '自由', r: 'じゆう', en: 'freedom', lv: 'N3' },
      { w: '仲間', r: 'なかま', en: 'crewmate, friend', lv: 'N3' },
    ],
  },
  {
    id: 'solo-leveling',
    name: 'Solo Leveling',
    jp: '俺だけレベルアップな件',
    color: '#8B5CF6',
    words: [
      { w: '影', r: 'かげ', en: 'shadow', lv: 'N2' },
      { w: '王', r: 'おう', en: 'king', lv: 'N2' },
      { w: '戦う', r: 'たたかう', en: 'to fight', lv: 'N2' },
      { w: '弱い', r: 'よわい', en: 'weak', lv: 'N5' },
      { w: '命令', r: 'めいれい', en: 'order, command', lv: 'N2' },
      { w: '起きろ', r: 'おきろ', en: 'get up! (command)', lv: 'N5' },
    ],
  },
  {
    id: 'haikyu',
    name: 'Haikyu!!',
    jp: 'ハイキュー!!',
    color: '#F59F00',
    words: [
      { w: '試合', r: 'しあい', en: 'match, game' },
      { w: '練習', r: 'れんしゅう', en: 'practice' },
      { w: '飛ぶ', r: 'とぶ', en: 'to fly, to jump', lv: 'N5' },
      { w: '勝つ', r: 'かつ', en: 'to win' },
      { w: '負ける', r: 'まける', en: 'to lose' },
      { w: '先輩', r: 'せんぱい', en: 'senior (at school or club)', lv: 'N3' },
    ],
  },
];

export type OfficialClip = {
  videoId: string;
  show: string; // Show.id
  title: string;
  channel: string;
  level: Level;
  jaCaptions?: boolean;
};

export const OFFICIAL_CLIPS: OfficialClip[] = [
  { videoId: 'CmsXraEmC90', show: 'naruto', title: 'Partners', channel: 'Crunchyroll', level: 'N3', jaCaptions: true },
  { videoId: 'jXtExN4ln3U', show: 'spy-family', title: 'Anya is Invincible!', channel: 'Crunchyroll', level: 'N4', jaCaptions: true },
  { videoId: '8HuAlV5uMJY', show: 'demon-slayer', title: 'Tanjiro Puts on the Mask', channel: 'Crunchyroll', level: 'N3' },
  { videoId: '-C3Jqo7wUxE', show: 'frieren', title: "Himmel's Wish", channel: 'Crunchyroll', level: 'N3' },
  { videoId: 'fzoQZ2dJ4fk', show: 'one-piece', title: 'Shanks Gives Luffy His Straw Hat', channel: 'Crunchyroll', level: 'N3' },
  { videoId: 'IrHTT2IEKpE', show: 'solo-leveling', title: 'Jinwoo vs the Ant King', channel: 'Crunchyroll', level: 'N2', jaCaptions: true },
  { videoId: 'qi2rByJed-E', show: 'naruto', title: 'Naruto vs Sasuke', channel: 'Crunchyroll', level: 'N2' },
  { videoId: 'L6yAQI_Zhyk', show: 'spy-family', title: 'The Slap', channel: 'Crunchyroll', level: 'N4', jaCaptions: true },
  { videoId: 's3kYr2OVoUc', show: 'demon-slayer', title: 'Tanjiro Faces Akaza', channel: 'Aniplex', level: 'N2' },
  { videoId: 'UqgdxZgStYs', show: 'frieren', title: 'Only 10 Years', channel: 'Crunchyroll', level: 'N3' },
  { videoId: 'ep_2LNgcGxQ', show: 'one-piece', title: 'Will You Call Me Your Friend Again?', channel: 'Crunchyroll', level: 'N3' },
  { videoId: 'F32nhlbV2Us', show: 'haikyu', title: 'Haikyu!! clip', channel: 'Crunchyroll', level: 'N3' },
  { videoId: 'P6KMKOBxVoE', show: 'spy-family', title: 'Bond Training', channel: 'Crunchyroll', level: 'N4' },
  { videoId: '98yvX9wY7J0', show: 'naruto', title: 'Night Guy', channel: 'Crunchyroll', level: 'N2' },
  { videoId: 'fYECDqIKm90', show: 'frieren', title: 'A 50-Year Promise', channel: 'Crunchyroll', level: 'N3' },
  { videoId: '0o3bpziP6Po', show: 'one-piece', title: "Sanji's Bento", channel: 'Crunchyroll', level: 'N3' },
  { videoId: '-uIpCTGDX44', show: 'frieren', title: 'Not a Morning Elf', channel: 'Crunchyroll', level: 'N4' },
  { videoId: 'CoQ21gqRogU', show: 'naruto', title: "I'm in Hell", channel: 'Crunchyroll', level: 'N2' },
  { videoId: 'nBTIaVNIYPc', show: 'one-piece', title: 'Luffy Punches Loki', channel: 'Crunchyroll', level: 'N3' },
  { videoId: 'hFuqCO4lWKk', show: 'frieren', title: '"Mother"', channel: 'Crunchyroll', level: 'N3' },
];

export const showById = (id?: string) => SHOWS.find((s) => s.id === id);
