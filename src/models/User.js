const { store, saveData, generateId } = require('../data/store');
const AppError = require('../utils/AppError');

class User {
  static async create({ name, email, password }) {
    if (!name || !name.trim()) {
      throw new AppError('Name is required', 400);
    }
    if (!email || !email.trim()) {
      throw new AppError('Email is required', 400);
    }

    const trimmedEmail = email.toLowerCase().trim();
    if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      throw new AppError('Please provide a valid email', 400);
    }

    const duplicate = store.users.find((u) => u.email === trimmedEmail);
    if (duplicate) {
      throw new AppError('Email already registered', 400);
    }

    const newUser = {
      _id: generateId(),
      name: name.trim(),
      email: trimmedEmail,
      password,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    store.users.push(newUser);
    saveData();
    return { ...newUser };
  }

  static findOne(query) {
    const user = store.users.find((u) => {
      for (const [key, val] of Object.entries(query)) {
        if (u[key] !== val) return false;
      }
      return true;
    });

    const result = user ? { ...user } : null;

    return {
      select() {
        return Promise.resolve(result);
      },
      then(resolve, reject) {
        return Promise.resolve(result).then(resolve, reject);
      },
    };
  }

  static async findById(id) {
    const user = store.users.find((u) => u._id === id);
    return user ? { ...user } : null;
  }
}

module.exports = User;
