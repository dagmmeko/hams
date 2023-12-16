import { p as prisma } from "../../../chunks/prisma.js";
import { f as fail } from "../../../chunks/index.js";
const load = async (event) => {
  const searchTenant = event.url.searchParams.get("searchTenant");
  const tenants = await prisma.tenants.findMany({
    where: {
      deletedAt: null,
      ...searchTenant && {
        OR: [
          {
            fullName: {
              contains: searchTenant
            }
          },
          {
            email: {
              contains: searchTenant
            }
          },
          {
            phoneNumber: {
              contains: searchTenant
            }
          }
        ]
      }
    }
  });
  const priceChangeRequest = await prisma.priceChange.findMany({
    where: {
      OR: [
        {
          approved: true
        },
        {
          approved: null
        }
      ],
      active: null
    },
    include: {
      Tenant: true,
      RentalUnits: true
    }
  });
  if (!tenants) {
    return fail(400, { tenants });
  }
  return { tenants, priceChangeRequest };
};
const actions = {
  acceptPending: async (event) => {
    const data = await event.request.formData();
    const priceChangeId = data.get("priceChangeId");
    if (!priceChangeId && typeof priceChangeId !== "string") {
      return fail(400, { errorMessage: "Invalid priceChangeId" });
    }
    try {
      const priceChange = await prisma.priceChange.update({
        where: {
          id: Number(priceChangeId)
        },
        data: {
          approved: true
        }
      });
      return { priceChange };
    } catch (error) {
      console.log(error);
      return fail(400, { error });
    }
  },
  denyPending: async (event) => {
    const data = await event.request.formData();
    const priceChangeId = data.get("priceChangeId");
    if (!priceChangeId && typeof priceChangeId !== "string") {
      return fail(400, { errorMessage: "Invalid priceChangeId" });
    }
    try {
      const priceChange = await prisma.priceChange.update({
        where: {
          id: Number(priceChangeId)
        },
        data: {
          approved: false,
          active: false
        }
      });
      return { priceChange };
    } catch (error) {
      console.log(error);
      return fail(400, { error });
    }
  }
};
export {
  actions,
  load
};
