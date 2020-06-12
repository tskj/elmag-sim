import { Field, R2, genField } from './fields';
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

const upField = ({ x, y }: R2): R2 => ({ x: 0, y: 1 });
export const initialState = {
  camera: {
    position: { x: 0, y: 0 },
    zoom: 10,
  },
  E: genField(upField, {
    lowerLeft: { x: 0, y: 0 },
    upperRight: { x: 10, y: 10 },
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
    y: scale(y) + height / 2 - scale(position.y),
  };
  return w;
};
const drawVector = (
  { size, ctx }: Input,
  vec: R2,
  { at, cam, color = 'blue' }: { at: R2; cam: Camera; color?: string }
): void => {
  if (vec.x === 0 && vec.y === 0) {
    return;
  }
  const project = camToScreenSpace(cam, {
    width: size.width,
    height: size.height,
  });
  ctx.lineWidth = 1 / cam.zoom;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(project(at).x, project(at).y);
  const to = { x: at.x + vec.x, y: at.y + vec.y };
  ctx.lineTo(project(to).x, project(to).y);
  ctx.stroke();
};
const draw = (input: Input, state: State): void => {
  drawVector(
    input,
    { x: 1, y: 1 },
    {
      at: { x: 0, y: 0 },
      cam: state.camera,
    }
  );
};
