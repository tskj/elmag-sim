import { Camera, State } from './sim';
import { R2, coordsInDomain, toGaussianCoord } from './fields';
import { Input } from './App';

const camToScreenSpace = (
  { position, zoom }: Camera,
  { width, height }: { width: number; height: number }
) => ({ x, y }: R2): R2 => {
  const scaleFactor = Math.max(width, height);
  const scale = (z: number) => (z / zoom) * scaleFactor;
  const w = {
    x: scale(x) + width / 2 - scale(position.x),
    y: -scale(y) + height / 2 - scale(position.y),
  };
  return w;
};

const drawVector = (
  { canvasSize, ctx, vectorThickness }: Input,
  vec: R2,
  { at, cam, color = 'blue' }: { at: R2; cam: Camera; color?: string }
): void => {
  if (vec.x === 0 && vec.y === 0) {
    return;
  }
  const project = camToScreenSpace(cam, {
    width: canvasSize.width,
    height: canvasSize.height,
  });
  ctx.lineWidth = vectorThickness / cam.zoom;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(project(at).x, project(at).y);
  const to = { x: at.x + vec.x, y: at.y + vec.y };
  ctx.lineTo(project(to).x, project(to).y);
  ctx.stroke();
};

const isInView = (cam: Camera) => (vec: R2) => {
  return (
    Math.abs(cam.position.x - vec.x) <= cam.zoom &&
    Math.abs(cam.position.y - vec.y) <= cam.zoom
  );
};

export const draw = (input: Input, state: State): void => {
  input.ctx.clearRect(0, 0, input.canvasSize.width, input.canvasSize.height);

  coordsInDomain(state.E.domain)
    .filter(isInView(state.camera))
    .forEach((coord) => {
      drawVector(input, state.E.vectors[toGaussianCoord(coord)], {
        at: coord,
        cam: state.camera,
      });
    });

  //   drawVector(
  //     input,
  //     { x: Math.cos(Date.now() / 1000), y: Math.sin(Date.now() / 1000) },
  //     {
  //       at: { x: 0, y: 0 },
  //       cam: state.camera,
  //     }
  //   );
};
