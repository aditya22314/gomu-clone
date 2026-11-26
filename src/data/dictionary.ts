export type Level = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
export const LEVELS: Level[] = ['N5', 'N4', 'N3', 'N2', 'N1'];

export type Entry = {
  surface: string;
  reading: string; // hiragana
  meaning: string;
  level: Level;
  pos: string;
  base?: string; // dictionary form, when surface is inflected
};

const entries: Entry[] = [];
function d(surface: string, reading: string, meaning: string, level: Level, pos: string, base?: string) {
  entries.push({ surface, reading, meaning, level, pos, base });
}

// Particles and grammar words
d('は', 'は', 'topic marker', 'N5', 'particle');
d('が', 'が', 'subject marker; but', 'N5', 'particle');
d('を', 'を', 'object marker', 'N5', 'particle');
d('に', 'に', 'to; at; in', 'N5', 'particle');
d('で', 'で', 'at; by; with; in', 'N5', 'particle');
d('と', 'と', 'and; with; (quotation)', 'N5', 'particle');
d('の', 'の', "possessive 's; explanatory の", 'N5', 'particle');
d('も', 'も', 'also; even', 'N5', 'particle');
d('か', 'か', 'question marker; or', 'N5', 'particle');
d('よ', 'よ', 'sentence ending: emphasis', 'N5', 'particle');
d('ね', 'ね', "sentence ending: right?, isn't it", 'N5', 'particle');
d('な', 'な', "don't (prohibitive) / sentence ending", 'N4', 'particle');
d('から', 'から', 'because; from', 'N5', 'particle');
d('なら', 'なら', 'if; as for', 'N4', 'particle');
d('じゃ', 'じゃ', 'is not (with ない); well then', 'N5', 'particle');
d('のに', 'のに', 'even though; despite', 'N4', 'particle');
d('だけ', 'だけ', 'only; just', 'N5', 'particle');
d('です', 'です', 'is; am; are (polite)', 'N5', 'copula');
d('でした', 'でした', 'was (polite past of です)', 'N5', 'copula', 'です');
d('だ', 'だ', 'is (plain copula)', 'N5', 'copula');
d('だった', 'だった', 'was (plain past copula)', 'N4', 'copula', 'だ');
d('でしょう', 'でしょう', 'probably; right? (polite)', 'N4', 'copula');
d('んです', 'んです', 'explanatory: it is that...', 'N4', 'expression');
d('います', 'います', 'to be (animate); ~ing (polite)', 'N5', 'verb', 'いる');
d('いる', 'いる', 'to be (animate); ~ing', 'N5', 'verb');
d('いて', 'いて', '~ing and... (て-form of いる)', 'N4', 'verb', 'いる');
d('いました', 'いました', 'was ~ing (polite past)', 'N5', 'verb', 'いる');
d('る', 'る', '~ing (casual contraction of いる)', 'N4', 'auxiliary', 'いる');
d('ない', 'ない', 'not; there is none', 'N5', 'adjective');
d('こと', 'こと', 'thing; matter (nominalizer)', 'N4', 'noun');
d('なった', 'なった', 'became (past of なる)', 'N4', 'verb', 'なる');
d('なる', 'なる', 'to become', 'N5', 'verb');
d('する', 'する', 'to do', 'N5', 'verb');
d('して', 'して', 'doing (て-form of する)', 'N5', 'verb', 'する');
d('しないで', 'しないで', "don't (do) — request", 'N4', 'verb', 'する');
d('されて', 'されて', 'being done (passive て-form of する)', 'N3', 'verb', 'する');
d('させて', 'させて', 'let (me) do (causative て-form of する)', 'N3', 'verb', 'する');
d('いただきます', 'いただきます', 'humbly receive; (will) humbly do', 'N3', 'verb', 'いただく');
d('くれる', 'くれる', 'to do for me', 'N4', 'verb');
d('べき', 'べき', 'should; ought to', 'N3', 'auxiliary');
d('わけ', 'わけ', 'reason; (わけにはいかない) cannot afford to', 'N3', 'noun');
d('いかない', 'いかない', "won't go; (わけにはいかない) can't afford to", 'N3', 'verb', 'いく');
d('みろ', 'みろ', 'try (doing)! (command of みる)', 'N3', 'verb', 'みる');
d('という', 'という', 'called; that (quotation)', 'N4', 'expression');
d('いかが', 'いかが', 'how (polite)', 'N4', 'adverb');
d('に違いない', 'にちがいない', 'must be; no doubt', 'N3', 'expression');
d('に伴い', 'にともない', 'along with; as a result of', 'N2', 'expression');
d('と言わざるを得ません', 'といわざるをえません', 'cannot help but say', 'N1', 'expression');
d('とはいえ', 'とはいえ', 'even so; that said', 'N1', 'conjunction');
d('と言える', 'といえる', 'it can be said that', 'N3', 'expression');
d('しかねます', 'しかねます', 'cannot (do) — polite refusal', 'N2', 'auxiliary', 'しかねる');
d('では', 'では', 'then; well then; in/at', 'N5', 'conjunction');
d('でも', 'でも', 'but; however', 'N5', 'conjunction');
d('じゃあ', 'じゃあ', 'well then', 'N5', 'conjunction');
d('なんで', 'なんで', 'why', 'N4', 'adverb');
d('また', 'また', 'again', 'N5', 'adverb');
d('もう', 'もう', 'already; anymore', 'N5', 'adverb');
d('まだ', 'まだ', 'still; not yet', 'N5', 'adverb');
d('とても', 'とても', 'very', 'N5', 'adverb');
d('たまに', 'たまに', 'occasionally', 'N4', 'adverb');
d('なかなか', 'なかなか', '(with negative) not easily', 'N3', 'adverb');
d('この', 'この', 'this', 'N5', 'pre-noun');
d('それ', 'それ', 'that', 'N5', 'pronoun');
d('ううん', 'ううん', 'no (casual)', 'N5', 'interjection');
d('やばい', 'やばい', 'oh no!; dangerous; awesome (slang)', 'N3', 'adjective');

// N5 vocabulary
d('おはよう', 'おはよう', 'good morning', 'N5', 'expression');
d('遅刻', 'ちこく', 'being late', 'N4', 'noun');
d('走れ', 'はしれ', 'run! (command of 走る)', 'N5', 'verb', '走る');
d('急げ', 'いそげ', 'hurry! (command of 急ぐ)', 'N4', 'verb', '急ぐ');
d('待って', 'まって', 'wait (て-form of 待つ)', 'N5', 'verb', '待つ');
d('パン', 'ぱん', 'bread', 'N5', 'noun');
d('食べて', 'たべて', 'eating (て-form of 食べる)', 'N5', 'verb', '食べる');
d('いらっしゃいませ', 'いらっしゃいませ', 'welcome (to a shop)', 'N5', 'expression');
d('コーヒー', 'こーひー', 'coffee', 'N5', 'noun');
d('ください', 'ください', 'please (give me)', 'N5', 'expression');
d('ホット', 'ほっと', 'hot (drink)', 'N5', 'noun');
d('アイス', 'あいす', 'iced; ice cream', 'N5', 'noun');
d('お願いします', 'おねがいします', 'please', 'N5', 'expression');
d('はじめまして', 'はじめまして', 'nice to meet you', 'N5', 'expression');
d('ユキ', 'ゆき', 'Yuki (name)', 'N5', 'name');
d('東京', 'とうきょう', 'Tokyo', 'N5', 'noun');
d('住んで', 'すんで', 'living (て-form of 住む)', 'N5', 'verb', '住む');
d('趣味', 'しゅみ', 'hobby', 'N4', 'noun');
d('映画', 'えいが', 'movie', 'N5', 'noun');
d('よろしく', 'よろしく', 'please treat me well; nice to meet you', 'N5', 'expression');
d('雨', 'あめ', 'rain', 'N5', 'noun');
d('傘', 'かさ', 'umbrella', 'N5', 'noun');
d('持って', 'もって', 'holding; having (て-form of 持つ)', 'N5', 'verb', '持つ');
d('一緒に', 'いっしょに', 'together', 'N5', 'adverb');
d('帰ろう', 'かえろう', "let's go home (volitional of 帰る)", 'N5', 'verb', '帰る');

// N4
d('助けて', 'たすけて', 'help; save (て-form of 助ける)', 'N4', 'verb', '助ける');
d('友達', 'ともだち', 'friend', 'N5', 'noun');
d('危ない', 'あぶない', 'dangerous', 'N5', 'adjective');
d('大丈夫', 'だいじょうぶ', 'okay; all right', 'N4', 'na-adjective');
d('一人', 'ひとり', 'one person; alone', 'N5', 'noun');
d('宿題', 'しゅくだい', 'homework', 'N5', 'noun');
d('忘れました', 'わすれました', 'forgot (polite past of 忘れる)', 'N5', 'verb', '忘れる');
d('すみません', 'すみません', "sorry; excuse me", 'N5', 'expression');
d('明日', 'あした', 'tomorrow', 'N5', 'noun');
d('必ず', 'かならず', 'definitely; without fail', 'N4', 'adverb');
d('きます', 'きます', 'come (polite; 持ってきます = bring)', 'N5', 'verb', '来る');
d('週末', 'しゅうまつ', 'weekend', 'N4', 'noun');
d('何', 'なに', 'what', 'N5', 'pronoun');
d('山', 'やま', 'mountain', 'N5', 'noun');
d('登りました', 'のぼりました', 'climbed (polite past of 登る)', 'N4', 'verb', '登る');
d('景色', 'けしき', 'scenery; view', 'N4', 'noun');
d('きれい', 'きれい', 'beautiful; clean', 'N5', 'na-adjective');

// N3
d('約束', 'やくそく', 'promise', 'N4', 'noun');
d('守れなくて', 'まもれなくて', "couldn't keep (and...)", 'N3', 'verb', '守る');
d('ごめん', 'ごめん', 'sorry (casual)', 'N5', 'expression');
d('いい', 'いい', 'good; fine', 'N5', 'adjective');
d('気に', 'きに', '(気にする) to worry about, mind', 'N3', 'expression');
d('次', 'つぎ', 'next', 'N5', 'noun');
d('絶対', 'ぜったい', 'absolutely', 'N3', 'adverb');
d('遅れない', 'おくれない', "won't be late (negative of 遅れる)", 'N4', 'verb', '遅れる');
d('諦める', 'あきらめる', 'to give up', 'N3', 'verb');
d('終わって', 'おわって', 'ended; finished (て-form of 終わる)', 'N5', 'verb', '終わる');
d('限界', 'げんかい', 'limit', 'N2', 'noun');
d('…', '…', '(pause)', 'N5', 'symbol');
d('お前', 'おまえ', 'you (rough, casual)', 'N3', 'pronoun');
d('できる', 'できる', 'can do; be able to', 'N5', 'verb');
d('信じて', 'しんじて', 'believing (て-form of 信じる)', 'N3', 'verb', '信じる');
d('来月', 'らいげつ', 'next month', 'N5', 'noun');
d('大阪', 'おおさか', 'Osaka', 'N5', 'noun');
d('引っ越す', 'ひっこす', 'to move (house)', 'N4', 'verb');
d('急', 'きゅう', 'sudden', 'N4', 'na-adjective');
d('寂しく', 'さびしく', 'lonely (adverbial of 寂しい)', 'N4', 'adjective', '寂しい');
d('連絡', 'れんらく', 'contact; getting in touch', 'N4', 'noun');
d('心配', 'しんぱい', 'worry', 'N4', 'noun');

// N2
d('最近', 'さいきん', 'recently; lately', 'N4', 'noun');
d('仕事', 'しごと', 'work; job', 'N5', 'noun');
d('追われて', 'おわれて', 'being chased; swamped (passive of 追う)', 'N2', 'verb', '追う');
d('休めない', 'やすめない', "can't rest (potential negative of 休む)", 'N4', 'verb', '休む');
d('大変', 'たいへん', 'tough; terrible; very', 'N4', 'na-adjective');
d('思い切って', 'おもいきって', 'boldly; taking the plunge', 'N2', 'adverb');
d('休暇', 'きゅうか', 'vacation; leave', 'N2', 'noun');
d('取る', 'とる', 'to take', 'N5', 'verb');
d('条件', 'じょうけん', 'conditions; terms', 'N3', 'noun');
d('契約', 'けいやく', 'contract', 'N2', 'noun');
d('価格', 'かかく', 'price', 'N2', 'noun');
d('見直す', 'みなおす', 'to review; reconsider', 'N2', 'verb');
d('前向き', 'まえむき', 'positive; forward-looking', 'N2', 'na-adjective');
d('検討', 'けんとう', 'consideration; examination', 'N2', 'noun');
d('負ける', 'まける', 'to lose', 'N4', 'verb');
d('口先', 'くちさき', 'lip service; just words', 'N1', 'noun');
d('証明', 'しょうめい', 'proof', 'N3', 'noun');

// N1
d('犯人', 'はんにん', 'culprit; criminal', 'N3', 'noun');
d('中', 'なか', 'inside; among', 'N5', 'noun');
d('根拠', 'こんきょ', 'grounds; evidence', 'N2', 'noun');
d('疑う', 'うたがう', 'to doubt; suspect', 'N3', 'verb');
d('早計', 'そうけい', 'premature; hasty', 'N1', 'na-adjective');
d('既に', 'すでに', 'already', 'N2', 'adverb');
d('揃って', 'そろって', 'gathered; complete (て-form of 揃う)', 'N2', 'verb', '揃う');
d('少子', 'しょうし', 'declining birthrate', 'N1', 'noun');
d('高齢化', 'こうれいか', 'aging (of population)', 'N1', 'noun');
d('労働力', 'ろうどうりょく', 'labor force', 'N1', 'noun');
d('不足', 'ふそく', 'shortage', 'N2', 'noun');
d('懸念', 'けねん', 'concern; worry', 'N1', 'noun');
d('抜本的', 'ばっぽんてき', 'drastic; fundamental', 'N1', 'na-adjective');
d('対策', 'たいさく', 'countermeasure', 'N2', 'noun');
d('求められて', 'もとめられて', 'being demanded (passive of 求める)', 'N2', 'verb', '求める');
d('彼', 'かれ', 'he; him', 'N5', 'pronoun');
d('辞任', 'じにん', 'resignation', 'N1', 'noun');
d('避けられない', 'さけられない', 'unavoidable', 'N2', 'verb', '避ける');
d('事態', 'じたい', 'situation; state of affairs', 'N1', 'noun');
d('あまりにも', 'あまりにも', 'far too; excessively', 'N2', 'adverb');
d('唐突', 'とうとつ', 'abrupt; sudden', 'N1', 'na-adjective');

export const DICTIONARY: Record<string, Entry> = Object.fromEntries(entries.map((e) => [e.surface, e]));
export const ALL_ENTRIES = entries;

export function lookup(surface: string): Entry | undefined {
  return DICTIONARY[surface];
}

export function hasKanji(s: string): boolean {
  return /[一-龯㐀-䶿]/.test(s);
}

export function isPunctuation(s: string): boolean {
  return /^[、。！？!?「」…・\s]+$/.test(s) && s !== '…';
}
