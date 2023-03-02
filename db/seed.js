const { client, getAllUsers } = require('./index');

const testDB = async () => {
    try {
        client.connect();
        const users = await getAllUsers();
        console.log(users);

    } catch(err) {
        console.log(err);
    } finally {
        client.end();
    }
}

testDB();