const mongoose = require('mongoose');

const localURI = 'mongodb://127.0.0.1:27017/learnsphere_test';

console.log("Attempting to connect to local MongoDB at:", localURI);

mongoose.connect(localURI, { serverSelectionTimeoutMS: 2000 })
    .then(() => {
        console.log("LOCAL_MONGO_FOUND");
        process.exit(0);
    })
    .catch(err => {
        console.log("LOCAL_MONGO_NOT_FOUND");
        process.exit(1);
    });
