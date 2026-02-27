import { SceneManager }       from './SceneManager.js';
import { WardrobeLoader }     from './WardrobeLoader.js';
import { InteractionHandler } from './InteractionHandler.js';

async function init() {
  const sceneManager = new SceneManager();

  const loader     = new WardrobeLoader(sceneManager.scene);
  const doorGroups = await loader.load('./cubes.xml');

  new InteractionHandler(sceneManager.camera, sceneManager.renderer, doorGroups);
}

init();
