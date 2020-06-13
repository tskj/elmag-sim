export type R2 = { x: number; y: number };
export type Domain = { lowerLeft: R2; upperRight: R2 };
export type Field = {
  vectors: Record<GaussianCoord, R2>;
  domain: Domain;
};

type GaussianCoord = string;
export const toGaussianCoord = ({ x, y }: R2): GaussianCoord => `${x}:${y}`;
export const fromGaussianCoord = (coord: GaussianCoord): R2 => {
  const [x = 0, y = 0] = coord.split(':').map((x) => parseInt(x, 10));
  return { x, y };
};

const cartesianProduct = <T>(xs: T[], ys: T[]) => <E>(
  f: (x: T, y: T) => E
): E[] => xs.flatMap((x) => ys.map((y) => f(x, y)));

export const coordsInDomain = ({ lowerLeft, upperRight }: Domain): R2[] => {
  const width = upperRight.x - lowerLeft.x;
  const xs = Array.from({ length: width + 1 }, (_, i) => i + lowerLeft.x);

  const height = upperRight.y - lowerLeft.y;
  const ys = Array.from({ length: height + 1 }, (_, i) => i + lowerLeft.y);

  return cartesianProduct(xs, ys)((x, y) => ({ x, y }));
};

export const genField = (field: (x: R2) => R2, domain: Domain): Field => {
  return {
    vectors: coordsInDomain(domain)
      .map((pos) => ({ pos, vec: field(pos) }))
      .reduce(
        (acc, { pos, vec }) => ({ ...acc, [toGaussianCoord(pos)]: vec }),
        {}
      ),
    domain,
  };
};
