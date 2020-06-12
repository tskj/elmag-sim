import { Field, R2, genField } from './fields';

let t0 = 0;

type State = {
  camera: {
    position: R2;
    zoom: number;
  };
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

export const loop = (ctx: any, state: State) => (t1: number) => {
  const dt = t1 - t0;
  t0 = t1;

  console.log(state);
  const newstate = update(state);
  draw(ctx, newstate);

  requestAnimationFrame(loop(ctx, newstate));
};

const update = (state: State): State => state;

const draw = (ctx: any, state: State): void => {};
