import { trpcLoggedProcedure } from "../../../lib/trpc";
import { zSetIdeaLikeIdeaTrpcInput } from "./input";
import { sendIdeaLikedEmail } from "../../../utils/sendEmail";
import { logger } from "../../../lib/logger";

export const setIdeaLikeTrpcRoute = trpcLoggedProcedure
  .input(zSetIdeaLikeIdeaTrpcInput)
  .mutation(async ({ ctx, input }) => {
    const { ideaId, isLikedByMe } = input;

    if (!ctx.me) {
      throw new Error("UNAUTHORIZED");
    }

    const idea = await ctx.prisma.idea.findUnique({
      where: { id: ideaId },
      include: { author: true },
    });

    if (!idea) {
      throw new Error("NOT_FOUND");
    }

    if (isLikedByMe) {
      await ctx.prisma.ideaLike.upsert({
        where: { ideaId_userId: { ideaId, userId: ctx.me.id } },
        create: { ideaId, userId: ctx.me.id },
        update: {},
      });

      if (idea.author.email) {
        try {
          await sendIdeaLikedEmail({
            user: { email: idea.author.email },
            idea: { name: idea.name },
            liker: { nick: ctx.me.nick },
          });
        } catch (err) {
          logger.error("Failed to send idea liked email", err);
        }
      }
    } else {
      await ctx.prisma.ideaLike.deleteMany({
        where: { ideaId, userId: ctx.me.id },
      });
    }

    const likesCount = await ctx.prisma.ideaLike.count({ where: { ideaId } });

    const isLikedByMeNow = await ctx.prisma.ideaLike.findUnique({
      where: { ideaId_userId: { ideaId, userId: ctx.me.id } },
    });

    return {
      idea: {
        id: idea.id,
        likesCount,
        isLikedByMe: !!isLikedByMeNow,
      },
    };
  });
