FROM node:22.18.0-slim AS build

RUN npm install -g pnpm

WORKDIR /app

COPY pnpm-lock.yaml ./
RUN pnpm fetch

COPY . .

RUN pnpm install --offline --ignore-scripts --frozen-lockfile

ARG NODE_ENV=production
ARG SENTRY_AUTH_TOKEN
ARG SOURCE_VERSION

RUN pnpm b prepare
RUN pnpm b build
RUN pnpm b sentry || echo
RUN pnpm w build

FROM node:22.18.0-slim

WORKDIR /app

COPY --from=build /app/package.json /app/
COPY --from=build /app/pnpm-lock.yaml /app/
COPY --from=build /app/pnpm-workspace.yaml /app/

COPY --from=build /app/frontend/package.json /app/frontend/
COPY --from=build /app/backend/package.json /app/backend/
COPY --from=build /app/shared/package.json /app/shared/

COPY --from=build /app/frontend/dist /app/frontend/dist
COPY --from=build /app/backend/dist /app/backend/dist
COPY --from=build /app/backend/src/prisma /app/backend/src/prisma

RUN npm install -g pnpm
RUN pnpm install --ignore-scripts --frozen-lockfile --prod

RUN pnpm b pgc

ARG SOURCE_VERSION
ENV SOURCE_VERSION=$SOURCE_VERSION
ENV NODE_ENV=production

CMD ["sh", "-c", "pnpm b pmp && pnpm b start"]