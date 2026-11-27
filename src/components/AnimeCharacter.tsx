import React, { useEffect, useId, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { Circle, Defs, Ellipse, G, Line, LinearGradient, Path, Stop } from 'react-native-svg';

// Original anime-style character busts, drawn in code. Large glossy eyes, layered hair with
// cel shading and a shine band, blinking, breathing and simple lip-sync while talking.

export type HairStyle = 'short' | 'bob' | 'long' | 'ponytail' | 'spiky' | 'bun' | 'neat';

export type CastMember = {
  name: string;
  hair: HairStyle;
  hairColor: string;
  shirt: string;
  skin?: string;
  eyes?: string;
  fox?: boolean;
  glasses?: boolean;
};

// --- colour helpers -------------------------------------------------------

function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map((x) => x + x).join('');
  const n = Number.parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function mix(hex: string, target: string, amount: number): string {
  const a = hexToRgb(hex);
  const b = hexToRgb(target);
  const c = a.map((v, i) => Math.round(v + (b[i] - v) * amount));
  return `#${c.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

const lighten = (hex: string, amt: number) => mix(hex, '#ffffff', amt);
const darken = (hex: string, amt: number) => mix(hex, '#000000', amt);

const EYE_COLORS = ['#3E6FD8', '#7A4FD0', '#2E9C8A', '#B5523B', '#C2386B', '#4F8A2E', '#8A5A2E'];
function eyeColorFor(name: string) {
  let h = 0;
  for (const ch of name) h = (h * 31 + (ch.codePointAt(0) ?? 0)) % 997;
  return EYE_COLORS[h % EYE_COLORS.length];
}

// Dark hair reads as a flat blob, so lift it a little toward blue-grey for shading to show.
function hairBase(hex: string) {
  const [r, g, b] = hexToRgb(hex);
  return r + g + b < 120 ? mix(hex, '#2A3570', 0.3) : hex;
}

const FEMININE: HairStyle[] = ['bob', 'long', 'ponytail', 'bun'];

// --- hair shapes ----------------------------------------------------------
// Head is centred on (0, 0): forehead about y = -40, eyes at y = 6, chin at y = 46.

// A fringe made of pointed locks. tips/valleys alternate along the lower edge, left to right.
function fringe(edge: [number, number][], top = -66, width = 47): string {
  const first = edge[0];
  const last = edge[edge.length - 1];
  let d = `M ${first[0]} ${first[1]} C ${-width - 6} -24 ${-width + 4} ${top} 0 ${top} C ${width - 4} ${top} ${width + 6} -24 ${last[0]} ${last[1]}`;
  // walk back along the lower edge with nearly straight strokes, so each lock ends in a sharp tip
  for (let i = edge.length - 2; i >= 0; i--) {
    const [x, y] = edge[i];
    const [px, py] = edge[i + 1];
    const lower = y > py ? [x, y] : [px, py];
    const cx = (x + px) / 2 + (lower[0] - (x + px) / 2) * 0.35;
    const cy = (y + py) / 2 - 2;
    d += ` Q ${cx} ${cy} ${x} ${y}`;
  }
  return `${d} Z`;
}

const FRINGES: Record<HairStyle, [number, number][]> = {
  short: [[-46, 18], [-40, -10], [-34, 10], [-26, -26], [-17, 2], [-8, -30], [2, 0], [10, -28], [19, 4], [27, -24], [35, 8], [40, -8], [46, 18]],
  spiky: [[-48, 22], [-42, -8], [-36, 14], [-28, -24], [-19, 6], [-10, -30], [0, 4], [9, -30], [18, 2], [27, -22], [36, 12], [42, -6], [48, 22]],
  neat: [[-46, 10], [-40, -16], [-30, -6], [-22, -32], [-8, -20], [4, -34], [16, -12], [24, -26], [33, 0], [40, -14], [46, 10]],
  bob: [[-48, 36], [-42, 0], [-36, 6], [-28, -24], [-19, 0], [-10, -28], [-1, -2], [8, -28], [17, 0], [26, -24], [35, 6], [42, 0], [48, 36]],
  long: [[-48, 40], [-42, 0], [-36, 8], [-28, -24], [-19, -2], [-10, -28], [-1, 0], [8, -28], [17, -2], [26, -24], [35, 8], [42, 0], [48, 40]],
  ponytail: [[-46, 26], [-40, -6], [-34, 6], [-26, -24], [-17, 0], [-8, -28], [1, -2], [10, -28], [19, 0], [28, -22], [36, 6], [41, -6], [46, 26]],
  bun: [[-46, 24], [-40, -6], [-34, 6], [-26, -24], [-17, -2], [-8, -28], [1, -4], [10, -28], [19, -2], [28, -22], [36, 4], [41, -6], [46, 24]],
};

function BackHair({ style, fill }: { style: HairStyle; fill: string }) {
  switch (style) {
    case 'long':
      return <Path d="M -46 -10 C -56 40 -60 100 -52 140 L 52 140 C 60 100 56 40 46 -10 Z" fill={fill} />;
    case 'bob':
      return <Path d="M -48 -6 C -54 24 -50 44 -40 52 L 40 52 C 50 44 54 24 48 -6 Z" fill={fill} />;
    case 'ponytail':
      return <Path d="M 30 -44 C 74 -46 80 10 64 64 C 60 30 52 4 34 -10 Z" fill={fill} />;
    case 'bun':
      return <Circle cx={0} cy={-62} r={17} fill={fill} />;
    default:
      return null;
  }
}

function SpikesOnTop({ fill }: { fill: string }) {
  return <Path d="M -36 -40 L -44 -64 L -22 -56 L -18 -80 L -2 -60 L 10 -82 L 16 -58 L 38 -70 L 36 -42 Z" fill={fill} />;
}

// --- eyes -----------------------------------------------------------------

function Eye({ x, color, closed, feminine, gid, flipLash }: { x: number; color: string; closed: boolean; feminine: boolean; gid: string; flipLash: boolean }) {
  const s = flipLash ? -1 : 1; // outer corner on the outside of the face
  if (closed) {
    return (
      <G transform={`translate(${x} 8) scale(${s} 1)`}>
        <Path d="M -10 0 Q 0 6 11 0" stroke="#2A1E2E" strokeWidth={2.6} fill="none" strokeLinecap="round" />
        {feminine && <Path d="M 11 0 L 15 -3" stroke="#2A1E2E" strokeWidth={2} strokeLinecap="round" />}
      </G>
    );
  }
  return (
    <G transform={`translate(${x} 6) scale(${s} 1)`}>
      {/* white */}
      <Path d="M -10 -6 Q 0 -12 11 -6 L 11 8 Q 0 14 -10 8 Z" fill="#FFFFFF" />
      {/* iris and pupil */}
      <Ellipse cx={1} cy={1} rx={7.2} ry={10} fill={`url(#${gid}-iris)`} />
      <Ellipse cx={1} cy={2} rx={3.6} ry={5.4} fill={darken(color, 0.65)} />
      <Ellipse cx={1} cy={-4} rx={7} ry={3.5} fill={darken(color, 0.5)} opacity={0.55} />
      {/* highlights */}
      <Ellipse cx={-2.5} cy={-3.5} rx={2.8} ry={3.4} fill="#FFFFFF" />
      <Circle cx={4} cy={6} r={1.4} fill="#FFFFFF" opacity={0.9} />
      {/* upper lash line with outer flick */}
      <Path
        d={feminine ? 'M -12 -5 Q 0 -14 13 -7 L 17 -10 L 14 -4 Q 0 -10 -12 -3 Z' : 'M -12 -5 Q 0 -13 13 -6 L 13 -4 Q 0 -10 -12 -3 Z'}
        fill="#2A1E2E"
      />
      {/* lower lash */}
      <Path d="M 5 11 Q 9 10 11 8" stroke="#2A1E2E" strokeWidth={1.2} fill="none" strokeLinecap="round" opacity={0.8} />
    </G>
  );
}

// --- mouth ----------------------------------------------------------------

function Mouth({ shape }: { shape: number }) {
  if (shape === 0) return <Path d="M -4 31 Q 0 33 4 31" stroke="#7A2E3B" strokeWidth={1.8} fill="none" strokeLinecap="round" />;
  const h = shape === 1 ? 3 : shape === 2 ? 6 : 4.5;
  const w = shape === 3 ? 6.5 : 5;
  return (
    <G>
      <Path d={`M ${-w} 30 Q 0 ${30 + h * 2.2} ${w} 30 Q 0 ${29} ${-w} 30 Z`} fill="#8A2E3B" />
      {shape >= 2 && <Ellipse cx={0} cy={30 + h * 1.2} rx={w * 0.55} ry={h * 0.35} fill="#E8737E" />}
    </G>
  );
}

// --- character --------------------------------------------------------------

export function AnimeCharacter({ c, talking, flip }: Readonly<{ c: CastMember; talking: boolean; flip: boolean }>) {
  const rawId = useId();
  const gid = `ch${rawId.replace(/[^a-zA-Z0-9]/g, '')}`;
  const [mouth, setMouth] = useState(0);
  const [blink, setBlink] = useState(false);
  const breathe = useRef(new Animated.Value(0)).current;

  // lip-sync: cycle through a few mouth shapes while this character speaks
  useEffect(() => {
    if (!talking) {
      setMouth(0);
      return;
    }
    const seq = [2, 1, 3, 0, 2, 3, 1, 2, 0];
    let i = 0;
    const t = setInterval(() => {
      i = (i + 1) % seq.length;
      setMouth(seq[i]);
    }, 110);
    return () => clearInterval(t);
  }, [talking]);

  // blink every few seconds
  useEffect(() => {
    let alive = true;
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timer = setTimeout(() => {
        if (!alive) return;
        setBlink(true);
        timer = setTimeout(() => {
          if (!alive) return;
          setBlink(false);
          schedule();
        }, 130);
      }, 2200 + Math.random() * 2800);
    };
    schedule();
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, []);

  // gentle breathing
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(breathe, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const feminine = FEMININE.includes(c.hair);
  const skin = c.skin ?? '#FFE3D0';
  const skinShade = mix(skin, '#E79A8C', 0.45);
  const hairCol = c.fox ? '#F08A3C' : hairBase(c.hairColor);
  const eye = c.eyes ?? (c.fox ? '#D9A21E' : eyeColorFor(c.name));
  const shirt = c.shirt;

  return (
    <Animated.View style={{ transform: [{ translateY: breathe.interpolate({ inputRange: [0, 1], outputRange: [0, -2] }) }] }}>
      <Svg width={170} height={224} viewBox="-85 -100 170 224">
        <Defs>
          <LinearGradient id={`${gid}-hair`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={lighten(hairCol, 0.18)} />
            <Stop offset="0.55" stopColor={hairCol} />
            <Stop offset="1" stopColor={darken(hairCol, 0.35)} />
          </LinearGradient>
          <LinearGradient id={`${gid}-iris`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={darken(eye, 0.55)} />
            <Stop offset="0.6" stopColor={eye} />
            <Stop offset="1" stopColor={lighten(eye, 0.45)} />
          </LinearGradient>
          <LinearGradient id={`${gid}-shirt`} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={lighten(shirt, 0.12)} />
            <Stop offset="1" stopColor={darken(shirt, 0.22)} />
          </LinearGradient>
        </Defs>
        <G transform={flip ? 'scale(-1,1)' : undefined}>
          <BackHair style={c.hair} fill={`url(#${gid}-hair)`} />
          <Ellipse cx={0} cy={-12} rx={48} ry={50} fill={darken(hairCol, 0.15)} />

          {/* shoulders and uniform-style top */}
          <Path d="M -70 124 C -68 84 -46 72 -16 66 L 16 66 C 46 72 68 84 70 124 Z" fill={`url(#${gid}-shirt)`} />
          <Path d="M -16 66 L 0 92 L 16 66 L 10 64 L 0 78 L -10 64 Z" fill="#FFFFFF" />
          <Path d="M -16 66 L -26 82 L -6 86 L 0 92 Z" fill={lighten(shirt, 0.3)} opacity={0.9} />
          <Path d="M 16 66 L 26 82 L 6 86 L 0 92 Z" fill={lighten(shirt, 0.3)} opacity={0.9} />
          <Path d="M 40 80 C 52 90 58 104 60 124 L 70 124 C 68 98 58 84 40 80 Z" fill={darken(shirt, 0.3)} opacity={0.5} />

          {/* neck with cel shadow under the chin */}
          <Path d="M -11 38 L -11 68 Q 0 74 11 68 L 11 38 Z" fill={skin} />
          <Path d="M -11 44 Q 0 56 11 44 L 11 52 Q 0 60 -11 52 Z" fill={skinShade} />

          {/* ears */}
          {!c.fox && (
            <G>
              <Ellipse cx={-38} cy={10} rx={6} ry={10} fill={skin} />
              <Ellipse cx={38} cy={10} rx={6} ry={10} fill={skin} />
            </G>
          )}

          {/* face: round cheeks, narrow chin */}
          <Path d="M -38 -6 C -40 22 -28 38 -12 46 Q 0 52 12 46 C 28 38 40 22 38 -6 C 36 -40 18 -50 0 -50 C -18 -50 -36 -40 -38 -6 Z" fill={skin} />
          {/* shadow under the fringe */}
          <Path d="M -38 -6 Q -20 4 0 -2 Q 20 4 38 -6 L 38 -18 L -38 -18 Z" fill={skinShade} opacity={0.55} />

          {/* fox ears for the kitsune character */}
          {c.fox && (
            <G>
              <Path d="M -40 -30 L -36 -92 L -6 -50 Z" fill={hairCol} />
              <Path d="M -34 -40 L -32 -78 L -14 -50 Z" fill="#FFF1E0" />
              <Path d="M 40 -30 L 36 -92 L 6 -50 Z" fill={hairCol} />
              <Path d="M 34 -40 L 32 -78 L 14 -50 Z" fill="#FFF1E0" />
            </G>
          )}

          {c.hair === 'spiky' && <SpikesOnTop fill={`url(#${gid}-hair)`} />}

          {/* eyes */}
          <Eye x={-16} color={eye} closed={blink} feminine={feminine} gid={gid} flipLash />
          <Eye x={16} color={eye} closed={blink} feminine={feminine} gid={gid} flipLash={false} />

          {/* nose and blush */}
          <Path d="M 1 18 L -1 21" stroke={skinShade} strokeWidth={1.6} strokeLinecap="round" />
          <Ellipse cx={-23} cy={22} rx={8} ry={3.6} fill="#FF8A9A" opacity={0.35} />
          <Ellipse cx={23} cy={22} rx={8} ry={3.6} fill="#FF8A9A" opacity={0.35} />
          {[-27, -23, -19].map((x) => (
            <Line key={`l${x}`} x1={x} y1={24} x2={x + 2.5} y2={20} stroke="#F2667A" strokeWidth={1} opacity={0.55} />
          ))}
          {[19, 23, 27].map((x) => (
            <Line key={`r${x}`} x1={x} y1={24} x2={x + 2.5} y2={20} stroke="#F2667A" strokeWidth={1} opacity={0.55} />
          ))}

          <Mouth shape={mouth} />

          {c.glasses && (
            <G stroke="#3A3046" strokeWidth={1.8} fill="#FFFFFF" fillOpacity={0.08}>
              <Path d="M -31 -2 H -3 V 16 Q -3 20 -7 20 H -27 Q -31 20 -31 16 Z" />
              <Path d="M 31 -2 H 3 V 16 Q 3 20 7 20 H 27 Q 31 20 31 16 Z" />
              <Line x1={-3} y1={4} x2={3} y2={4} />
            </G>
          )}

          {/* front hair: fringe, then a shine band */}
          <Path d={fringe(FRINGES[c.hair])} fill={`url(#${gid}-hair)`} />
          {/* the shiny "angel ring" band across the crown */}
          <Path
            d="M -34 -42 Q -30 -50 -24 -53 L -22 -46 L -16 -56 L -12 -49 L -6 -58 L -2 -50 L 4 -58 L 8 -50 L 14 -56 L 18 -47 L 24 -53 Q 30 -50 34 -42 Q 26 -47 18 -43 L 14 -49 L 8 -44 L 4 -51 L -2 -44 L -6 -51 L -12 -44 L -16 -49 L -20 -43 Q -28 -47 -34 -42 Z"
            fill="#FFFFFF"
            opacity={0.22}
          />
          {/* brows show through the fringe, as is usual in anime */}
          <G opacity={0.75}>
            <Path d="M -26 -12 Q -17 -16 -7 -13" stroke={darken(hairCol, 0.45)} strokeWidth={2} fill="none" strokeLinecap="round" />
            <Path d="M 26 -12 Q 17 -16 7 -13" stroke={darken(hairCol, 0.45)} strokeWidth={2} fill="none" strokeLinecap="round" />
          </G>
          {/* side locks that frame the face */}
          {feminine && (
            <G>
              <Path d="M -44 -6 C -48 20 -46 40 -40 54 C -36 40 -34 20 -34 -2 Z" fill={`url(#${gid}-hair)`} />
              <Path d="M 44 -6 C 48 20 46 40 40 54 C 36 40 34 20 34 -2 Z" fill={`url(#${gid}-hair)`} />
            </G>
          )}
          {c.hair === 'ponytail' && <Path d="M 26 -46 Q 36 -50 40 -42 Q 34 -40 30 -38 Z" fill="#E2483D" />}
          {c.hair === 'bun' && <Path d="M -12 -48 Q 0 -54 12 -48" stroke="#E2483D" strokeWidth={3} fill="none" />}
        </G>
      </Svg>
    </Animated.View>
  );
}
