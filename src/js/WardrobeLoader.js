import { DoorPart, DoorGroup } from './DoorGroup.js';

// Maps each animated cube's `i` attribute to a named DoorGroup.
const DOOR_GROUP_MAP = {
  1: 'leftMainDoor',  3: 'leftMainDoor',  4: 'leftMainDoor',  5: 'leftMainDoor',
  2: 'rightMainDoor', 6: 'rightMainDoor', 7: 'rightMainDoor', 8: 'rightMainDoor',
  9: 'innerDrawers', 10: 'innerDrawers', 11: 'innerDrawers',
  12: 'sideLeftDoor', 18: 'sideLeftDoor', 19: 'sideLeftDoor', 20: 'sideLeftDoor',
  13: 'sideRightDoor', 21: 'sideRightDoor', 22: 'sideRightDoor', 23: 'sideRightDoor',
  14: 'topFoldDoor', 15: 'topFoldDoor', 16: 'topFoldDoor', 17: 'topFoldDoor',
  24: 'lowerInnerCabinet', 25: 'lowerInnerCabinet',
};

const FOLD_DOWN_IDS = new Set([14, 15, 16, 17]);     // rotate on X axis
const DRAWER_IDS    = new Set([9, 10, 11, 24, 25]);  // slide on Z axis only

// PBR roughness/metalness per surface color
const MATERIAL_PRESETS = {
  '#999999': { roughness: 0.25, metalness: 0.75 }, // metal handles
  '#722829': { roughness: 0.45, metalness: 0.0  }, // lacquered door panels
  '#774d2b': { roughness: 0.85, metalness: 0.0  }, // dark wood
  '#b69e79': { roughness: 0.80, metalness: 0.0  }, // light wood
  '#c8a888': { roughness: 0.80, metalness: 0.0  }, // medium wood
  '#333333': { roughness: 1.0,  metalness: 0.0  }, // room walls
  '#bfa8a8': { roughness: 0.95, metalness: 0.0  }, // floor
};
const DEFAULT_PRESET = { roughness: 0.78, metalness: 0.0 };

export class WardrobeLoader {
  constructor(scene) {
    this.scene = scene;
  }

  async load(xmlUrl) {
    const doorGroups = new Map();

    const response = await fetch(xmlUrl);
    const text     = await response.text();
    const xml      = new DOMParser().parseFromString(text, 'application/xml');

    xml.querySelectorAll('cube').forEach(node => {
      const attrs = this._parseNode(node);
      const mesh  = this._buildMesh(attrs);
      this.scene.add(mesh);

      const iVal      = parseInt(attrs.i, 10);
      const groupName = DOOR_GROUP_MAP[iVal];
      if (!groupName) return;

      if (!doorGroups.has(groupName)) {
        doorGroups.set(groupName, new DoorGroup(groupName));
      }

      doorGroups.get(groupName).addPart(new DoorPart(mesh, this._buildAnimConfig(attrs, iVal)));
      mesh.userData.doorGroup = groupName;
    });

    return doorGroups;
  }

  _parseNode(node) {
    const s = a => node.getAttribute(a);
    const f = a => parseFloat(s(a));
    return {
      x: f('x'), y: f('y'), z: f('z'),
      w: f('w'), h: f('h'), d: f('d'),
      c: s('c'),
      px: f('px'), pz: f('pz'),
      r1: f('r1'), r2: f('r2'),
      t:  f('t'),
      i:  s('i'),
    };
  }

  _buildMesh({ x, y, z, w, h, d, c }) {
    const preset   = MATERIAL_PRESETS[(c || '').toLowerCase()] ?? DEFAULT_PRESET;
    const geometry = new THREE.BoxGeometry(w, h, d);
    const material = new THREE.MeshStandardMaterial({
      color:     c,
      roughness: preset.roughness,
      metalness: preset.metalness,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.castShadow    = true;
    mesh.receiveShadow = true;
    return mesh;
  }

  _buildAnimConfig(attrs, iVal) {
    const { x, y, z, px, pz, r1, t } = attrs;

    if (FOLD_DOWN_IDS.has(iVal)) {
      // XML quirk: `px` stores the Y open target for fold-down doors
      return {
        openPos: { y: px, z: pz }, openRot: { x: r1 },
        closedPos: { y, z },       closedRot: { x: 0 },
        duration: t,
      };
    }

    if (DRAWER_IDS.has(iVal)) {
      return {
        openPos: { z: pz }, openRot: null,
        closedPos: { z },   closedRot: null,
        duration: t,
      };
    }

    return {
      openPos: { x: px, z: pz }, openRot: { y: r1 },
      closedPos: { x, z },       closedRot: { y: 0 },
      duration: t,
    };
  }
}
