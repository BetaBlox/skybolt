# Skybolt

This is our base project template for web applications, APIs, and administrative portals. The goal is to make starting a new app project simple, yet come with all the things we're accustomed to having on our projects - such as testing, utilities, deployment configurations, etc.

### Demo Apps

- App - https://nestjs-react-app-demo.up.railway.app
- Admin - https://nestjs-react-admin-demo.up.railway.app

_Email john@betablox.com to have create your personal demo account_

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

### Miscellaneous

- [Git Patch Stack](https://git-ps.sh/) - Git Patch Stack is a command line tool that facilitates a Patch Stack based workflow with Git. Git Patch Stack helps you think in terms of a stack of patches instead of a series of isolated branches.

## Environment

`cp .env.example .env`

Now modify `.env` as needed

## Setup

```bash
# Install your deps
$ npm install

# Run docker services
$ npm run docker:up

# Reset and seed your database
$ npm run db:reset

# Run build once for turbo cache
$ npm run build
```

## Development

```bash
$ npm run dev
```

### App

- Client: http://localhost:3000/
- Api: http://localhost:3001/api

### Admin

- Client: http://localhost:8000/
- Api: http://localhost:8001/api

## Build

```bash
$ npm run build

# Start the production web application and API
$ npm run start

# Or Start the production admin portal which runs on port 8001
$ npm run start:admin
```

## Testing

We have created individual test commands in `package.json` so that tests can run independently of each other without running into database issues such as deadlocks.

The approriate test commands for our CI environment are found `.github/workflows/ci.yml`

```bash
# Run individual app test suite
$ npm run test:client
$ npm run test:api

# Or a shared package
$ npm run test:utils
$ npm run test:database
$ npm run test:types
$ npm run test:paginator

# See package.json for all testing commands
```

### Writing Tests

We encourage you to write tests and whatever level you are comfortable (e2e, integration, unit, etc.)

As a general rule of thumb we like to have tests for our backend APIs at either the controller or service level in NestJS. Furthermore, we will mainly stick to integration level tests because the tradeoffs of hitting HTTP layer to database coverage generally outweigh the benefits of hundreds of isolated unit tests.

Unit tests are saved for unique situations such as utility or helper methods. For example, a helper method that converts a dollars to cents or another that manipulates a string won't require much more than a few simple tests.

## Continuous Integration (CI)

All documentation for our CI process is found in `.github/workflows/ci.yml` which will utilize Github Actions when making a pull request or merging into `master`

## Continuous Delivery (CD)

Our recommended approach for CD is to use [Railway](https://railway.app/) it's generally very easy to setup a new project, set your environment variables, and deploy `master` directly with our `Dockerfile`

[Learn more about Railway](https://docs.railway.app/)

## Production Database & Hosting

If your project needs a production ready database, we recommend looking at [Supabase](https://supabase.com/). You can generally boot up a new Postgres database, connect it to your Railway app, and deploy in less than 10 minutes.

[Learn more about Supabase](https://supabase.com/docs)

When using Supabase with Railway, proper configuration is crucial for database connections to work correctly, especially for migrations.

### Setting Up Supabase Connection

1. From your Supabase project dashboard, go to Project Settings > Database to find your connection information
2. Supabase will provide two types of connection strings:

```env
# Connection pooling URL (for general database queries)
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require"
# Direct connection URL (for migrations and schema changes)
DATABASE_DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-0-us-west-1.pooler.supabase.com:5432/postgres?sslmode=require&connection_limit=1"
```

### Important Configuration Notes

1. **Port Numbers**: 
   - Use port `6543` for the pooled connection (`DATABASE_URL`)
   - Use port `5432` for direct connection (`DATABASE_DIRECT_URL`)

2. **SSL Mode**: 
   - Always include `sslmode=require` in both connection strings
   - Required for both staging and production environments

3. **Connection Pooling**:
   - Add `pgbouncer=true` to the pooled connection string
   - Add `connection_limit=1` to the direct connection string for reliable migrations

4. **Environment Variables**:
   In Railway, you'll need to set both:
   - `DATABASE_URL` - For general database queries
   - `DATABASE_DIRECT_URL` - For Prisma migrations and schema changes

### Prisma Configuration

Your Prisma schema should be configured to use both connection strings:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DATABASE_DIRECT_URL")
}
```

### Troubleshooting

If you encounter database connection issues:
1. Verify both environment variables are set correctly in Railway
2. Ensure SSL mode is enabled (`sslmode=require`)
3. Confirm you're using the correct ports (6543 for pooled, 5432 for direct)
4. Check that `connection_limit=1` is set on the direct URL
5. Verify your IP address is allowlisted in Supabase if required

## Making Improvements

As you build your project out from this template, please remember to pay it forward and improve the template. Even a seemingly simple change such as a new util method is helpful.

You can either:

1. Create an issue - https://github.com/BetaBlox/nestjs-react-template/issues
2. Submit a PR - https://github.com/BetaBlox/nestjs-react-template/pulls

## Inspiration

Heavily inspired by this YouTube video https://www.youtube.com/watch?v=nY0R7pslbCI
