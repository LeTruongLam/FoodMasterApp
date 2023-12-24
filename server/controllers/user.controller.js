const bcrypt = require('bcrypt');
const connection = require('../db');

function executeQuery(query, params) {
  return new Promise((resolve, reject) => {
    connection.query(query, params, (error, results, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

module.exports = {
  getAll: async (req, res) => {
    try {
      const results = await executeQuery('SELECT * FROM user');
      return res.json({ success: true, data: results });
    } catch (error) {
      console.error('Error getting users: ', error);
      return res.json({ success: false, data: [], message: 'Error getting users' });
    }
  },

  login: async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.json({ success: false, data: [], message: 'Missing username or password' });
    }

    try {
      const results = await executeQuery('SELECT * FROM user WHERE username = ?', [username]);
      if (results.length === 0) {
        return res.json({ success: false, data: [], message: 'User not found' });
      }

      const hashedPassword = results[0].password;
      const isMatch = await bcrypt.compare(password, hashedPassword);

      if (isMatch) {
        return res.json({ success: true, data: results });
      } else {
        return res.json({ success: false, data: [], message: 'Invalid password' });
      }
    } catch (error) {
      console.error('Error during login: ', error);
      return res.json({ success: false, data: [], message: 'Error during login' });
    }
  },

  register: async (req, res) => {
    const { username, password, fullname } = req.body;

    console.log(req.body)
    if (!username || !password || !fullname) {
      return res.json({ success: false, data: [], message: 'Missing username, password, or fullname' });
    }
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const results = await executeQuery('INSERT INTO user (username, password, name) VALUES (?, ?, ?)', [username, hashedPassword, fullname]);
      return res.json({ success: true, data: results });
    } catch (error) {
      console.error('Error during registration: ', error);
      return res.json({ success: false, data: [], message: 'Error during registration' });
    }
  }
}