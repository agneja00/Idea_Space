import _ from "lodash";
import { trpc } from "../../../lib/trpc";
import { zGetIdeasTrpcInput } from "./input";

export const getIdeasTrpcRoute = trpc.procedure.input(zGetIdeasTrpcInput).query(async ({ ctx, input }) => {
  const normalizedSearch = input.search ? input.search.trim().replace(/[\s\n\t]/g, " & ") : undefined;

  const rawIdeas = await ctx.prisma.idea.findMany({
    select: {
      id: true,
      nick: true,
      name: true,
      description: true,
      serialNumber: true,
      _count: {
        select: {
          ideasLikes: true,
        },
      },
    },
    where: {
      blockedAt: null,
      ...(!normalizedSearch
        ? {}
        : {
            OR: [
              {
                name: {
                  contains: input.search,
                  mode: "insensitive",
                },
              },
              {
                description: {
                  search: normalizedSearch,
                },
              },
              {
                text: {
                  search: normalizedSearch,
                },
              },
            ],
          }),
    },
    orderBy: [
      {
        createdAt: "desc",
      },
      {
        serialNumber: "desc",
      },
    ],
    cursor: input.cursor ? { serialNumber: input.cursor } : undefined,
    take: input.limit + 1,
  });

  const nextIdea = rawIdeas.at(input.limit);
  const nextCursor = nextIdea?.serialNumber;
  const rawIdeasExceptNext = rawIdeas.slice(0, input.limit);
  const ideasExceptNext = rawIdeasExceptNext.map((idea) => ({
    ..._.omit(idea, ["_count"]),
    likesCount: idea._count.ideasLikes,
  }));

  return { ideas: ideasExceptNext, nextCursor };
});
