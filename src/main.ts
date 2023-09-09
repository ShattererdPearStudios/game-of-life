import '../styles/main.sass'

import P5 from "p5"


const sketch = (p5: P5) => {

  p5.setup = () => {

    const canvas = p5.createCanvas(600, 300)
    canvas.parent('app')

  }

  p5.draw = () => {

    p5.background("#fffffe")
    p5.fill("#e53170")
    p5.ellipse(0, 50, 80, 80)
    p5.fill("#ff0000")
    p5.ellipse(600, 50, 80, 80)

  }

}

new P5(sketch)
