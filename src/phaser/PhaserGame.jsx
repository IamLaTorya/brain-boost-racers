import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { PreloadScene } from './scenes/PreloadScene';
import { RaceScene } from './scenes/RaceScene';

export const PhaserGame = (props) => {
  const containerRef = useRef(null);
  const gameRef = useRef(null);
  const raceSceneRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const config = {
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: containerRef.current.clientWidth || 800,
      height: containerRef.current.clientHeight || 600,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false,
        },
      },
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      scene: [BootScene, PreloadScene, RaceScene],
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;

    game.events.once('ready', () => {
      const scene = game.scene.getScene('RaceScene');
      raceSceneRef.current = scene;
      scene.scene.start('RaceScene', props);
    });

    return () => {
      game.destroy(true);
      gameRef.current = null;
      raceSceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (raceSceneRef.current && props.steeringInput !== undefined) {
      raceSceneRef.current.setSteeringInput(props.steeringInput);
    }
  }, [props.steeringInput]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[400px] md:min-h-[500px] rounded-2xl overflow-hidden shadow-2xl relative bg-slate-950"
    />
  );
};
