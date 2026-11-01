export type GameMode = 'online' | 'bot' | 'friend' | 'tournament' | 'variants' | string;
export type RightTab = 'moves' | 'chat' | 'info';

export interface MoveEntry {
  moveNum: number;
  white: string;
  black?: string;
}

export interface ChatMessage {
  who: string;
  msg: string;
  you: boolean;
  time?: string;
}

export interface LobbyOption {
  id: string;
  mode: GameMode;
  icon: string;
  label: string;
  sub: string;
  color: string;
  glow: string;
}

export const PIECE_IMG: Record<string, string> = {
  K: '/wk.png', Q: '/wq.png', R: '/wr.png', B: '/wb.png', N: '/wn.png', P: '/wp.png',
  k: '/bk.png', q: '/bq.png', r: '/br.png', b: '/bb.png', n: '/bn.png', p: '/bp.png',
};

export const INITIAL_BOARD: string[][] = [
  ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
];

export const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];
export const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

export const LOBBY_OPTIONS: LobbyOption[] = [
  { id: 'online',     mode: 'online',     icon: '⚡', label: 'Play Online',    sub: 'Play vs a person of similar skill',   color: '#00f5ff', glow: 'rgba(0,245,255,0.25)' },
  { id: 'bot',        mode: 'bot',        icon: '🤖', label: 'Play Bots',      sub: 'Challenge a bot from Easy to Master', color: '#a855f7', glow: 'rgba(168,85,247,0.25)' },
  { id: 'friend',     mode: 'friend',     icon: '👥', label: 'Play a Friend',  sub: 'Invite a friend to a game of chess',  color: '#22c55e', glow: 'rgba(34,197,94,0.25)' },
  { id: 'tournament', mode: 'tournament', icon: '🏆', label: 'Tournaments',    sub: 'Join an Arena where anyone can win',  color: '#f97316', glow: 'rgba(249,115,22,0.25)' },
  { id: 'variants',   mode: 'variants',   icon: '♟', label: 'Chess Variants', sub: 'Find fun new ways to play chess',     color: '#f59e0b', glow: 'rgba(245,158,11,0.25)' },
];

export const TIME_CONTROLS = [
  { label: '1',  sub: 'Bullet', val: '1+0'  },
  { label: '3',  sub: 'Blitz',  val: '3+0'  },
  { label: '5',  sub: 'Blitz',  val: '5+0'  },
  { label: '10', sub: 'Rapid',  val: '10+0' },
];

export const SAMPLE_MOVES: MoveEntry[] = [
  { moveNum: 1, white: 'e4',  black: 'e5'  },
  { moveNum: 2, white: 'Nf3', black: 'Nc6' },
  { moveNum: 3, white: 'Bb5', black: 'a6'  },
  { moveNum: 4, white: 'Ba4', black: 'Nf6' },
];

export const INIT_GAME = 'init_game';
export const GAME_INFO = 'game_info';
export const MAKE_MOVE = 'move';
export const GAME_OVER = 'game_over';
export const GAME_ADDED = 'game_added';
export const GAME_REMOVED = 'game_removed';
export const JOIN_GAME = 'join_game';
export const LEAVE_GAME = 'leave_game';
export const JOIN_ROOM = 'join_room';
export const GAME_JOINED = 'game_joined';
export const GAME_ENDED = 'game_ended';
export const GAME_ALERT = 'game_alert';

