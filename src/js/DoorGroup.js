export class DoorPart {
  constructor(mesh, config) {
    this.mesh   = mesh;
    this.config = config;
  }

  open()  { this._animateTo(this.config.openPos,   this.config.openRot);   }
  close() { this._animateTo(this.config.closedPos, this.config.closedRot); }

  _animateTo(targetPos, targetRot) {
    const { duration } = this.config;

    if (targetPos) {
      new TWEEN.Tween(this.mesh.position)
        .to(targetPos, duration)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start();
    }

    if (targetRot) {
      new TWEEN.Tween(this.mesh.rotation)
        .to(targetRot, duration)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start();
    }
  }
}

export class DoorGroup {
  constructor(name) {
    this.name   = name;
    this.parts  = [];
    this.isOpen = false;
  }

  addPart(part) {
    this.parts.push(part);
  }

  open() {
    if (this.isOpen) return;
    this.parts.forEach(part => part.open());
    this.isOpen = true;
  }

  close() {
    if (!this.isOpen) return;
    this.parts.forEach(part => part.close());
    this.isOpen = false;
  }

  toggle() {
    this.isOpen ? this.close() : this.open();
  }
}
