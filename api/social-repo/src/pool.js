const pg = require('pg');

class Pool {
  
  connect(options) {
    this._pool = new pg.Pool(options);
    return this._pool.query('SELECT  24;');
  }

  close() {
    return this._pool.end();
  }

  query(sql, params) {
    return this._pool.query(sql, params);
  }
}

module.exports = new Pool();
