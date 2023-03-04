const { client, getAllUsers, createUser, updateUser, createPost, updatePost, getAllPosts, getPostsByUser,
    getUserById, } = require('./index');

const dropTables = async () => {
    try {
        console.log("Start drop tables");
        await client.query(`
        DROP TABLE IF EXISTS posts;
        DROP TABLE IF EXISTS users;`);
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
          );
          CREATE TABLE posts (
            id SERIAL PRIMARY KEY,
            "authorId" INTEGER REFERENCES users(id) NOT NULL,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            active BOOLEAN DEFAULT true
          )`);
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

const createInitialPosts = async () => {
    try{
        const [albert, sandra, glamgal] = await getAllUsers();
        console.log("Start creating posts");
        await createPost({authorId: albert.id, title: 'WOW Hey I found a shiny rock', content: 'Wow this rock is so shiny you guys.' });
        await createPost({authorId: albert.id, title: 'More shiny rocks', content: 'Holy crap, I think this rock is even shinier than the first one!'});
        await createPost({authorId: sandra.id, title: "Hi, I'm Sandra", content: 'But you can call me Sandy'});
        await createPost({authorId: glamgal.id, title: "I love Goop!", content: "Have you tried Goop?  It's so awesome!"});
        console.log("Finished creating posts");

    } catch(err) {
        console.error("Error creating initial posts");
        throw err;
    }
}

const rebuildDB = async () => {
    try {
        client.connect();

        await dropTables();
        await createTables();
        await createInitialUsers();
        await createInitialPosts();
        

    } catch(err) {
        throw err;
    }
}

const testDB = async () => {
    try {
        console.log("Begin DB test");
        console.log("Calling getAllUsers");
        const users = await getAllUsers();
        console.log("Result:", users);
    
        console.log("Calling updateUser on users[0]")
        const updateUserResult = await updateUser(users[0].id, {
          name: "Newname Sogood",
          location: "Lesterville, KY"
        });
        console.log("Result:", updateUserResult);

        console.log("Calling getAllPosts");
        const posts = await getAllPosts();
        console.log("Posts: ", posts);
        
        // console.log("Calling updatePost on posts[0]");
        // const updatePostResult = await updatePost(posts[0].id, {
        //   title: "New Title",
        //   content: "Updated Content"
        // });
        // console.log("Result:", updatePostResult);

        console.log("Getting posts by Albert");
        const albertPosts = await getPostsByUser(1);
        console.log("Posts by Albert:", albertPosts);

        console.log("Getting Albert and all his posts");
        const userAndPosts = await getUserById(1);
        console.log(userAndPosts);
    
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