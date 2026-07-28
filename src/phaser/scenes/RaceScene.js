import Phaser from 'phaser';
import { TextureGenerator } from '../TextureGenerator';
import { soundFx } from '../../utils/sound';

export class RaceScene extends Phaser.Scene {
  constructor() {
    super('RaceScene');
  }

  init(data) {
    this.configData = data;
    this.playerSpeed = 0;
    this.maxBaseSpeed = 280;
    this.currentMaxSpeed = 280;
    this.nitroTimer = 0;
    this.spinoutTimer = 0;
    this.maxSpeedReached = 0;
    this.steeringInput = 0;
    this.accelInput = 1;
    this.passedCheckpoints = new Set();
    this.checkpointIndexToTrigger = 0;
    this.coinsCollectedInRace = 0;
    this.raceEnded = false;
    this.playerDistance = 0;
    this.playerLaneOffset = 0;
    this.totalRaceDistance = 3200;
    this.checkpointFractions = [0.15, 0.35, 0.55, 0.75, 0.90];
    this.aiCars = [];
    this.checkpointSprites = [];
  }

  create() {
    if (this.configData.powerUps?.engineTuning) {
      this.maxBaseSpeed = 310;
      this.currentMaxSpeed = 310;
    }

    TextureGenerator.createPlayerCarTexture(
      this,
      'player_car_custom',
      this.configData.playerPaintHex || '#2563EB',
      this.configData.decalId || 'decal_none',
      this.configData.wheelColor || 'wheel_default'
    );

    this.trackPath = new Phaser.Curves.Path(400, 750);
    this.trackPath.lineTo(400, 350);
    this.trackPath.ellipseTo(300, 250, 180, 360, false, 0);
    this.trackPath.lineTo(1100, 350);
    this.trackPath.ellipseTo(300, 250, 0, 180, false, 0);
    this.trackPath.lineTo(400, 750);

    this.trackPoints = this.trackPath.getSpacedPoints(250);
    this.totalTrackLength = this.trackPath.getLength();
    this.totalRaceDistance = this.totalTrackLength;

    this.physics.world.setBounds(0, 0, 1800, 1300);

    const trackGfx = this.add.graphics();

    trackGfx.fillStyle(0x0284c7, 1);
    trackGfx.fillRect(0, 0, 1800, 1300);

    trackGfx.fillStyle(0xfde047, 1);
    trackGfx.fillRoundedRect(80, 80, 1640, 1140, 90);

    trackGfx.lineStyle(140, 0x334155, 1);
    this.trackPath.draw(trackGfx);

    trackGfx.lineStyle(6, 0xffffff, 0.9);
    this.trackPath.draw(trackGfx);

    trackGfx.lineStyle(3, 0xfacc15, 0.8);
    this.trackPath.draw(trackGfx);

    for (let i = 0; i < 35; i++) {
      const pt = this.trackPoints[Math.floor((i / 35) * this.trackPoints.length)];
      const offsetX = (i % 2 === 0 ? 1 : -1) * (95 + Math.random() * 20);
      const offsetY = (i % 3 === 0 ? 1 : -1) * (95 + Math.random() * 20);
      this.add.image(pt.x + offsetX, pt.y + offsetY, 'palm_tree').setScale(0.85).setDepth(2);
    }

    const startPt = this.trackPoints[0];
    const finishArch = this.add.image(startPt.x, startPt.y, 'finish_arch').setDepth(4);
    finishArch.setRotation(Math.PI / 2);

    this.checkpointSprites = [];
    this.checkpointFractions.forEach((frac, idx) => {
      const pt = this.trackPath.getPoint(frac);
      const tangent = this.trackPath.getTangent(frac);
      const arch = this.physics.add.sprite(pt.x, pt.y, 'checkpoint_arch');
      arch.setRotation(tangent.angle() + Math.PI / 2);
      arch.setDepth(4);
      arch.setData('checkpointIdx', idx);
      this.checkpointSprites.push(arch);
    });

    this.coinsGroup = this.physics.add.group();
    for (let i = 0; i < 20; i++) {
      const frac = (i + 0.3) / 20;
      const pt = this.trackPath.getPoint(frac);
      const coin = this.coinsGroup.create(pt.x + (Math.random() * 50 - 25), pt.y + (Math.random() * 50 - 25), 'gold_coin');
      coin.setDepth(3);
      this.tweens.add({
        targets: coin,
        y: coin.y - 6,
        duration: 800,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }

    this.boostPadsGroup = this.physics.add.group();
    for (let i = 0; i < 5; i++) {
      const frac = (i + 0.15) / 5;
      const pt = this.trackPath.getPoint(frac);
      const pad = this.boostPadsGroup.create(pt.x, pt.y, 'boost_pad');
      pad.setDepth(3);
      pad.setRotation(this.trackPath.getTangent(frac).angle() + Math.PI / 2);
    }

    const initPt = this.trackPath.getPoint(0);
    const initTangent = this.trackPath.getTangent(0);
    this.playerCar = this.physics.add.sprite(initPt.x, initPt.y, 'player_car_custom');
    this.playerCar.setDepth(10);
    this.playerCar.setRotation(initTangent.angle() + Math.PI / 2);

    const particles = this.add.particles(0, 0, 'nitro_flame', {
      speed: 120,
      scale: { start: 0.9, end: 0 },
      blendMode: 'ADD',
      lifespan: 300,
      follow: this.playerCar,
    });
    this.nitroEmitter = particles;
    this.nitroEmitter.stop();

    const aiColors = [
      { key: 'ai_car_red', name: 'Turbo Fox', laneOffset: -35, speed: 215 },
      { key: 'ai_car_green', name: 'Speedy Turtle', laneOffset: 35, speed: 195 },
      { key: 'ai_car_purple', name: 'Comet Cat', laneOffset: 0, speed: 225 },
    ];

    this.aiCars = aiColors.map((cfg, idx) => {
      const pt = this.trackPath.getPoint(0.01 * (idx + 1));
      const tangent = this.trackPath.getTangent(0.01 * (idx + 1));
      const sprite = this.physics.add.sprite(pt.x, pt.y, cfg.key);
      sprite.setDepth(9);
      sprite.setRotation(tangent.angle() + Math.PI / 2);
      return {
        sprite,
        name: cfg.name,
        pathIndex: 0,
        speed: cfg.speed,
        distanceTravelled: (idx + 1) * 25,
      };
    });

    this.cameras.main.startFollow(this.playerCar, true, 0.1, 0.1);
    this.cameras.main.setBounds(0, 0, 1800, 1300);
    this.cameras.main.setZoom(1.15);

    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
      this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    }

    this.physics.add.overlap(this.playerCar, this.coinsGroup, (_player, coin) => {
      coin.destroy();
      this.coinsCollectedInRace += 10;
      soundFx.playButtonClick();
    });

    this.physics.add.overlap(this.playerCar, this.boostPadsGroup, () => {
      this.triggerNitroBoost(2.0);
    });

    this.raceStartTime = this.time.now;

    if (this.configData.powerUps?.startingBoosts > 0) {
      if (this.configData.onUsePowerUp) {
        this.configData.onUsePowerUp('startingBoosts');
      }
      this.time.delayedCall(300, () => {
        this.triggerNitroBoost(4.5);
      });
    }

    const handleResumeAfterMath = (e) => {
      const customEvent = e;
      const correct = customEvent.detail?.correct ?? true;
      const shieldUsed = customEvent.detail?.shieldUsed ?? false;
      this.resumeRaceAfterMath(correct, shieldUsed);
    };

    window.addEventListener('resumeAfterMath', handleResumeAfterMath);

    this.events.once('shutdown', () => {
      window.removeEventListener('resumeAfterMath', handleResumeAfterMath);
    });
    this.events.once('destroy', () => {
      window.removeEventListener('resumeAfterMath', handleResumeAfterMath);
    });
  }

  setSteeringInput(val) {
    this.steeringInput = val;
  }

  setAccelInput(val) {
    this.accelInput = val;
  }

  triggerNitroBoost(durationSec = 4.5) {
    this.nitroTimer = durationSec;
    this.currentMaxSpeed = 440;
    this.playerSpeed = Math.max(this.playerSpeed, 350);
    if (this.nitroEmitter) {
      this.nitroEmitter.start();
    }
    soundFx.playNitro();
  }

  triggerSpinout() {
    this.spinoutTimer = 1.2;
    this.playerSpeed = 40;
    soundFx.playWrong();
  }

  resumeRaceAfterMath(correct, shieldUsed = false) {
    this.scene.resume();
    if (correct) {
      this.triggerNitroBoost(4.5);
      this.coinsCollectedInRace += 30;
      soundFx.playCorrect();
    } else if (shieldUsed) {
      soundFx.playCheckpoint();
      this.triggerNitroBoost(2.0);
    } else {
      this.triggerSpinout();
      this.coinsCollectedInRace = Math.max(0, this.coinsCollectedInRace - 20);
    }
  }

  update(_time, delta) {
    if (this.raceEnded) return;

    if (this.configData.powerUps?.coinMagnet && this.coinsGroup) {
      this.coinsGroup.getChildren().forEach((coin) => {
        if (coin.active && this.playerCar) {
          const dist = Phaser.Math.Distance.Between(this.playerCar.x, this.playerCar.y, coin.x, coin.y);
          if (dist < 220) {
            coin.x = Phaser.Math.Linear(coin.x, this.playerCar.x, 0.12);
            coin.y = Phaser.Math.Linear(coin.y, this.playerCar.y, 0.12);
          }
        }
      });
    }

    const dt = delta / 1000;

    if (this.spinoutTimer > 0) {
      this.spinoutTimer -= dt;
      this.playerCar.rotation += 0.3;
      this.playerSpeed = Math.max(30, this.playerSpeed - dt * 150);
    } else {
      if (this.nitroTimer > 0) {
        this.nitroTimer -= dt;
        if (this.nitroTimer <= 0) {
          this.currentMaxSpeed = this.maxBaseSpeed;
          if (this.nitroEmitter) this.nitroEmitter.stop();
        }
      }

      // Auto-Drive Cruise Control: Car automatically accelerates and steers along the track!
      let accel = 1.0;
      this.playerSpeed = Math.min(this.currentMaxSpeed, this.playerSpeed + dt * 250);

      // Gentle auto-steering weave to collect coins smoothly along the track
      const timeSec = this.time.now / 1000;
      this.playerLaneOffset = Math.sin(timeSec * 1.5) * 20;

      soundFx.setEngineState(true, this.playerSpeed / this.maxBaseSpeed);
    }

    this.playerDistance += this.playerSpeed * dt;

    const playerFrac = (this.playerDistance % this.totalTrackLength) / this.totalTrackLength;
    const pt = this.trackPath.getPoint(playerFrac);
    const tangent = this.trackPath.getTangent(playerFrac);
    const normal = new Phaser.Math.Vector2(-tangent.y, tangent.x);

    const posX = pt.x + normal.x * this.playerLaneOffset;
    const posY = pt.y + normal.y * this.playerLaneOffset;

    this.playerCar.setPosition(posX, posY);
    if (this.spinoutTimer <= 0) {
      this.playerCar.setRotation(tangent.angle() + Math.PI / 2 + (this.steeringInput * 0.15));
    }

    const mph = Math.round(this.playerSpeed * 0.35);
    if (mph > this.maxSpeedReached) {
      this.maxSpeedReached = mph;
    }

    this.aiCars.forEach((ai) => {
      ai.distanceTravelled += ai.speed * dt;
      const frac = (ai.distanceTravelled % this.totalTrackLength) / this.totalTrackLength;
      const aiPt = this.trackPath.getPoint(frac);
      const aiTangent = this.trackPath.getTangent(frac);
      const aiNormal = new Phaser.Math.Vector2(-aiTangent.y, aiTangent.x);

      const aiPosX = aiPt.x + aiNormal.x * (ai.name === 'Turbo Fox' ? -35 : ai.name === 'Speedy Turtle' ? 35 : 0);
      const aiPosY = aiPt.y + aiNormal.y * (ai.name === 'Turbo Fox' ? -35 : ai.name === 'Speedy Turtle' ? 35 : 0);

      ai.sprite.setPosition(aiPosX, aiPosY);
      ai.sprite.setRotation(aiTangent.angle() + Math.PI / 2);
    });

    const distances = [
      { id: 'player', dist: this.playerDistance },
      ...this.aiCars.map((ai) => ({ id: ai.name, dist: ai.distanceTravelled })),
    ];
    distances.sort((a, b) => b.dist - a.dist);
    const position = distances.findIndex((d) => d.id === 'player') + 1;

    const trackProgressFrac = (this.playerDistance % this.totalTrackLength) / this.totalTrackLength;

    this.checkpointFractions.forEach((chkFrac, idx) => {
      if (!this.passedCheckpoints.has(idx) && trackProgressFrac >= chkFrac && trackProgressFrac < chkFrac + 0.12) {
        this.passedCheckpoints.add(idx);
        this.scene.pause();
        soundFx.playCheckpoint();
        soundFx.setEngineState(false);
        this.configData.onMathCheckpoint(idx);
      }
    });

    const progressPct = Math.min(100, Math.round((this.playerDistance / this.totalRaceDistance) * 100));
    this.configData.onUpdateHUD({
      speedMph: mph,
      position,
      coins: this.coinsCollectedInRace,
      progressPct,
    });

    if (this.playerDistance >= this.totalRaceDistance && !this.raceEnded) {
      this.raceEnded = true;
      soundFx.setEngineState(false);
      soundFx.playVictory();
      this.scene.pause();

      const timeSec = Math.round((this.time.now - this.raceStartTime) / 1000);
      this.configData.onRaceFinish({
        position,
        timeSeconds: timeSec,
        coinsCollected: this.coinsCollectedInRace,
        maxSpeed: this.maxSpeedReached,
      });
    }
  }
}
