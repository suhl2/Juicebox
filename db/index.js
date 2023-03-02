const { Client } = require("pg");
const client = new Client('postgres://localhost:5432/juicebox-dev');

const getAllUsers = async () => {
    const { rows } = await client.query(
        `SELECT id, username, password FROM users;`
    );

    return rows;
}

const createUser = async ({ username, password }) => {
    try {
        const result = await client.query(`
        INSERT INTO users(username, password)
        VALUES ($1, $2)
        ON CONFLICT (username) DO NOTHING
        RETURNING *;
        `, [username, password]);
        const { rows } = await client.query(
            `SELECT id, username, password FROM users;`
        );
        return rows;
    } catch(err) {
        throw err;
    }
}

module.exports = {
    client,
    getAllUsers,
    createUser,
}