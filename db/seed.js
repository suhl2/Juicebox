const { client, getAllUsers, createUser, updateUser } = require('./index');

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
            password varchar(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            location VARCHAR(255) NOT NULL,
            active BOOLEAN DEFAULT true
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
        const albert = await createUser({username: 'albert', password: 'bertie99', name: 'Albert', location: 'New York'});
        const sandra = await createUser({username: 'sandra', password: '2sandy4me', name: 'Sandra', location: 'Ohio'});
        const glamgal = await createUser({username: 'glamgal', password: 'soglam', name: 'Paris', location: 'Los Angeles'});
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
        console.log("Calling getAllUsers")
        const users = await getAllUsers();
        console.log("Result:", users);
    
        console.log("Calling updateUser on users[0]")
        const updateUserResult = await updateUser(users[0].id, {
          name: "Newname Sogood",
          location: "Lesterville, KY"
        });
        console.log("Result:", updateUserResult);
    
        console.log("Finished database tests!");
      } catch (error) {
        console.error("Error testing database!");
        throw error;
      }
}

rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end());