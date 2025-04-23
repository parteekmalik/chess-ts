import superjson from "superjson";

import { Prisma } from "@acme/db";

// Register the Prisma.Decimal class so that it is properly
// serialized (to a string) and then revived into a Decimal instance.
superjson.registerCustom<Prisma.Decimal, string>(
  {
    isApplicable: (v): v is Prisma.Decimal => Prisma.Decimal.isDecimal(v),
    serialize: (v) => v.toJSON(),
    deserialize: (v) => new Prisma.Decimal(v),
  },
  "decimal.js",
);
export { superjson };
