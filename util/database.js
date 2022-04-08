// Allows us to connect to SQL database
const mysql = require('mysql2');

// One way is that we set up one connection which we can then use to run queries and we should always close the connection once we are done with a query. We need to re-execute the code to create the connection for every new query. 

// Creating new connections all the time becomes very inefficient both in our code and also regarding the connection to the database which is established and also cost performance.

// So a better way is to create a so-called connection pool which allows us to always reach out to it whenever we have a query to run. We can run multiple queries simultaneously. Once the connection is done, the connection will be handed back into the pool and it is available again for a new query and the pool can then be finished when our application shuts down.
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'node-connect',
    password: 'ctspl@ssvm'
});

module.exports = pool.promise();
