import { Stage, Layer, Line, Circle } from 'react-konva';

const HangmanDrawing = ({ remainingAttempts }: { remainingAttempts: number }) => {
  return (
    <Stage width={400} height={300}>
      <Layer>
        <Line points={[50, 250, 200, 250]} stroke="black" strokeWidth={5} />
        <Line points={[200, 250, 200, 50]} stroke="black" strokeWidth={5} />
        <Line points={[200, 50, 300, 50]} stroke="black" strokeWidth={5} />
        <Line points={[300, 50, 300, 80]} stroke="black" strokeWidth={5} />

        {remainingAttempts <= 5 && (
          <Circle x={300} y={100} radius={20} stroke="black" strokeWidth={5} /> // Head
        )}
        {remainingAttempts <= 4 && (
          <Line points={[300, 120, 300, 180]} stroke="black" strokeWidth={5} /> // Body
        )}
        {remainingAttempts <= 3 && (
          <Line points={[300, 130, 250, 150]} stroke="black" strokeWidth={5} /> // Left Arm
        )}
        {remainingAttempts <= 2 && (
          <Line points={[300, 130, 350, 150]} stroke="black" strokeWidth={5} /> // Right Arm
        )}
        {remainingAttempts <= 1 && (
          <Line points={[300, 180, 250, 220]} stroke="black" strokeWidth={5} /> // Left Leg
        )}
        {remainingAttempts <= 0 && (
          <Line points={[300, 180, 350, 220]} stroke="black" strokeWidth={5} /> // Right Leg
        )}
      </Layer>
    </Stage>
  );
};

export default HangmanDrawing;
