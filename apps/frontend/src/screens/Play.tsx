import { useState, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { userAtom } from '@repo/store/userAtom';
import {
  INITIAL_BOARD,
  ChessLayout,
  LobbyPanel,
  SetupPanel,
} from '../components/chess';
import type { PlayerInfo } from '../components/chess';

export default function Play() {
  const { mode } = useParams<{ mode?: string }>();
  const [searchParams] = useSearchParams();
  const inviteGameId = searchParams.get('gameId');
  const navigate = useNavigate();
  const [user] = useRecoilState(userAtom);

  const [board, setBoard] = useState<string[][]>(() => INITIAL_BOARD.map(r => [...r]));
  const [selectedSquare, setSelectedSquare] = useState<[number, number] | null>(null);
  const [lastMove, setLastMove] = useState<{ from: [number, number]; to: [number, number] } | null>({
    from: [6, 4],
    to: [4, 4],
  });
  const [isSearching, setIsSearching] = useState(false);

  // Square click handler for interactive board preview
  const handleSquareClick = useCallback(
    (ri: number, ci: number) => {
      const piece = board[ri][ci];
      if (selectedSquare) {
        const [sri, sci] = selectedSquare;
        if (sri === ri && sci === ci) {
          setSelectedSquare(null);
          return;
        }
        const sourceIsWhite = board[sri][sci] !== ' ' && board[sri][sci] === board[sri][sci].toUpperCase();
        const targetIsWhite = piece !== ' ' && piece === piece.toUpperCase();

        if (sourceIsWhite && targetIsWhite) {
          setSelectedSquare([ri, ci]);
          return;
        }

        const newBoard = board.map(r => [...r]);
        newBoard[ri][ci] = board[sri][sci];
        newBoard[sri][sci] = ' ';
        setBoard(newBoard);
        setLastMove({ from: [sri, sci], to: [ri, ci] });
        setSelectedSquare(null);
      } else {
        if (piece !== ' ') {
          setSelectedSquare([ri, ci]);
        }
      }
    },
    [board, selectedSquare]
  );

  // Handle mode selection: navigate to /play/:mode
  const handleSelectMode = (selectedMode: string) => {
    navigate(`/play/${selectedMode}`);
  };

  // Handle start game: start matching animation. Transition to game happens ONLY on INIT_GAME socket event
  const handleStartGame = (_timeControl: string) => {
    setIsSearching(true);
  };

  const topPlayer: PlayerInfo = {
    name: mode ? `Opponent (${mode === 'bot' ? 'Bot' : 'Online'})` : 'Opponent',
    elo: mode === 'bot' ? 1500 : 1200,
    initials: mode === 'bot' ? '🤖' : 'AZ',
    side: 'black',
    clock: '3:00',
    active: false,
  };

  const bottomPlayer: PlayerInfo = {
    name: user?.username || 'You',
    elo: user?.rating || 1247,
    initials: (user?.username?.substring(0, 2) || 'ME').toUpperCase(),
    side: 'white',
    clock: '3:00',
    active: false,
  };

  const title = mode ? `Play / ${mode.toUpperCase()}` : 'Play Chess';

  return (
    <ChessLayout
      title={title}
      isLive={false}
      board={board}
      selectedSquare={selectedSquare}
      lastMove={lastMove}
      onSquareClick={handleSquareClick}
      topPlayer={topPlayer}
      bottomPlayer={bottomPlayer}
      orientation="white"
      boardInteractive={true}
      rightPanel={
        mode || inviteGameId ? (
          <SetupPanel
            mode={mode || 'friend'}
            inviteGameId={inviteGameId}
            onBack={() => navigate('/play')}
            onStartGame={handleStartGame}
            isSearching={isSearching}
          />
        ) : (
          <LobbyPanel onSelectMode={handleSelectMode} />
        )
      }
    />
  );
}
