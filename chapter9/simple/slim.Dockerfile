FROM node:slim
WORKDIR /app
COPY . .
ENV NODE_OPTIONS="--no-warnings"
RUN npm install --omit=dev
CMD ["node", "app.js"]