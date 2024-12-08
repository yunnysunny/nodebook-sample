FROM node AS build
WORKDIR /app
COPY .npmrc .
COPY ./package-lock.json .
COPY ./package.json .
RUN npm install --omit=dev
FROM node:slim AS app
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY . .
CMD ["node", "app.js"]