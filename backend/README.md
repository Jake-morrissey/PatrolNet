Backend structure (initial scaffold)

- `src/api/controllers`: request handlers per route/domain.
- `src/api/routes`: route definitions and wiring to controllers/middleware.
- `src/api/validators`: schema/request validation helpers.
- `src/config`: configuration loaders (env parsing, constants).
- `src/db/migrations`: database migrations (tooling TBD).
- `src/db/seeders`: seed data and fixtures.
- `src/middleware`: reusable HTTP middleware.
- `src/models`: persistence layer entities/schemas.
- `src/services`: business logic not tied to transport.
- `src/utils`: shared helpers.
- `src/types`: shared TypeScript types/interfaces.
- `src/jobs`: background/cron jobs.
- `src/plugins`: integrations/adapters (auth providers, queues, telemetry).
- `tests/integration`: integration/end-to-end tests.
- `tests/unit`: unit tests.
- `scripts`: operational scripts (setup, maintenance).

Next steps
- Decide runtime/framework (e.g., Express/Fastify, ORM, queue) and add package manifest.
- Add app/bootstrap entrypoint plus basic health route.
- Wire linting/testing/tooling once stack is chosen.

