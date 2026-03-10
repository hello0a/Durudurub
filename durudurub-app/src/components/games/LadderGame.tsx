import { Play, RotateCcw, Plus, Minus } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface LadderLine {
  from: number;
  to: number;
  position: number;
}

export function LadderGame() {
  const [numPlayers, setNumPlayers] = useState(4);
  const [playerNames, setPlayerNames] = useState(['참가자1', '참가자2', '참가자3', '참가자4']);
  const [prizes, setPrizes] = useState(['1등', '2등', '3등', '4등']);
  const [ladderLines, setLadderLines] = useState<LadderLine[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);
  const [result, setResult] = useState<{ player: string; prize: string } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // 참가자 수 변경시 이름과 상품 배열 업데이트
    const newPlayerNames = Array(numPlayers).fill(0).map((_, i) => 
      playerNames[i] || `참가자${i + 1}`
    );
    const newPrizes = Array(numPlayers).fill(0).map((_, i) => 
      prizes[i] || `${i + 1}등`
    );
    setPlayerNames(newPlayerNames);
    setPrizes(newPrizes);
  }, [numPlayers]);

  useEffect(() => {
    drawLadder();
  }, [numPlayers, ladderLines, isPlaying, selectedPlayer]);

  const generateLadder = () => {
    const lines: LadderLine[] = [];
    const segments = 10; // 사다리 세그먼트 수

    for (let i = 0; i < segments; i++) {
      const numLines = Math.floor(Math.random() * (numPlayers - 1)) + 1;
      const usedPositions = new Set<number>();

      for (let j = 0; j < numLines; j++) {
        let from = Math.floor(Math.random() * (numPlayers - 1));
        // 겹치지 않도록 체크
        while (usedPositions.has(from)) {
          from = Math.floor(Math.random() * (numPlayers - 1));
        }
        usedPositions.add(from);
        lines.push({
          from,
          to: from + 1,
          position: i
        });
      }
    }

    setLadderLines(lines);
    setResult(null);
    setIsPlaying(false);
    setSelectedPlayer(null);
  };

  const drawLadder = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const spacing = width / (numPlayers + 1);
    const segmentHeight = height / 11;

    // 캔버스 초기화
    ctx.clearRect(0, 0, width, height);

    // 세로선 그리기
    ctx.strokeStyle = '#6B7280';
    ctx.lineWidth = 3;
    for (let i = 0; i < numPlayers; i++) {
      const x = spacing * (i + 1);
      ctx.beginPath();
      ctx.moveTo(x, segmentHeight);
      ctx.lineTo(x, height - segmentHeight);
      ctx.stroke();
    }

    // 가로선 그리기
    ctx.strokeStyle = '#00A651';
    ctx.lineWidth = 3;
    ladderLines.forEach(line => {
      const fromX = spacing * (line.from + 1);
      const toX = spacing * (line.to + 1);
      const y = segmentHeight * (line.position + 1.5);
      
      ctx.beginPath();
      ctx.moveTo(fromX, y);
      ctx.lineTo(toX, y);
      ctx.stroke();
    });

    // 선택된 플레이어 경로 표시
    if (selectedPlayer !== null && isPlaying) {
      ctx.strokeStyle = '#FF0000';
      ctx.lineWidth = 4;
      
      let currentPos = selectedPlayer;
      let currentY = segmentHeight;

      ctx.beginPath();
      ctx.moveTo(spacing * (currentPos + 1), currentY);

      for (let i = 0; i < 10; i++) {
        const nextY = segmentHeight * (i + 1.5);
        ctx.lineTo(spacing * (currentPos + 1), nextY);

        // 가로선 체크
        const crossLine = ladderLines.find(
          line => line.position === i && (line.from === currentPos || line.to === currentPos)
        );

        if (crossLine) {
          const targetPos = crossLine.from === currentPos ? crossLine.to : crossLine.from;
          ctx.lineTo(spacing * (targetPos + 1), nextY);
          currentPos = targetPos;
        }

        ctx.lineTo(spacing * (currentPos + 1), segmentHeight * (i + 2));
        currentY = segmentHeight * (i + 2);
      }

      ctx.stroke();
    }
  };

  const startGame = (playerIndex: number) => {
    if (ladderLines.length === 0) {
      alert('먼저 사다리를 생성해주세요!');
      return;
    }

    setSelectedPlayer(playerIndex);
    setIsPlaying(true);

    // 사다리 타기 로직
    let currentPos = playerIndex;
    for (let i = 0; i < 10; i++) {
      const crossLine = ladderLines.find(
        line => line.position === i && (line.from === currentPos || line.to === currentPos)
      );

      if (crossLine) {
        currentPos = crossLine.from === currentPos ? crossLine.to : crossLine.from;
      }
    }

    // 결과 표시
    setTimeout(() => {
      setResult({
        player: playerNames[playerIndex],
        prize: prizes[currentPos]
      });
    }, 1000);
  };

  return (
    <div className="space-y-8">
      {/* 설정 패널 */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">사다리 설정</h2>
        
        <div className="space-y-4">
          {/* 참가자 수 조절 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              참가자 수: {numPlayers}명
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setNumPlayers(Math.max(2, numPlayers - 1))}
                className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Minus className="w-5 h-5" />
              </button>
              <div className="flex-1 h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-full bg-[#00A651] rounded-full transition-all"
                  style={{ width: `${((numPlayers - 2) / 6) * 100}%` }}
                ></div>
              </div>
              <button
                onClick={() => setNumPlayers(Math.min(8, numPlayers + 1))}
                className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 참가자 이름 입력 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">참가자 이름</label>
            <div className="grid grid-cols-2 gap-2">
              {playerNames.map((name, i) => (
                <input
                  key={i}
                  type="text"
                  value={name}
                  onChange={(e) => {
                    const newNames = [...playerNames];
                    newNames[i] = e.target.value;
                    setPlayerNames(newNames);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A651]"
                  placeholder={`참가자 ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* 상품 이름 입력 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">결과/상품</label>
            <div className="grid grid-cols-2 gap-2">
              {prizes.map((prize, i) => (
                <input
                  key={i}
                  type="text"
                  value={prize}
                  onChange={(e) => {
                    const newPrizes = [...prizes];
                    newPrizes[i] = e.target.value;
                    setPrizes(newPrizes);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A651]"
                  placeholder={`결과 ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* 사다리 생성 버튼 */}
          <button
            onClick={generateLadder}
            className="w-full bg-[#00A651] text-white font-bold py-3 rounded-full hover:bg-[#008E41] transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            사다리 생성
          </button>
        </div>
      </div>

      {/* 사다리 보드 */}
      {ladderLines.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">사다리 타기</h2>
          
          {/* 참가자 버튼 */}
          <div className="flex justify-around mb-4">
            {playerNames.map((name, i) => (
              <button
                key={i}
                onClick={() => startGame(i)}
                disabled={isPlaying}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedPlayer === i
                    ? 'bg-red-500 text-white'
                    : 'bg-[#00A651] text-white hover:bg-[#008E41]'
                } ${isPlaying ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                {name}
              </button>
            ))}
          </div>

          {/* 캔버스 */}
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="w-full border-2 border-gray-200 rounded-xl"
          />

          {/* 결과 표시 */}
          <div className="flex justify-around mt-4">
            {prizes.map((prize, i) => (
              <div
                key={i}
                className={`px-4 py-2 rounded-lg font-medium ${
                  result && prizes.indexOf(result.prize) === i
                    ? 'bg-yellow-400 text-gray-900 animate-pulse'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {prize}
              </div>
            ))}
          </div>

          {/* 결과 메시지 */}
          {result && (
            <div className="mt-6 bg-[#00A651]/10 rounded-xl p-4 text-center">
              <p className="text-xl font-bold text-[#00A651]">
                🎉 {result.player}님의 결과는 "{result.prize}"입니다!
              </p>
            </div>
          )}
        </div>
      )}

      {/* 게임 설명 */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-3">게임 방법</h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-[#00A651] font-bold">•</span>
            <span>참가자 수를 선택하고 참가자 이름과 결과/상품을 입력하세요.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#00A651] font-bold">•</span>
            <span>"사다리 생성" 버튼을 눌러 무작위 사다리를 생성합니다.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#00A651] font-bold">•</span>
            <span>참가자 버튼을 클릭하여 사다리를 타고 결과를 확인하세요.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#00A651] font-bold">•</span>
            <span>빨간 선이 경로를 표시하고 최종 결과를 알려줍니다.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
