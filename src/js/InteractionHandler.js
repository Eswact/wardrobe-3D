const CLICK_THRESHOLD = 5; // px — movement beyond this is treated as a drag

export class InteractionHandler {
  constructor(camera, renderer, doorGroups) {
    this._camera     = camera;
    this._renderer   = renderer;
    this._doorGroups = doorGroups;

    this._raycaster = new THREE.Raycaster();
    this._pointer   = new THREE.Vector2();

    this._interactiveMeshes = this._collectMeshes(doorGroups);
    this._downX      = 0;
    this._downY      = 0;
    this._buttonHeld = false;

    this._bindEvents();
  }

  _collectMeshes(doorGroups) {
    const meshes = [];
    doorGroups.forEach(group => {
      group.parts.forEach(part => meshes.push(part.mesh));
    });
    return meshes;
  }

  _bindEvents() {
    const canvas = this._renderer.domElement;

    canvas.addEventListener('mousedown', e => {
      this._downX      = e.clientX;
      this._downY      = e.clientY;
      this._buttonHeld = true;
    });

    canvas.addEventListener('mouseup', e => {
      this._buttonHeld = false;

      // Only trigger if the pointer barely moved — not a drag
      if (Math.hypot(e.clientX - this._downX, e.clientY - this._downY) < CLICK_THRESHOLD) {
        this._handleClick(e);
      }
    });

    canvas.addEventListener('mousemove', e => {
      if (this._buttonHeld) return; // don't fight OrbitControls' grab cursor

      this._updatePointer(e);
      this._raycaster.setFromCamera(this._pointer, this._camera);
      const hit = this._raycaster.intersectObjects(this._interactiveMeshes);
      canvas.style.cursor = hit.length > 0 ? 'pointer' : 'default';
    });

    canvas.addEventListener('mouseleave', () => {
      canvas.style.cursor = 'default';
    });
  }

  _handleClick(event) {
    this._updatePointer(event);
    this._raycaster.setFromCamera(this._pointer, this._camera);

    const hits = this._raycaster.intersectObjects(this._interactiveMeshes);
    if (hits.length === 0) return;

    const groupName = hits[0].object.userData.doorGroup;
    this._doorGroups.get(groupName)?.toggle();
  }

  _updatePointer(event) {
    const rect = this._renderer.domElement.getBoundingClientRect();
    this._pointer.set(
      ((event.clientX - rect.left) / rect.width)  *  2 - 1,
      ((event.clientY - rect.top)  / rect.height) * -2 + 1
    );
  }
}
