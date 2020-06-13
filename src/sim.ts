import { Field, R2, genField, coordsInDomain, toGaussianCoord } from './fields';
import { input, Input } from './App';

let t0 = 0;

type Camera = {
  position: R2;
  zoom: number;
};

type State = {
  camera: Camera;
  E: Field;
};

const upField = ({ x, y }: R2): R2 => ({ x: 0, y: 0.8 });
export const initialState: State = {
  camera: {
    position: { x: 0, y: 0 },
    zoom: 20,
  },
  E: genField(upField, {
    lowerLeft: { x: -5, y: -5 },
    upperRight: { x: 5, y: 5 },
  }),
};

const read = () => {
  return input;
};

export const loop = (state: State) => (t1: number) => {
  const dt = t1 - t0;
  t0 = t1;

  const input = read();
  const newstate = update(state);
  draw(input, newstate);

  requestAnimationFrame(loop(newstate));
};

const update = (state: State): State => state;

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
const draw = (input: Input, state: State): void => {
  input.ctx.clearRect(0, 0, input.canvasSize.width, input.canvasSize.height);
  coordsInDomain(state.E.domain)
    .filter(isInView(state.camera))
    .forEach((coord) => {
      drawVector(input, state.E.vectors[toGaussianCoord(coord)], {
        at: coord,
        cam: state.camera,
      });
    });
  drawVector(
    input,
    { x: Math.cos(Date.now() / 1000), y: Math.sin(Date.now() / 1000) },
    {
      at: { x: 0, y: 0 },
      cam: state.camera,
    }
  );
};
