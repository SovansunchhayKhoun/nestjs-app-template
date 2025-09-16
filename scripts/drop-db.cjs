const { Client } = require('pg');

async function dropDb() {
  // TODO: define db name
  const dbName = '';
  const client = new Client({
    // TODO: postgres credetials
    user: '',
    host: '',
    database: '', // Connect to the default database first
    password: '',
    port: 5432,
  });

  try {
    console.log('Connecting to PostgreSQL...');
    await client.connect();

    console.log(`Dropping database: ${dbName}`);
    await client.query(`DROP DATABASE IF EXISTS "${dbName}";`);

    console.log('Database drop successful');
  } catch (error) {
    console.error('Error dropping database:', error);
  } finally {
    await client.end();
  }
}

dropDb();
