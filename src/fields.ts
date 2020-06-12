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
  const list = Array.from({ length: 10 }, (_, i) => i);
  return {
    vectors: list
      .flatMap((x) =>
        list.map((y) => ({ pos: { x, y }, vec: field({ x, y }) }))
      )
      .reduce(
        (acc, { pos, vec }) => ({ ...acc, [toGaussianCoord(pos)]: vec }),
        {}
      ),
    domain: { lowerLeft, upperRight },
  };
};
