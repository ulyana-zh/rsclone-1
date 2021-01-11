import Engine from '../engine';
import Level from '../models/Level';
import Cell from './Cell';
import { LevelConfig } from '../types';
import levels from '../data/levels.json';
import { COLS_NUM, ROWS_NUM } from '../constats';
import LoaderScreen from './screens/LoaderScreen';

const BG_URL = 'assets/images/interface/background1.jpg';
const BG_LEVEL_OFFSET_X = 370;

export default class Game {
  private engine: Engine;

  private cells: Cell[][];

  private currentLevel: Level;

  constructor(engine: Engine) {
    this.engine = engine;
    this.cells = [];
  }

  public init() {
    this.setupGame();
    const loaderScreen = new LoaderScreen(this.engine, this.startGame.bind(this));
    this.engine.preloadFiles(
      () => loaderScreen.create(),
      (percent: number) => loaderScreen.update(percent),
      () => console.log('done loading'),
    );
  }

  setupGame() {
    const { engine } = this;
    engine.createView(['back', 'main']);
    engine.getLayer('main').view.move(engine.vector(0, 0));
    engine.createScene('scene', function Scene() {
      this.update = () => {
        // code
      };
    });
    this.engine.start('scene');
  }

  startGame() {
    this.addBackground('back', this.engine.loader.files[BG_URL] as HTMLImageElement, BG_LEVEL_OFFSET_X);
    this.createCells();
    this.createLevel(0);
    this.engine.setScreen('first');
  }

  addBackground(layer: string, image: HTMLImageElement, xOffset: number) {
    this.engine
      .createNode(
        {
          type: 'ImageNode',
          position: this.engine.vector(0, 0),
          size: this.engine.vector(this.engine.size.x + xOffset, this.engine.size.y),
          layer,
          img: image,
          dh: this.engine.size.y,
        },
      );
  }

  createCells() {
    for (let x = 0; x < COLS_NUM; x += 1) {
      const row: Cell[] = [];
      for (let y = 0; y < ROWS_NUM; y += 1) {
        const cell = new Cell({ x, y }, this.engine);
        cell.draw();
        row.push(cell);
      }
      this.cells.push(row);
    }
  }

  createLevel(levelIndex: number) {
    this.currentLevel = new Level(levels[levelIndex] as LevelConfig, this.engine, this.cells);
    this.currentLevel.init();
  }
}
