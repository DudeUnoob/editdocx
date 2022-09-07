const { databaseConnectionString } = require('../config/config');
const mongoose = require('mongoose');

mongoose.connect(databaseConnectionString).then(() => {
    console.log('connected to database')
})

const Schema = new mongoose.Schema({
    shareduser: String,
    documentId: String,
    owner: String,
    title: String
})

module.exports = mongoose.model('SharedDocument', Schema)