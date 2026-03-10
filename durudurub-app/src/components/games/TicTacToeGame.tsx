import { Trophy, RotateCcw } from 'lucide-react';
import { useState, useEffect } from 'react';

type CellValue = 'X' | 'O' | null;
type Board = CellValue[];

export function TicTacToeGame() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });

  useEffect(() => {
    const result = calculateWinner(board);
    if (result) {
      setWinner(result);
      setScores(prev => ({
        ...prev,
        [result]: prev[result as 'X' | 'O'] + 1
      }));
    } else if (board.every(cell => cell !== null)) {
      setWinner('무승부');
      setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
    }
  }, [board]);

  const calculateWinner = (squares: Board): CellValue => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  const resetScores = () => {
    setScores({ X: 0, O: 0, draws: 0 });
    resetGame();
  };

  return (
    <div className="space-y-8">
      {/* 점수판 */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-[#00A651]" />
            점수판
          </h2>
          <button
            onClick={resetScores}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#00A651] transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            초기화
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <p className="text-sm text-blue-600 mb-1">플레이어 X</p>
            <p className="text-3xl font-bold text-blue-600">{scores.X}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">무승부</p>
            <p className="text-3xl font-bold text-gray-600">{scores.draws}</p>
          </div>
          <div className="bg-red-50 rounded-xl p-4 text-center">
            <p className="text-sm text-red-600 mb-1">플레이어 O</p>
            <p className="text-3xl font-bold text-red-600">{scores.O}</p>
          </div>
        </div>
      </div>

      {/* 게임 보드 */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">틱택토 게임</h2>
          {winner ? (
            <div className="bg-[#00A651]/10 rounded-xl py-3 px-4 inline-block">
              <p className="text-xl font-bold text-[#00A651]">
                {winner === '무승부' ? '무승부입니다!' : `${winner} 플레이어 승리!`}
              </p>
            </div>
          ) : (
            <p className="text-lg text-gray-600">
              현재 차례: <span className={`font-bold ${isXNext ? 'text-blue-600' : 'text-red-600'}`}>
                {isXNext ? 'X' : 'O'}
              </span>
            </p>
          )}
        </div>

        {/* 게임 보드 */}
        <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mb-6">
          {board.map((cell, index) => (
            <button
              key={index}
              onClick={() => handleClick(index)}
              className={`aspect-square rounded-xl text-5xl font-bold transition-all shadow-md hover:shadow-lg
                ${cell === 'X' ? 'bg-blue-100 text-blue-600' : 
                  cell === 'O' ? 'bg-red-100 text-red-600' : 
                  'bg-gray-50 text-gray-400 hover:bg-gray-100'}
                ${!cell && !winner ? 'cursor-pointer' : 'cursor-not-allowed'}
              `}
              disabled={!!cell || !!winner}
            >
              {cell}
            </button>
          ))}
        </div>

        {/* 다시하기 버튼 */}
        <div className="text-center">
          <button
            onClick={resetGame}
            className="bg-[#00A651] text-white font-bold py-3 px-8 rounded-full hover:bg-[#008E41] transition-colors shadow-md flex items-center gap-2 mx-auto"
          >
            <RotateCcw className="w-5 h-5" />
            다시하기
          </button>
        </div>
      </div>

      {/* 게임 설명 */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-3">게임 방법</h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-[#00A651] font-bold">•</span>
            <span>X와 O가 번갈아가며 9개의 칸 중 하나를 선택합니다.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#00A651] font-bold">•</span>
            <span>가로, 세로, 대각선으로 3개를 먼저 연결하면 승리합니다.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#00A651] font-bold">•</span>
            <span>모든 칸이 채워졌는데 승자가 없으면 무승부입니다.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#00A651] font-bold">•</span>
            <span>친구와 함께 즐거운 시간을 보내세요!</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
