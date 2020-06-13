import { State } from './sim';
import { Input } from './App';
import { updateCamera } from './camera-controls';

export const update = (input: Input, state: State): State => {
  return { ...state, camera: updateCamera(input, state) };
};
