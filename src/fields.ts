export type R2 = { x: number; y: number };
export type Field = {
  vectors: Record<GaussianCoord, R2>;
  domain: { lowerLeft: R2; upperRight: R2 };
};

type GaussianCoord = string;
export const toGaussianCoord = ({ x, y }: R2): GaussianCoord => `${x}:${y}`;
export const fromGaussianCoord = (coord: GaussianCoord): R2 => {
  const [x = 0, y = 0] = coord.split(':').map((x) => parseInt(x, 10));
  return { x, y };
};

export const genField = (
  field: (x: R2) => R2,
  { lowerLeft, upperRight }: { lowerLeft: R2; upperRight: R2 }
): Field => {
  const width = upperRight.x - lowerLeft.x;
  const xs = Array.from({ length: width }, (_, i) => i + lowerLeft.x);

  const height = upperRight.y - lowerLeft.y;
  const ys = Array.from({ length: height }, (_, i) => i + lowerLeft.y);

  return {
    vectors: xs
      .flatMap((x) => ys.map((y) => ({ pos: { x, y }, vec: field({ x, y }) })))
      .reduce(
        (acc, { pos, vec }) => ({ ...acc, [toGaussianCoord(pos)]: vec }),
        {}
      ),
    domain: { lowerLeft, upperRight },
  };
};
