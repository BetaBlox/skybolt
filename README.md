# Nest / React / Prisma Template

This is our base project template for web applications, APIs, and administrative portals. The goal is to make starting a new app project simple, yet come with all the things we're accustomed to having on our projects - such as testing, utilities, deployment configurations, etc.

## Technologies

### Frontend

- [React](https://react.dev/) - Library for web and native user interfaces.
- [Vite](https://vitejs.dev/) - Local development server and build tooling for the fronend

### Backend

- [Nest](https://github.com/nestjs/nest) - MVC web application framework written in typescript
- [Postgres](https://www.postgresql.org/) - Our database of choice
- [Prisma](https://www.prisma.io/) - ORM for schema, db migrations, data relationships
- Docker - download [Docker for Mac](https://docs.docker.com/desktop/install/mac-install/) to help manage local dependencies

### Monorepo

- [Turborepo](https://turbo.build/) - A monorepo infrastructure incremental bundler and build system optimized for JavaScript and TypeScript.

## Setup

`npm install`

`npm run docker:up`

`npm run db:reset`

## Environment

`cp .env.example .env`

Now modify `.env` as needed

## Development

`npm run dev`

### App
- Client: http://localhost:5173/
- Api: http://localhost:3000/api

### Admin
- Client: http://localhost:8080/
- Api: http://localhost:8081/api

## Build

`npm run build`

## Production

`npm run build`

`npm run start`

## Test

`npm run test`

## Making Improvements
As you build your project out from this template, please remember to pay it forward and improve the template. Even a seemingly simple change such as a new util method is helpful.

You can either:
1. Create an issue - https://github.com/BetaBlox/nestjs-react-template/issues
2. Submit a PR - https://github.com/BetaBlox/nestjs-react-template/pulls

## Inspiration

Heavily inspired by this YouTube video https://www.youtube.com/watch?v=nY0R7pslbCI
