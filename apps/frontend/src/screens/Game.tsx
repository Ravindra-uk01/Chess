import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useUser } from '@repo/store/useUser';
import { useSocket } from '../hooks/useSocket';
import {
  INITIAL_BOARD,
  ChessLayout,
  InGamePanel,
  ResignModal,
  RANKS,
  FILES,
} from '../components/chess';
import type {
  PlayerInfo,
  MoveEntry,
  ChatMessage,
} from '../components/chess';

export default function Game() {
  const { gameId } = useParams<{ gameId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const user = useUser();
  const socket = useSocket();

  const timeControl = searchParams.get('tc') || '3+0';
  const mode = searchParams.get('mode') || 'online';

  // Game state
  const [board, setBoard] = useState<string[][]>(() => INITIAL_BOARD.map(r => [...r]));
  const [selectedSquare, setSelectedSquare] = useState<[number, number] | null>(null);
  const [lastMove, setLastMove] = useState<{ from: [number, number]; to: [number, number] } | null>(null);
  const [turn, setTurn] = useState<'white' | 'black'>('white');
  const [moves, setMoves] = useState<MoveEntry[]>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState<number | null>(null);
  const [showResignModal, setShowResignModal] = useState(false);

  // Players
  const [whitePlayer, setWhitePlayer] = useState<PlayerInfo>({
    name: user?.username || 'You',
    elo: user?.rating || 1247,
    initials: (user?.username?.substring(0, 2) || 'ME').toUpperCase(),
    side: 'white',
    clock: timeControl.split('+')[0] + ':00',
    active: true,
  });

  const [blackPlayer, setBlackPlayer] = useState<PlayerInfo>({
    name: mode === 'bot' ? 'Master Bot 🤖' : 'AlphaZero_X',
    elo: mode === 'bot' ? 1600 : 1304,
    initials: mode === 'bot' ? '🤖' : 'AZ',
    side: 'black',
    clock: timeControl.split('+')[0] + ':00',
    active: false,
  });

  // Chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { who: 'System', msg: `Match started! Time control: ${timeControl}`, you: false },
    { who: blackPlayer.name, msg: 'Good luck, have fun!', you: false },
  ]);

  // Clocks in seconds
  const initialSeconds = parseInt(timeControl.split('+')[0], 10) * 60 || 180;
  const [whiteSeconds, setWhiteSeconds] = useState(initialSeconds);
  const [blackSeconds, setBlackSeconds] = useState(initialSeconds);
  const [isGameOver, setIsGameOver] = useState(false);

  // Clock countdown timer
  useEffect(() => {
    if (isGameOver) return;
    const interval = setInterval(() => {
      if (turn === 'white') {
        setWhiteSeconds(s => Math.max(0, s - 1));
      } else {
        setBlackSeconds(s => Math.max(0, s - 1));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [turn, isGameOver]);

  const formatClock = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Keep player strip clock and active indicator updated
  useEffect(() => {
    setWhitePlayer(prev => ({
      ...prev,
      clock: formatClock(whiteSeconds),
      active: turn === 'white' && !isGameOver,
    }));
  }, [whiteSeconds, turn, isGameOver]);

  useEffect(() => {
    setBlackPlayer(prev => ({
      ...prev,
      clock: formatClock(blackSeconds),
      active: turn === 'black' && !isGameOver,
    }));
  }, [blackSeconds, turn, isGameOver]);

  // Helper to format coordinates to algebraic notation (e.g. e2 -> e4)
  const toAlgebraic = (ri: number, ci: number) => `${FILES[ci]}${RANKS[ri]}`;

  // Helper to make a board move
  const executeMove = useCallback((fromRi: number, fromCi: number, toRi: number, toCi: number) => {
    const movingPiece = board[fromRi][fromCi];
    const newBoard = board.map(r => [...r]);
    newBoard[toRi][toCi] = movingPiece;
    newBoard[fromRi][fromCi] = ' ';

    setBoard(newBoard);
    setLastMove({ from: [fromRi, fromCi], to: [toRi, toCi] });
    setSelectedSquare(null);

    const toSquare = toAlgebraic(toRi, toCi);
    const pieceChar = movingPiece.toUpperCase();
    const moveNotation = (pieceChar !== 'P' ? pieceChar : '') + toSquare;

    setMoves(prev => {
      const nextMoves = [...prev];
      if (turn === 'white') {
        nextMoves.push({
          moveNum: nextMoves.length + 1,
          white: moveNotation,
        });
      } else {
        if (nextMoves.length > 0) {
          nextMoves[nextMoves.length - 1] = {
            ...nextMoves[nextMoves.length - 1],
            black: moveNotation,
          };
        }
      }
      return nextMoves;
    });

    setTurn(t => (t === 'white' ? 'black' : 'white'));
  }, [board, turn]);

  // Square click handler
  const handleSquareClick = useCallback(
    (ri: number, ci: number) => {
      if (isGameOver) return;
      const piece = board[ri][ci];

      if (selectedSquare) {
        const [sri, sci] = selectedSquare;
        if (sri === ri && sci === ci) {
          setSelectedSquare(null);
          return;
        }

        const sourcePiece = board[sri][sci];
        const sourceIsWhite = sourcePiece !== ' ' && sourcePiece === sourcePiece.toUpperCase();
        const targetIsWhite = piece !== ' ' && piece === piece.toUpperCase();

        // If clicking another piece of the same side, switch selection
        if ((turn === 'white' && sourceIsWhite && targetIsWhite) ||
            (turn === 'black' && !sourceIsWhite && !targetIsWhite && piece !== ' ')) {
          setSelectedSquare([ri, ci]);
          return;
        }

        // Execute Move
        executeMove(sri, sci, ri, ci);

        // Send move to server if websocket is connected
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(
            JSON.stringify({
              type: 'move',
              payload: {
                gameId,
                move: {
                  from: toAlgebraic(sri, sci),
                  to: toAlgebraic(ri, ci),
                },
              },
            })
          );
        }
      } else {
        if (piece !== ' ') {
          const pieceIsWhite = piece === piece.toUpperCase();
          if ((turn === 'white' && pieceIsWhite) || (turn === 'black' && !pieceIsWhite)) {
            setSelectedSquare([ri, ci]);
          }
        }
      }
    },
    [board, selectedSquare, turn, isGameOver, socket, gameId, executeMove]
  );

  // WebSocket connection & room joining
  useEffect(() => {
    if (!socket || !gameId) return;

    const handleOpenOrSend = () => {
      socket.send(
        JSON.stringify({
          type: 'join_room',
          payload: { gameId },
        })
      );
    };

    if (socket.readyState === WebSocket.OPEN) {
      handleOpenOrSend();
    }

    const messageHandler = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'game_joined' || data.type === 'init_game') {
          if (data.payload?.whitePlayer?.name) {
            setWhitePlayer(prev => ({ ...prev, name: data.payload.whitePlayer.name }));
          }
          if (data.payload?.blackPlayer?.name) {
            setBlackPlayer(prev => ({ ...prev, name: data.payload.blackPlayer.name }));
          }
          if (data.payload?.moves && Array.isArray(data.payload.moves)) {
            // Seed moves
          }
        } else if (data.type === 'game_added') {
          // Game is still pending a 2nd player! Redirect to /play to wait & share link
          navigate(`/play?gameId=${gameId}`);
        } else if (data.type === 'game_not_found') {
          // Game not found
          navigate('/play');
        } else if (data.type === 'move') {
          // Handle remote opponent move
        } else if (data.type === 'game_ended') {
          setIsGameOver(true);
        }
      } catch (e) {
        console.error('Socket message parse error:', e);
      }
    };

    socket.addEventListener('message', messageHandler);
    return () => {
      socket.removeEventListener('message', messageHandler);
    };
  }, [socket, gameId]);

  // Chat message send handler
  const handleSendMessage = (msg: string) => {
    setChatMessages(prev => [
      ...prev,
      { who: user?.username || 'You', msg, you: true },
    ]);
  };

  // Draw offer
  const handleDraw = () => {
    setChatMessages(prev => [
      ...prev,
      { who: 'System', msg: 'You offered a draw to opponent.', you: true },
    ]);
  };

  // Resign action
  const handleConfirmResign = () => {
    setShowResignModal(false);
    setIsGameOver(true);
    setChatMessages(prev => [
      ...prev,
      { who: 'System', msg: 'You resigned. Opponent wins by resignation.', you: true },
    ]);
    setTimeout(() => {
      navigate('/play');
    }, 1500);
  };

  return (
    <>
      <ChessLayout
        title={`Live Match • ${gameId?.slice(0, 12)}...`}
        isLive={!isGameOver}
        board={board}
        selectedSquare={selectedSquare}
        lastMove={lastMove}
        onSquareClick={handleSquareClick}
        topPlayer={blackPlayer}
        bottomPlayer={whitePlayer}
        orientation="white"
        boardInteractive={!isGameOver}
        rightPanel={
          <InGamePanel
            moves={moves}
            currentMoveIndex={currentMoveIndex}
            onSelectMove={idx => setCurrentMoveIndex(idx)}
            chatMessages={chatMessages}
            onSendMessage={handleSendMessage}
            gameInfo={{
              gameId,
              mode: `${mode.toUpperCase()} (${timeControl})`,
              rated: true,
              whitePlayer: whitePlayer.name,
              blackPlayer: blackPlayer.name,
              status: isGameOver ? 'Finished' : 'In Progress',
            }}
            onDraw={handleDraw}
            onResign={() => setShowResignModal(true)}
            onNewGame={() => navigate('/play')}
          />
        }
      />

      <ResignModal
        isOpen={showResignModal}
        onConfirm={handleConfirmResign}
        onCancel={() => setShowResignModal(false)}
      />
    </>
  );
}