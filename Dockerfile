FROM node:20.11 as production
ENV NODE_ENV="production"
WORKDIR /app

# Copy root package.json and lockfile
COPY package.json .
COPY package-lock.json .

# Copy app package.json files
COPY apps/api/package.json ./apps/api/package.json
COPY apps/client/package.json ./apps/client/package.json

# Copy supporting packages package.json files
COPY packages/utils/package.json ./packages/utils/package.json
COPY packages/database/package.json ./packages/database/package.json
COPY packages/paginator/package.json ./packages/paginator/package.json
COPY packages/types/package.json ./packages/types/package.json

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
# optionally if you want to run npm global bin without specifying path
ENV PATH=$PATH:/home/node/.npm-global/bin
RUN npm install -g @nestjs/cli

# We still need dev deps for the build later
RUN NODE_ENV=development npm install
COPY . .

ARG DATABASE_URL

# Generate prisma runtime 
RUN npm run db:generate --workspace=database

# Turbo build all of our apps/packages
RUN npm run build

# Migrate database
RUN npm run migrate:deploy

EXPOSE 3000
CMD npm run start
