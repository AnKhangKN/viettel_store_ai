FROM node:20-alpine

WORKDIR /app

ARG VITE_BACKEND_URL=https://viettel-store-ai.onrender.com
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 4173

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "4173"]
