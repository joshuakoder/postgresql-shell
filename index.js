require('dotenv').config(); // Add this line to the top of the file

const { Pool } = require('pg');
const readline = require('readline');

// Use environment variables for the PostgreSQL connection configuration
const pool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
});

// Create a readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function runQuery(query) {
  return pool.query(query)
    .then((res) => {
      console.log('Result:');
      console.table(res.rows);
      prompt();
    })
    .catch((err) => {
      console.error(`Error: ${err.message}`);
      prompt();
    });
}

function prompt() {
  rl.question('postgres-shell> ', (query) => {
    if (query === '\\q' || query === 'exit') {
      rl.close();
      pool.end();
    } else {
      runQuery(query);
    }
  });
}

console.log('Welcome to the PostgreSQL shell. Type your SQL queries or "\\q" to exit.');
prompt();
