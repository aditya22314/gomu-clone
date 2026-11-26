import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, Ellipse, G, Line, LinearGradient, Path, Polygon, Rect, Stop } from 'react-native-svg';

// Original illustrations for scenes, drawn in code: a backdrop plus "chibi" characters
// whose mouths move while their line is being spoken.

export type Backdrop =
  | 'street-morning' | 'cafe' | 'studio-dusk' | 'rain-station' | 'forest' | 'classroom' | 'mountain'
  | 'city-dusk' | 'dojo' | 'platform' | 'office' | 'meeting' | 'rooftop-night' | 'mansion' | 'skyline' | 'newsroom';

export type HairStyle = 'short' | 'bob' | 'long' | 'ponytail' | 'spiky' | 'bun' | 'neat';

export type CastMember = {
  name: string;
  hair: HairStyle;
  hairColor: string;
  shirt: string;
  skin?: string;
  fox?: boolean;
  glasses?: boolean;
};

const SKY: Record<Backdrop, [string, string]> = {
  'street-morning': ['#9ED8FF', '#FFE2C6'],
  cafe: ['#F6D7B0', '#E8B98A'],
  'studio-dusk': ['#4B3B8F', '#FF9E7A'],
  'rain-station': ['#1C2A4A', '#3A4F78'],
  forest: ['#8FD3A6', '#E9F7D8'],
  classroom: ['#E9F2E4', '#F6F1E1'],
  mountain: ['#7CC6FF', '#DDF3FF'],
  'city-dusk': ['#FF9FB2', '#FFD59E'],
  dojo: ['#F2E2C4', '#E3C99A'],
  platform: ['#BFE6FF', '#F4FAFF'],
  office: ['#DCE6F0', '#F3F6FA'],
  meeting: ['#E6E1F5', '#F7F5FC'],
  'rooftop-night': ['#0E1433', '#2B2F6B'],
  mansion: ['#2A1E2E', '#4A3346'],
  skyline: ['#B6E3E0', '#F1FBF9'],
  newsroom: ['#2D3A55', '#47577A'],
};

function Houses() {
  return (
    <G>
      {[0, 1, 2, 3].map((i) => {
        const x = i * 105 - 10;
        const h = 90 + (i % 2) * 25;
        const wall = ['#FFF3E6', '#F1E3FF', '#E6F6FF', '#FFE9E9'][i];
        const roof = ['#C0504D', '#4F6D9A', '#6B8E4E', '#8A5A44'][i];
        return (
          <G key={i}>
            <Rect x={x} y={230 - h} width={90} height={h} fill={wall} />
            <Polygon points={`${x - 8},${230 - h} ${x + 45},${195 - h} ${x + 98},${230 - h}`} fill={roof} />
            <Rect x={x + 14} y={250 - h} width={22} height={20} fill="#9CC9E8" />
            <Rect x={x + 54} y={250 - h} width={22} height={20} fill="#9CC9E8" />
          </G>
        );
      })}
      <Line x1={0} y1={95} x2={400} y2={110} stroke="#40404A" strokeWidth={1.5} />
      <Line x1={0} y1={102} x2={400} y2={118} stroke="#40404A" strokeWidth={1.5} />
      <Rect x={300} y={80} width={6} height={150} fill="#5A5A66" />
      <Rect x={0} y={230} width={400} height={70} fill="#9A9AA6" />
      <Rect x={0} y={262} width={400} height={4} fill="#F5F5F5" />
    </G>
  );
}

function Skyline({ lit, color }: { lit: string; color: string }) {
  const b = [
    [0, 140, 55], [50, 110, 40], [88, 160, 60], [145, 90, 45], [186, 130, 50], [232, 70, 38], [266, 120, 56], [318, 150, 42], [356, 105, 50],
  ];
  return (
    <G>
      {b.map(([x, h, w], i) => (
        <G key={i}>
          <Rect x={x} y={230 - h} width={w} height={h} fill={color} />
          {Array.from({ length: Math.floor(h / 22) }).map((_, r) =>
            [0, 1].map((c) => (
              <Rect key={`${r}-${c}`} x={x + 8 + c * (w / 2 - 4)} y={238 - h + r * 22} width={8} height={9} fill={(r + c + i) % 3 === 0 ? lit : 'rgba(255,255,255,0.08)'} />
            )),
          )}
        </G>
      ))}
    </G>
  );
}

function BackdropArt({ kind }: { kind: Backdrop }) {
  switch (kind) {
    case 'street-morning':
      return (
        <G>
          <Circle cx={330} cy={60} r={30} fill="#FFF4B8" />
          <Houses />
          <Ellipse cx={80} cy={60} rx={40} ry={12} fill="#FFFFFF" opacity={0.8} />
        </G>
      );
    case 'cafe':
      return (
        <G>
          <Rect x={30} y={30} width={140} height={110} rx={8} fill="#CFEFFF" stroke="#8A5A44" strokeWidth={6} />
          <Line x1={100} y1={30} x2={100} y2={140} stroke="#8A5A44" strokeWidth={4} />
          <Circle cx={60} cy={125} r={18} fill="#6BAA5B" />
          <Rect x={230} y={30} width={130} height={80} rx={6} fill="#2F3B2F" />
          {[0, 1, 2, 3].map((i) => <Rect key={i} x={245} y={45 + i * 16} width={70 - i * 8} height={5} rx={2} fill="#E8E2C8" />)}
          <Rect x={0} y={190} width={400} height={110} fill="#8A5A44" />
          <Rect x={0} y={185} width={400} height={10} fill="#B07A57" />
          {[60, 120, 300].map((x) => (
            <G key={x}>
              <Rect x={x} y={160} width={26} height={26} rx={4} fill="#FFFFFF" />
              <Path d={`M ${x + 26} 166 q 10 6 0 12`} stroke="#FFFFFF" strokeWidth={4} fill="none" />
            </G>
          ))}
        </G>
      );
    case 'studio-dusk':
      return (
        <G>
          <Skyline lit="#FFD27A" color="#2C2457" />
          <Polygon points="200,60 186,160 214,160" fill="#E2483D" />
          <Rect x={193} y={100} width={14} height={4} fill="#FFFFFF" />
          <Rect x={0} y={200} width={400} height={100} fill="#3A2C5E" />
          <Rect x={150} y={190} width={100} height={10} rx={4} fill="#1E1838" />
        </G>
      );
    case 'rain-station':
      return (
        <G>
          <Rect x={40} y={90} width={320} height={140} fill="#2A3A5E" />
          <Rect x={40} y={80} width={320} height={16} fill="#E35D4F" />
          {[0, 1, 2, 3, 4, 5].map((i) => <Rect key={i} x={58 + i * 50} y={115} width={34} height={44} fill="#FFD98A" opacity={0.85} />)}
          <Rect x={0} y={230} width={400} height={70} fill="#1A2440" />
          {[0, 1, 2, 3, 4].map((i) => <Rect key={i} x={30 + i * 80} y={250} width={50} height={4} fill="#FFD98A" opacity={0.35} />)}
        </G>
      );
    case 'forest':
      return (
        <G>
          <Path d="M0 170 Q 100 120 200 160 T 400 150 V300 H0 Z" fill="#5FAF7A" />
          <Path d="M0 210 Q 120 170 240 200 T 400 195 V300 H0 Z" fill="#3E8E5E" />
          {[30, 90, 300, 360].map((x, i) => (
            <G key={x}>
              <Polygon points={`${x},${90 + i * 8} ${x - 30},${190} ${x + 30},${190}`} fill="#2D6B47" />
              <Rect x={x - 5} y={190} width={10} height={24} fill="#6B4A32" />
            </G>
          ))}
          {[[150, 90], [250, 70], [200, 120], [320, 110]].map(([x, y], i) => <Circle key={i} cx={x} cy={y} r={3} fill="#FFF7B0" />)}
        </G>
      );
    case 'classroom':
      return (
        <G>
          <Rect x={60} y={40} width={280} height={110} rx={6} fill="#2F5D4A" stroke="#8A6A4A" strokeWidth={8} />
          <Path d="M 90 80 q 30 -20 60 0 t 60 0" stroke="#E8F0E0" strokeWidth={3} fill="none" />
          <Rect x={240} y={110} width={60} height={4} fill="#E8F0E0" />
          <Rect x={0} y={210} width={400} height={90} fill="#C9A77E" />
          {[40, 170, 300].map((x) => <Rect key={x} x={x} y={200} width={70} height={12} rx={3} fill="#9C7A55" />)}
        </G>
      );
    case 'mountain':
      return (
        <G>
          <Circle cx={80} cy={60} r={24} fill="#FFF3B0" />
          <Polygon points="0,230 110,90 220,230" fill="#6C8FB3" />
          <Polygon points="90,115 110,90 130,115 110,108" fill="#FFFFFF" />
          <Polygon points="150,230 290,70 400,230" fill="#557AA0" />
          <Polygon points="265,100 290,70 315,100 290,92" fill="#FFFFFF" />
          <Path d="M0 220 Q 200 190 400 220 V300 H0 Z" fill="#7BBF6A" />
          <Ellipse cx={300} cy={50} rx={36} ry={10} fill="#FFFFFF" opacity={0.85} />
        </G>
      );
    case 'city-dusk':
      return (
        <G>
          <Circle cx={320} cy={110} r={34} fill="#FFB36B" opacity={0.9} />
          <Skyline lit="#FFE7A0" color="#6B4E7A" />
          <Rect x={0} y={230} width={400} height={70} fill="#4A3A5A" />
        </G>
      );
    case 'dojo':
      return (
        <G>
          {[0, 1, 2, 3, 4].map((i) => (
            <G key={i}>
              <Rect x={i * 80} y={30} width={76} height={170} fill="#FBF4E4" stroke="#8A6A4A" strokeWidth={4} />
              <Line x1={i * 80 + 38} y1={30} x2={i * 80 + 38} y2={200} stroke="#D9C9A6" strokeWidth={2} />
              <Line x1={i * 80} y1={115} x2={i * 80 + 76} y2={115} stroke="#D9C9A6" strokeWidth={2} />
            </G>
          ))}
          <Rect x={170} y={40} width={60} height={120} fill="#FFFFFF" stroke="#2A2A2A" strokeWidth={2} />
          <Circle cx={200} cy={80} r={16} fill="#D93838" />
          <Rect x={0} y={200} width={400} height={100} fill="#C99A5B" />
          {[0, 1, 2, 3, 4, 5].map((i) => <Line key={i} x1={i * 70} y1={200} x2={i * 70 - 40} y2={300} stroke="#B3854A" strokeWidth={2} />)}
        </G>
      );
    case 'platform':
      return (
        <G>
          <Rect x={0} y={40} width={400} height={14} fill="#5A6B7A" />
          <Path d="M -20 120 H 330 Q 400 120 410 170 V 200 H -20 Z" fill="#FFFFFF" />
          <Rect x={-20} y={150} width={430} height={10} fill="#2B5DB8" />
          {[0, 1, 2, 3, 4, 5].map((i) => <Rect key={i} x={10 + i * 52} y={130} width={36} height={14} rx={4} fill="#9CC9E8" />)}
          <Rect x={0} y={200} width={400} height={100} fill="#B8BEC6" />
          <Rect x={0} y={205} width={400} height={8} fill="#F2C744" />
        </G>
      );
    case 'office':
      return (
        <G>
          <Rect x={30} y={30} width={150} height={120} fill="#CFE3F5" />
          <Skyline lit="#FFFFFF" color="#9DB2C8" />
          <Rect x={0} y={150} width={400} height={150} fill="#E9EEF3" />
          <Rect x={0} y={205} width={400} height={95} fill="#7B8794" />
          <Rect x={220} y={140} width={110} height={70} rx={6} fill="#2A2F36" />
          <Rect x={228} y={148} width={94} height={52} fill="#5FA8D3" />
          {[0, 1, 2].map((i) => <Rect key={i} x={40 + i * 14} y={186 - i * 6} width={60} height={8} fill={['#FFFFFF', '#F7E6A8', '#FFFFFF'][i]} />)}
        </G>
      );
    case 'meeting':
      return (
        <G>
          <Rect x={40} y={30} width={320} height={110} fill="#D7E9F7" />
          {[0, 1, 2, 3].map((i) => <Line key={i} x1={40 + i * 107} y1={30} x2={40 + i * 107} y2={140} stroke="#FFFFFF" strokeWidth={6} />)}
          <Rect x={0} y={140} width={400} height={160} fill="#EDEAF5" />
          <Ellipse cx={200} cy={250} rx={190} ry={40} fill="#6E5A8A" />
          {[110, 200, 290].map((x) => <Rect key={x} x={x - 18} y={232} width={36} height={24} fill="#FFFFFF" rx={2} />)}
        </G>
      );
    case 'rooftop-night':
      return (
        <G>
          <Circle cx={310} cy={60} r={26} fill="#FFF6C8" />
          {[[40, 40], [120, 70], [200, 30], [260, 100], [360, 130], [80, 120]].map(([x, y], i) => <Circle key={i} cx={x} cy={y} r={1.8} fill="#FFFFFF" />)}
          <Skyline lit="#FFD27A" color="#151A3D" />
          <Rect x={0} y={215} width={400} height={85} fill="#3B3F5C" />
          {Array.from({ length: 21 }).map((_, i) => <Rect key={i} x={i * 20} y={185} width={3} height={32} fill="#8B90B0" />)}
          <Rect x={0} y={185} width={400} height={4} fill="#8B90B0" />
        </G>
      );
    case 'mansion':
      return (
        <G>
          <Rect x={0} y={0} width={400} height={210} fill="#3B2735" />
          {[60, 340].map((x) => <Rect key={x} x={x - 35} y={40} width={70} height={130} rx={35} fill="#1E2A4A" stroke="#8A6A3A" strokeWidth={5} />)}
          <Line x1={200} y1={0} x2={200} y2={50} stroke="#C9A85A" strokeWidth={2} />
          <Path d="M 160 60 Q 200 90 240 60" stroke="#C9A85A" strokeWidth={4} fill="none" />
          {[165, 200, 235].map((x) => <Circle key={x} cx={x} cy={58} r={5} fill="#FFE08A" />)}
          <Rect x={0} y={210} width={400} height={90} fill="#5A2E2E" />
          <Rect x={100} y={210} width={200} height={90} fill="#7A3A3A" />
        </G>
      );
    case 'skyline':
      return (
        <G>
          <Skyline lit="#FFFFFF" color="#5E8C8A" />
          <Path d="M 20 200 L 100 170 L 170 180 L 250 130 L 330 110 L 380 70" stroke="#E2483D" strokeWidth={5} fill="none" />
          <Circle cx={380} cy={70} r={7} fill="#E2483D" />
          <Rect x={0} y={230} width={400} height={70} fill="#3E6664" />
        </G>
      );
    case 'newsroom':
      return (
        <G>
          {[0, 1, 2].map((i) => (
            <G key={i}>
              <Rect x={30 + i * 120} y={40} width={100} height={64} rx={4} fill="#0F1626" />
              <Rect x={38 + i * 120} y={48} width={84} height={48} fill={['#3D6FB6', '#B6473D', '#3D9A6F'][i]} />
            </G>
          ))}
          <Rect x={0} y={200} width={400} height={100} fill="#1C2438" />
          <Rect x={60} y={190} width={280} height={30} rx={6} fill="#C9CED8" />
        </G>
      );
  }
}

function Hair({ style, color }: { style: HairStyle; color: string }) {
  switch (style) {
    case 'short':
      return <Path d="M -34 -6 Q -36 -44 0 -46 Q 36 -44 34 -6 Q 22 -26 0 -28 Q -22 -26 -34 -6 Z" fill={color} />;
    case 'bob':
      return <Path d="M -38 18 Q -44 -46 0 -46 Q 44 -46 38 18 L 28 18 Q 30 -18 0 -24 Q -30 -18 -28 18 Z" fill={color} />;
    case 'long':
      return <Path d="M -38 60 Q -48 -46 0 -46 Q 48 -46 38 60 L 26 60 Q 30 -16 0 -24 Q -30 -16 -26 60 Z" fill={color} />;
    case 'ponytail':
      return (
        <G>
          <Path d="M 30 -30 Q 62 -20 50 30 Q 44 0 30 -12 Z" fill={color} />
          <Path d="M -34 -4 Q -38 -46 0 -46 Q 38 -46 34 -4 Q 20 -28 0 -26 Q -20 -28 -34 -4 Z" fill={color} />
        </G>
      );
    case 'spiky':
      return <Path d="M -36 -4 L -40 -30 L -22 -36 L -18 -54 L 0 -40 L 14 -56 L 20 -38 L 40 -40 L 36 -4 Q 20 -24 0 -26 Q -20 -24 -36 -4 Z" fill={color} />;
    case 'bun':
      return (
        <G>
          <Circle cx={0} cy={-50} r={14} fill={color} />
          <Path d="M -34 -4 Q -36 -44 0 -44 Q 36 -44 34 -4 Q 20 -26 0 -24 Q -20 -26 -34 -4 Z" fill={color} />
        </G>
      );
    case 'neat':
      return <Path d="M -34 -8 Q -34 -44 0 -44 Q 34 -44 34 -8 Q 30 -30 -6 -30 Q -26 -28 -34 -8 Z" fill={color} />;
  }
}

function Character({ c, talking, flip }: { c: CastMember; talking: boolean; flip: boolean }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!talking) {
      setOpen(false);
      return;
    }
    const t = setInterval(() => setOpen((o) => !o), 170);
    return () => clearInterval(t);
  }, [talking]);

  const skin = c.fox ? '#F28C38' : c.skin ?? '#FFE0C7';
  return (
    <Svg width={140} height={170} viewBox="-70 -80 140 170">
      <G transform={flip ? 'scale(-1,1)' : undefined}>
        {/* body */}
        <Path d="M -44 90 Q -44 46 0 44 Q 44 46 44 90 Z" fill={c.shirt} />
        <Path d="M -10 44 L 0 58 L 10 44 Z" fill="#FFFFFF" opacity={0.9} />
        {/* head */}
        {c.fox && (
          <G>
            <Polygon points="-34,-20 -26,-62 -6,-34" fill="#F28C38" />
            <Polygon points="34,-20 26,-62 6,-34" fill="#F28C38" />
            <Polygon points="-28,-26 -24,-50 -12,-34" fill="#FFF1E0" />
            <Polygon points="28,-26 24,-50 12,-34" fill="#FFF1E0" />
          </G>
        )}
        <Ellipse cx={0} cy={0} rx={36} ry={40} fill={skin} />
        {c.fox && <Path d="M -26 12 Q 0 40 26 12 Q 0 24 -26 12 Z" fill="#FFF1E0" />}
        {!c.fox && <Hair style={c.hair} color={c.hairColor} />}
        {/* eyes */}
        <Ellipse cx={-13} cy={2} rx={5} ry={7} fill="#2A2238" />
        <Ellipse cx={13} cy={2} rx={5} ry={7} fill="#2A2238" />
        <Circle cx={-11} cy={-1} r={1.8} fill="#FFFFFF" />
        <Circle cx={15} cy={-1} r={1.8} fill="#FFFFFF" />
        {c.glasses && (
          <G stroke="#2A2238" strokeWidth={2} fill="none">
            <Circle cx={-13} cy={2} r={10} />
            <Circle cx={13} cy={2} r={10} />
            <Line x1={-3} y1={2} x2={3} y2={2} />
          </G>
        )}
        <Ellipse cx={-22} cy={14} rx={6} ry={3} fill="#FF9AA2" opacity={0.6} />
        <Ellipse cx={22} cy={14} rx={6} ry={3} fill="#FF9AA2" opacity={0.6} />
        {c.fox && <Circle cx={0} cy={14} r={3.5} fill="#2A2238" />}
        {open ? <Ellipse cx={0} cy={22} rx={6} ry={5} fill="#8A2E3B" /> : <Path d="M -6 21 Q 0 25 6 21" stroke="#8A2E3B" strokeWidth={2.4} fill="none" strokeLinecap="round" />}
      </G>
    </Svg>
  );
}

function Rain() {
  const y = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.timing(y, { toValue: 1, duration: 700, easing: Easing.linear, useNativeDriver: true }));
    loop.start();
    return () => loop.stop();
  }, []);
  const drops = Array.from({ length: 40 }, (_, i) => [(i * 37) % 400, (i * 53) % 300]);
  return (
    <Animated.View
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, { transform: [{ translateY: y.interpolate({ inputRange: [0, 1], outputRange: [-40, 0] }) }] }]}
    >
      <Svg width="100%" height="120%" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
        {drops.map(([x, yy], i) => <Line key={i} x1={x} y1={yy} x2={x - 4} y2={yy + 14} stroke="#BFD7FF" strokeWidth={1.4} opacity={0.6} />)}
      </Svg>
    </Animated.View>
  );
}

export default function SceneArt({
  backdrop,
  cast,
  speaker,
  talking,
  rain,
}: {
  backdrop: Backdrop;
  cast: CastMember[];
  speaker?: string;
  talking: boolean;
  rain?: boolean;
}) {
  const [top, bottom] = SKY[backdrop];
  const id = `sky-${backdrop}`;
  return (
    <View style={styles.wrap}>
      <Svg width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={top} />
            <Stop offset="1" stopColor={bottom} />
          </LinearGradient>
        </Defs>
        <Rect x={0} y={0} width={400} height={300} fill={`url(#${id})`} />
        <BackdropArt kind={backdrop} />
      </Svg>
      {rain && <Rain />}
      <View style={styles.castRow} pointerEvents="none">
        {cast.map((c, i) => {
          const isSpeaker = c.name === speaker;
          return (
            <View key={c.name} style={[styles.actor, { opacity: speaker && !isSpeaker && cast.length > 1 ? 0.8 : 1, transform: [{ scale: isSpeaker ? 1.06 : 1 }] }]}>
              <Character c={c} talking={talking && isSpeaker} flip={cast.length > 1 && i === cast.length - 1} />
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, overflow: 'hidden', borderRadius: 20 },
  castRow: { position: 'absolute', left: 0, right: 0, bottom: -6, flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', gap: 18 },
  actor: {},
});
