exports.up = (knex) => knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
  .then(() => Promise.all([
    knex.schema.hasTable('jobs').then((exists) => {
      if (!exists) {
        return knex.schema.createTable('jobs', (t) => {
          t.uuid('id').notNull().primary().defaultTo(knex.raw('uuid_generate_v4()'));
          t.text('url').notNull();
          t.text('name').notNull();
          t.timestamp('createdDate').notNull().default(knex.fn.now());
          t.timestamp('updatedDate').notNull().default(knex.fn.now());
          t.text('rawhtml');
        });
      }
      return Promise.resolve();
    }),

    knex.schema.hasTable('statuses').then((exists) => {
      if (!exists) {
        return knex.schema.createTable('statuses', (t) => {
          t.uuid('id').notNull().primary().defaultTo(knex.raw('uuid_generate_v4()'));
          t.uuid('jobId').notNull();
          t.enu('state', ['initializing', 'processing', 'success', 'failed', 'aborted', 'timeout']).notNull();
          t.timestamp('createdDate').notNull().default(knex.fn.now());
          t.text('details').notNull().default('');
          t.integer('exitCode').nullable();

          t.foreign('jobId')
            .references('jobs.id')
            .onDelete('CASCADE');
        });
      }
      return Promise.resolve();
    }),
  ]));

exports.down = (knex) => knex.schema.alterTable('statuses', (t) => {
  t.dropForeign('jobId');
}).then(() => Promise.all([
  knex.schema.dropTable('statuses'),
  knex.schema.dropTable('jobs'),
]).then(() => knex.raw('DROP EXTENSION IF EXISTS "uuid-ossp";')));
