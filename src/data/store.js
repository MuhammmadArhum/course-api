const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const dataDir = path.join(__dirname);
const dataFilePath = path.join(dataDir, 'db.json');

const defaultData = {
  users: [],
  categories: [
    {
      _id: '64b7f0f0f0f0f0f0f0f00001',
      name: 'Web Development',
      description: 'Frontend and backend development courses',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
    {
      _id: '64b7f0f0f0f0f0f0f0f00002',
      name: 'Mobile Development',
      description: 'iOS and Android app development',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  ],
  courses: [],
};

function loadData() {
  try {
    if (!fs.existsSync(dataFilePath)) {
      fs.writeFileSync(dataFilePath, JSON.stringify(defaultData, null, 2), 'utf-8');
      return JSON.parse(JSON.stringify(defaultData));
    }
    const raw = fs.readFileSync(dataFilePath, 'utf-8');
    const parsed = JSON.parse(raw);
    return {
      users: parsed.users || [],
      categories: parsed.categories || [],
      courses: parsed.courses || [],
    };
  } catch (err) {
    console.error('Error reading db.json, using defaults:', err.message);
    return JSON.parse(JSON.stringify(defaultData));
  }
}

const store = loadData();

function saveData() {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to db.json:', err.message);
  }
}

function generateId() {
  return crypto.randomBytes(12).toString('hex');
}

function isValidId(id) {
  return typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);
}

module.exports = {
  store,
  saveData,
  generateId,
  isValidId,
};
