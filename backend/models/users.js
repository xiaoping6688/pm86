/* jshint node: true */
'use strict';

import { ObjectID as ObjectId } from 'mongodb';
import crypto from 'crypto';
import connectdb from '../helpers/MongoDBPool';
import $ from '../helpers/utils';

var prime_length = 60;
var diffHell = crypto.createDiffieHellman(prime_length);

async function findUserByQuery(query, usersCollection) {
    try {
        // return await usersCollection.find(query).toArrayAsync();
        return await usersCollection.find(query).toArrayAsync();
    } catch(e) {
        console.error(e);
    }
}

async function insertUserByQuery(query, usersCollection) {
    try {
        return await usersCollection.insertAsync(query);
    } catch(e) {
        console.error(e);
    }
}

async function removeUserByQuery(query, usersCollection) {
    try {
        return await usersCollection.removeAsync(query);
    } catch(e) {
        console.error(e);
    }
}

async function getUser(data) {
    var db = await connectdb();
    var users = db && db.collection('users');
    var query = {
        email: data.email,
        password: $.encode(data.password)
    };

    var documents = await findUserByQuery(query, users);

    db && db.close();
    return documents;
}

async function createUser(user) {

    var db = await connectdb();
    var users = db && db.collection('users');
    var userData = {
        'email' : user.email,
        'password' : $.encode(user.password),
        'create_at': new Date(),
    };

    var exist, result;
    var existUserQuery = {
        'email' : user.email,
    };

    exist = await findUserByQuery(existUserQuery, users);

    if(exist && exist.length) {
        db && db.close();
        return -1;
    }

    result = await insertUserByQuery(userData, users);
    db && db.close();
    return result;
}

async function removeUser(user, id) {
    var db = await connectdb();
    var users = db && db.collection('users');
    var result, existUserQuery = {
        '_id' : id
    };

    result = await removeUserByQuery(existUserQuery, users);
    db && db.close();
    return result;
}

module.exports = {
    getUser: getUser,
    removeUser: removeUser,
    createUser: createUser
};
