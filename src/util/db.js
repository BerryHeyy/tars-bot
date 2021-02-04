const Database = require('better-sqlite3');
const db = new Database(__basedir + '/data/db.sqlite');

db.pragma('synchronous = 1');

// QUOTES
db.prepare(`
  CREATE TABLE IF NOT EXISTS quotes (
    user_id TEXT,
    message_content TEXT,
    message_date TEXT,
    message_url TEXT,
    message_id TEXT
  );
`).run();

const quotes = {
  insertRow: db.prepare(`
    INSERT INTO quotes (
      user_id,
      message_content,
      message_date,
      message_url,
      message_id
    ) VALUES (?, ?, ?, ?, ?);
  `),
  
  selectRowByIndex: db.prepare(`SELECT 1 FROM quotes WHERE rowid = ?;`),
  selectRowByUserId: db.prepare('SELECT * FROM quotes WHERE user_id = ?'),
  selectRowExists: db.prepare(`SELECT EXISTS(SELECT 1 FROM quotes WHERE message_id = ?)`),
  selectRowCount: db.prepare(`SELECT Count(*) FROM quotes`)

}

module.exports = {
  quotes
}