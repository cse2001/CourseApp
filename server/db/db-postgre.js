const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'shariq',
    port: 5432
});

client.connect();

client.query(`SELECT * from Users`, (err, res) => {
  if(!err){
    console.log(res.rows);
  }
  else{
    console.log(err.message);
  }
  client.end;
})

