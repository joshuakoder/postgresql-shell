const { Pool } = require('pg');
const readline = require('readline');

//Init environment vars 
require('dotenv').config();

//Psql connection
const pool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
});

//User input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const  runQuery = (query) => {
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

const prompt = () => {
  rl.question('postgres-shell> ', (query) => {
    if (query === '\\q' || query === 'exit') {
      rl.close();
      pool.end();
    }
    else {
      runQuery(query);
    }
  });
}

console.log('Welcome to the PostgreSQL shell. Type your SQL queries or "\\q" to exit.');
prompt();
