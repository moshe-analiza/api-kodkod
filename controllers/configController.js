const fs = require('fs');
const path = require('path');
const { validateApiKey, generateNewApiKey } = require('../utils/auth');

const DATA_FILE = path.join(__dirname, '../data.json');

const readData = () => {
  if (!fs.existsSync(DATA_FILE)) return [];
  const raw = fs.readFileSync(DATA_FILE);
  return JSON.parse(raw);
};

const writeData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

exports.getData = (req, res) => {
  const data = readData();
  const { id, api_key, limit } = req.query;

  let filtered = data;

  if (id) {
    filtered = data.filter(item => item.id === id);
  }
  const hasKey = validateApiKey(api_key);
  const maxLimit = hasKey ? 100 : 10;
  const useLimit = Math.min(parseInt(limit) || 1, maxLimit);

  return res.json(filtered.slice(0, useLimit));
};

exports.createData = (req, res) => {
  const data = readData();
  if (!req.body) {
    return res.status(400).json({ message: 'No data provided or error syntax!' });
  }

  const newItem = req.body;
  data.push(newItem);
  writeData(data);
  res.status(201).json({ message: 'Data added', item: newItem });
};

exports.updateData = (req, res) => {
  const data = readData();
  const { id } = req.params;
  const index = data.findIndex(item => item.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Item not found' });
  }
  if (!req.body) {
    return res.status(400).json({ message: 'No data provided or error syntax!' });
  }

  data[index] = { ...data[index], ...req.body };
  writeData(data);
  res.json({ message: 'Item updated', item: data[index] });
};

exports.deleteData = (req, res) => {
  const data = readData();
  const { id } = req.params;
  const newData = data.filter(item => item.id !== id);

  if (newData.length === data.length) {
    return res.status(404).json({ message: 'Item not found' });
  }

  writeData(newData);
  res.json({ message: 'Item deleted' });
};

exports.generateApiKey = (req, res) => {
  const key = generateNewApiKey();
  res.json({ api_key: key });
};
