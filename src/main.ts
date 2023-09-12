import p5 from 'p5'
import '../styles/main.sass'

import P5 from "p5"

let rows: number
let cols: number

let resolution: number = 10
let grid: Array<Array<number>>

let isPlaying: boolean = false

function makeArray (cols: number, rows: number): number[][] {

  const arr = new Array(cols)
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows)
  }

  return arr
}

function countNeighbors(grid: number[][], x: number, y: number): number {
  let sum = 0;
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      let col = (x + i + cols) % cols;
      let row = (y + j + rows) % rows;
      sum += grid[col][row];
    }
  }
  sum -= grid[x][y];
  return sum;
}

function resetGrid(grid: number[][], cols: number, rows: number): void {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = 0
    }
  }
}

function drawGrid(p5: P5, grid: number[][], cols: number, rows: number): void {
  
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {

      let x = i * resolution
      let y = j * resolution

      if (grid[i][j] == 1) {
        p5.noStroke()
        p5.fill(255)
        // p5.stroke(0)
        p5.rect(x, y, resolution - 1, resolution - 1)
      }
      else {
        p5.noStroke()
        p5.fill("#0f0e17")
        p5.rect(x, y, resolution - 1, resolution - 1)
      }
    }
  }

}

const playButton = document.getElementById('start')!
const pauseButton = document.getElementById('stop')!
const resetButton = document.getElementById('reset')!
const randomButton = document.getElementById('randomize')!




const sketch = (p5: P5) => {



  p5.setup = () => {
    // Create canvas
    const canvas = p5.createCanvas(600, 300)
    canvas.parent('app')
    p5.frameRate(10)

    cols = p5.width / resolution
    console.log(`${cols} cols`)
    rows = p5.height / resolution

    grid = makeArray(cols, rows)

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        grid[i][j] = /* Math.floor(Math.random() * 2); */ 0
      }
    }

    p5.noLoop()

  }

  p5.draw = () => {

    p5.mouseClicked = () => {
      // Get the row and column of the clicked cell
      const i = Math.floor(p5.mouseX / resolution)
      const j = Math.floor(p5.mouseY / resolution)

      grid[i][j] = (grid[i][j] === 1) ? 0 : 1 

      p5.noStroke();

  // Draw the cell with the new value
      p5.fill("#0f0e17");
      p5.rect(i * resolution, j * resolution, resolution - 1, resolution - 1)

      drawGrid(p5, grid, cols, rows)
    };


    p5.background("#0f0e17")

    drawGrid(p5, grid, cols, rows) 

    let next = makeArray(cols, rows);

    // Compute next based on grid
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let state = grid[i][j];
        // Count live neighbors!
        let sum = 0;
        let neighbors = countNeighbors(grid, i, j);
  
        if (state == 0 && neighbors == 3) {
          next[i][j] = 1;
        } else if (state == 1 && (neighbors < 2 || neighbors > 3)) {
          next[i][j] = 0;
        } else {
          next[i][j] = state;
        }
      }
    }
  
    grid = next;

    

    playButton.addEventListener('click', () => {
      p5.loop()
    })

    pauseButton.addEventListener('click', () => {
      p5.noLoop()
    })

    resetButton.addEventListener('click', () => {
      p5.loop()
      resetGrid(grid, cols, rows)
      drawGrid(p5, grid, cols, rows)
      p5.noLoop()
    })

    // randomButton.addEventListener('click', () => {
    //   p5.loop()
    //   for (let i = 0; i < cols; i++) {
    //     for (let j = 0; j < rows; j++) {
    //       grid[i][j] = Math.floor(Math.random() * 2);
    //     }
    //   }
    //   drawGrid(p5, grid, cols, rows)
    //   p5.noLoop()
    // })
  }

}

new P5(sketch)
