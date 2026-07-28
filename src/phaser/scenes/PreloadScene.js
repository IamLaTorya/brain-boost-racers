import Phaser from 'phaser';
import { TextureGenerator } from '../TextureGenerator';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  create() {
    TextureGenerator.generateTextures(this);

    TextureGenerator.createAICarTexture(this, 'ai_car_red', '#DC2626');
    TextureGenerator.createAICarTexture(this, 'ai_car_green', '#16A34A');
    TextureGenerator.createAICarTexture(this, 'ai_car_purple', '#9333EA');

    this.scene.start('RaceScene');
  }
}
