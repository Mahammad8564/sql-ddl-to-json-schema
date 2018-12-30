const lib = require('./lib');

module.exports = lib;

// var sql = `CREATE TABLE users (
//   id INT(11) NOT NULL AUTO_INCREMENT,
//   nickname VARCHAR(255) NOT NULL,
//   deleted_at TIMESTAMP NULL,
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
//   updated_at TIMESTAMP,
//   PRIMARY KEY (id)
// ) ENGINE MyISAM COMMENT 'All system users';

// ALTER TABLE users ADD UNIQUE KEY unq_nick (nickname);`

// var parser = new lib();

// parser.feed(sql)
//   .toMongooseSchemaFiles(__dirname)
//   .then((outputFilePaths) => {
//     // ...
//   });