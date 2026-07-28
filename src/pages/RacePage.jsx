import React, { useState, useRef, useMemo } from 'react';
import { getRaceQuestions } from '../utils/mathGenerator';
import { PhaserGame } from '../phaser/PhaserGame';
import { RaceHUD } from '../components/RaceHUD';
import { MathModal } from '../components/MathModal';
import { TurboSpeedModal } from '../components/TurboSpeedModal';

export const RacePage = ({
  playerData,
  onFinishRace,
  onUsePowerUp,
  onNavigate,
}) => {
  const questions = useMemo(() => {
    return getRaceQuestions(playerData.selectedGrade, 5);
  }, [playerData.selectedGrade]);

  const [currentCheckpointIdx, setCurrentCheckpointIdx] = useState(null);
  const [showTurboModal, setShowTurboModal] = useState(false);
  const [pendingRaceRes, setPendingRaceRes] = useState(null);

  const [hudData, setHudData] = useState({
    speedMph: 0,
    position: 4,
    coins: 0,
    progressPct: 0,
  });
  const [steeringInput, setSteeringInput] = useState(0);

  const mathStatsRef = useRef({
    answered: 0,
    correct: 0,
  });

  let paintHex = '#2563EB';
  if (playerData.equippedCosmetics.carPaint && playerData.equippedCosmetics.carPaint !== 'default') {
    if (playerData.equippedCosmetics.carPaint === 'paint_purple') paintHex = '#9333EA';
    else if (playerData.equippedCosmetics.carPaint === 'paint_gold') paintHex = '#F59E0B';
    else if (playerData.equippedCosmetics.carPaint === 'paint_red') paintHex = '#DC2626';
    else if (playerData.equippedCosmetics.carPaint === 'paint_green') paintHex = '#16A34A';
    else if (playerData.equippedCosmetics.carPaint === 'paint_blue') paintHex = '#2563EB';
  } else {
    if (playerData.selectedCar === 'red') paintHex = '#DC2626';
    if (playerData.selectedCar === 'green') paintHex = '#16A34A';
  }

  const handleMathCheckpoint = (chkIdx) => {
    setCurrentCheckpointIdx(chkIdx);
  };

  const handleAnswerQuestion = (correct, shieldUsed = false) => {
    mathStatsRef.current.answered += 1;
    if (correct) {
      mathStatsRef.current.correct += 1;
    }

    setCurrentCheckpointIdx(null);

    const event = new CustomEvent('resumeAfterMath', { detail: { correct, shieldUsed } });
    window.dispatchEvent(event);
  };

  const handleRaceFinish = (res) => {
    setPendingRaceRes(res);
    setShowTurboModal(true);
  };

  const finalizeRaceResults = (bonusCoins = 0) => {
    if (!pendingRaceRes) return;

    const finalResult = {
      position: pendingRaceRes.position,
      timeSeconds: pendingRaceRes.timeSeconds,
      coinsEarned: pendingRaceRes.coinsCollected + bonusCoins,
      questionsAnswered: mathStatsRef.current.answered,
      correctAnswers: mathStatsRef.current.correct,
      maxSpeedReached: Math.max(pendingRaceRes.maxSpeed, bonusCoins > 0 ? 220 : pendingRaceRes.maxSpeed),
      grade: playerData.selectedGrade,
      car: playerData.selectedCar,
    };

    onFinishRace(finalResult);
  };

  const activeQuestion = questions[currentCheckpointIdx ?? 0] || questions[0];

  return (
    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden bg-slate-950 flex items-center justify-center">
      <PhaserGame
        playerPaintHex={paintHex}
        decalId={playerData.equippedCosmetics.decal}
        wheelColor={playerData.equippedCosmetics.wheelColor}
        steeringInput={steeringInput}
        powerUps={playerData.powerUps}
        onUsePowerUp={onUsePowerUp}
        onMathCheckpoint={handleMathCheckpoint}
        onRaceFinish={handleRaceFinish}
        onUpdateHUD={(data) => setHudData(data)}
      />

      <RaceHUD
        speedMph={hudData.speedMph}
        position={hudData.position}
        coins={hudData.coins}
        progressPct={hudData.progressPct}
        onSteerChange={(val) => setSteeringInput(val)}
      />

      {currentCheckpointIdx !== null && activeQuestion && (
        <MathModal
          question={activeQuestion}
          checkpointNumber={currentCheckpointIdx + 1}
          totalCheckpoints={5}
          timerEnabled={playerData.settings.mathTimerEnabled}
          timerSeconds={playerData.settings.mathTimerSeconds}
          powerUps={playerData.powerUps}
          onUsePowerUp={onUsePowerUp}
          onAnswer={handleAnswerQuestion}
        />
      )}

      {showTurboModal && (
        <TurboSpeedModal
          grade={playerData.selectedGrade}
          onCompleteTurbo={(bonusCoins) => finalizeRaceResults(bonusCoins)}
          onSkipTurbo={() => finalizeRaceResults(0)}
        />
      )}
    </div>
  );
};
