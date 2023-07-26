import React from "react";
import Canvas from "./Canvas";
import { DrawFunction } from "./types/misc";
import { RandomShapeBackground } from "./backgrounds/random_shape";

const App: React.FC = () => {
  const background = new RandomShapeBackground();
  const draw: DrawFunction = (ctx) => {
    background.render(ctx);
  }

  return <div>
    <Canvas draw={draw} />
  </div>
};

export default App;