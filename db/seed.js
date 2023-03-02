const { client, getAllUsers, createUser } = require('./index');

const dropTables = async () => {
    try {
        console.log("Start drop tables");
        await client.query(`DROP TABLE IF EXISTS users;`);
        console.log("Tables dropped");
    } catch(err) {
        console.error("Error dropping tables");
        throw err;
    }
}

const createTables = async () => {
    try {
        console.log("Start build tables");
        await client.query(` CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username varchar(255) UNIQUE NOT NULL,
            password varchar(255) NOT NULL
          );`);
          console.log("Tables built");
    } catch(err) {
        console.error("Error building tables");
        throw err;
    }
}

const createInitialUsers = async () => {
    try {
        console.log("Start creating users");
        const albert = await createUser({username: 'albert', password: 'bertie99'});
        const sandra = await createUser({username: 'sandra', password: '2sandy4me'});
        const glamgal = await createUser({username: 'glamgal', password: 'soglam'});
        console.log("Finished creating users");

    } catch(err) {
        console.log("Error creating users")
        throw err;
    }
}

const rebuildDB = async () => {
    try {
        client.connect();

        await dropTables();
        await createTables();
        await createInitialUsers();

    } catch(err) {
        throw err;
    }
}

const testDB = async () => {
    try {
        console.log("Begin DB test");
        const users = await getAllUsers();
        console.log(users);
        console.log("DB test complete"); 

    } catch(err) {
        console.error("Error testing database");
        throw err;
    }
}

rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end());