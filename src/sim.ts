import { Field, R2, genField } from './fields';
import { input, Input } from './App';
import { draw } from './draw';
import { update } from './elmag';

let t0 = 0;

export type Camera = {
  moveStartPosition?: R2;
  position: R2;
  zoom: number;
};

export type State = {
  camera: Camera;
  E: Field;
};

const myField = ({ x, y }: R2): R2 => {
  const length = Math.sqrt(x * x + y * y);
  return {
    x: (2 * x) / (length * length),
    y: (2 * y) / (length * length),
  };
};

export const initialState: State = {
  camera: {
    position: { x: 0, y: 0 },
    zoom: 50,
  },
  E: genField(myField, {
    lowerLeft: { x: -25, y: -25 },
    upperRight: { x: 25, y: 25 },
  }),
};

const read = () => {
  return input;
};

export const loop = (state: State) => (t1: number = 0) => {
  const dt = t1 - t0;
  t0 = t1;

  const input = read();
  const newstate = update(input, state);
  draw(input, newstate);
  zero(input);

  requestAnimationFrame(loop(newstate));
};

const zero = (input: Input): void => {
  input.mouse.scrollSpeed = 0;
};
