import Tetris from './tetris'

const playerElements = document.querySelectorAll('.player')
const tetrisList: Tetris[] = []

Array.from(playerElements).forEach(element => {
  const tetris = new Tetris(element)
  tetrisList.push(tetris)
})

const keyListener = (event: KeyboardEvent) => {
  ;[
    [65, 68, 81, 69, 83],
    [72, 75, 89, 73, 74],
  ].forEach((key, index) => {
    const player = tetrisList[index].player

    if (event.type === 'keydown') {
      if (event.keyCode === key[0]) {
        player.move(-1)
      } else if (event.keyCode === key[1]) {
        player.move(1)
      } else if (event.keyCode === key[2]) {
        player.rotate(-1)
      } else if (event.keyCode === key[3]) {
        player.rotate(1)
      }
    }

    if (event.keyCode === key[4]) {
      if (event.type === 'keydown') {
        if (player.dropInterval !== player.DROP_FAST) {
          player.drop()
          player.dropInterval = player.DROP_FAST
        }
      } else {
        player.dropInterval = player.DROP_SLOW
      }
    }
  })
}

document.addEventListener('keydown', keyListener)
document.addEventListener('keyup', keyListener)
