import cors from "cors";
import express from "express";
import { type AppContext, createAppContext } from "./lib/ctx";
import { applyTrpcToExpressApp } from "./lib/trpc";
import { trpcRouter } from "./router";

void (async () => {
  let ctx: AppContext | null = null;
  try {
    ctx = createAppContext();
    const expressApp = express();
    expressApp.use(cors());
    expressApp.get("/ping", (req, res) => {
      res.send("pong");
    });
    await applyTrpcToExpressApp(expressApp, ctx, trpcRouter);
    expressApp.listen(3001, () => {
      console.info("Listening at http://localhost:3001");
    });
  } catch (error) {
    console.error(error);
    await ctx?.stop();
  }
})();
