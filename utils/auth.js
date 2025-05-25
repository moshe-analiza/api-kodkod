const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

const API_KEY_FILE = path.join(__dirname, '../api_keys.json');

const loadKeys = () => {
  if (!fs.existsSync(API_KEY_FILE)) return [];
  return JSON.parse(fs.readFileSync(API_KEY_FILE));
};

const saveKeys = (keys) => {
  fs.writeFileSync(API_KEY_FILE, JSON.stringify(keys, null, 2));
};

exports.validateApiKey = (key) => {
  const keys = loadKeys();
  return keys.includes(key);
};

exports.generateNewApiKey = () => {
  const keys = loadKeys();
  const newKey = randomUUID();
  keys.push(newKey);
  saveKeys(keys);
  return newKey;
};
