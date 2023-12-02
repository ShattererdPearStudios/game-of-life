import P5 from "p5"
import '../styles/main.sass'
import { config1, config2, config3 } from "./init-config"

type Grid = Array<Array<number>>
type Coordinates = Array<[number, number]>

let canvasWidth: number = 800
let canvasHeight: number = 400

let resolution: number = 10

let rows: number = canvasHeight / resolution
let cols: number = canvasWidth / resolution

let grid: Grid


function makeArray (cols: number, rows: number): Grid {

  const arr = new Array(cols)
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows)
  }

  return arr
}

function countNeighbors(grid: Grid, x: number, y: number): number {
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

function resetGrid(grid: Grid): void {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = 0
    }
  }
}

function drawGrid(p5: P5, grid: Grid): void {
  
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


const getCoords = (grid: Grid): Coordinates => {

  const coords: Array<[number, number]> = []

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {

      if (grid[i][j] === 1) {
        coords.push([i, j])
      }
    }
  }

  return coords

}

const applyCoordsToGrid = (grid: Grid, coords: Coordinates): void => {

  resetGrid(grid)

  coords.forEach((coord: [number, number]) => {
    const [x, y] = coord
    grid[x][y] = 1
  })

}




// Declaring the buttons
const playButton = document.getElementById('start-btn')!
const pauseButton = document.getElementById('stop-btn')!
const resetButton = document.getElementById('reset-btn')!
const randomButton = document.getElementById('randomize-btn')!


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


    // Get the coordinates of the current grid state
    p5.keyPressed = () => {
      if (p5.key === '4') {
        console.log('Grid:')
        console.log(getCoords(grid))
      }
    }


    // Add event listeners
    playButton.addEventListener('click', () => {
      p5.loop()
    })

    pauseButton.addEventListener('click', () => {
      p5.noLoop()
    })

    resetButton.addEventListener('click', () => {
      p5.noLoop()
      resetGrid(grid)
      drawGrid(p5, grid)
      p5.redraw()
    })

    randomButton.addEventListener('click', () => {
      p5.loop()
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          grid[i][j] = Math.floor(Math.random() * 2);
        }
      }
      drawGrid(p5, grid)
      p5.noLoop()
    })


    // Load Config
    p5.keyPressed = () => {
      if (p5.key === '1') {
        applyCoordsToGrid(grid, config1)
        drawGrid(p5, grid)
        p5.redraw()
      }
      if (p5.key === '2') {
        applyCoordsToGrid(grid, config2)
        drawGrid(p5, grid)
        p5.redraw()
      }
      if (p5.key === '3') {
        applyCoordsToGrid(grid, config3)
        drawGrid(p5, grid)
        p5.redraw()
      }
    }

    applyCoordsToGrid(grid, config2)
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

      drawGrid(p5, grid)
    };


    p5.background("#0f0e17")

    drawGrid(p5, grid) 

    let next = makeArray(cols, rows);

    // Compute next based on grid
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let state = grid[i][j];
        // Count live neighbors!
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

    
  }

}

new P5(sketch)
