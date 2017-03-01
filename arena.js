class Arena {
  constructor(width, height) {
    const matrix = [];
    while (height--) {
      matrix.push(new Array(width).fill(0));
    }
    this.matrix = matrix;
  }

  clear() {
    this.matrix.forEach((row) => row.fill(0));
  }

  sweep() {
    let rowCount = 1;
    const pointsPerLine = 10;
    for (let y = this.matrix.length - 1; y > 0; --y) {
      const isLineFull = !this.matrix[y].some((value) => value === 0);
      if (isLineFull) {
        const row = this.matrix.splice(y, 1)[0].fill(0);
        this.matrix.unshift(row);
        y++;
        player.score += rowCount * pointsPerLine;
        rowCount *= 2;
      }
    }
  }
}
