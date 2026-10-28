const { store, saveData, generateId, isValidId } = require('../data/store');
const AppError = require('../utils/AppError');

function attachModelMethods(cat) {
  if (!cat) return null;
  return {
    ...cat,
    deleteOne: async function () {
      const idx = store.categories.findIndex((c) => c._id === cat._id);
      if (idx !== -1) {
        store.categories.splice(idx, 1);
        saveData();
      }
    },
  };
}

class Category {
  static async create({ name, description }) {
    if (!name || !name.trim()) {
      throw new AppError('Category name is required', 400);
    }

    const trimmedName = name.trim();
    const duplicate = store.categories.find(
      (c) => c.name.toLowerCase() === trimmedName.toLowerCase()
    );
    if (duplicate) {
      throw new AppError('Duplicate value for name', 400);
    }

    const newCategory = {
      _id: generateId(),
      name: trimmedName,
      description: description ? description.trim() : '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    store.categories.push(newCategory);
    saveData();
    return attachModelMethods(newCategory);
  }

  static find(filter = {}) {
    let list = store.categories.filter((cat) => {
      for (const [key, val] of Object.entries(filter)) {
        if (cat[key] !== val) return false;
      }
      return true;
    });

    return {
      sort() {
        return Promise.resolve(list.slice().reverse().map((c) => attachModelMethods(c)));
      },
      then(resolve, reject) {
        return Promise.resolve(list.map((c) => attachModelMethods(c))).then(resolve, reject);
      },
    };
  }

  static async findById(id) {
    if (!isValidId(id)) return null;
    const cat = store.categories.find((c) => c._id === id);
    return attachModelMethods(cat);
  }

  static async findByIdAndUpdate(id, data = {}) {
    if (!isValidId(id)) return null;
    const cat = store.categories.find((c) => c._id === id);
    if (!cat) return null;

    if (data.name !== undefined) {
      if (!data.name || !data.name.trim()) {
        throw new AppError('Category name is required', 400);
      }
      const trimmed = data.name.trim();
      const duplicate = store.categories.find(
        (c) => c._id !== id && c.name.toLowerCase() === trimmed.toLowerCase()
      );
      if (duplicate) {
        throw new AppError('Duplicate value for name', 400);
      }
      cat.name = trimmed;
    }

    if (data.description !== undefined) {
      cat.description = data.description ? data.description.trim() : '';
    }

    cat.updatedAt = new Date().toISOString();
    saveData();
    return attachModelMethods(cat);
  }

  static async exists(query = {}) {
    if (query._id && !isValidId(query._id)) return false;
    return store.categories.some((c) => {
      for (const [key, val] of Object.entries(query)) {
        if (String(c[key]) !== String(val)) return false;
      }
      return true;
    });
  }

  static async findByIdAndDelete(id) {
    if (!isValidId(id)) return null;
    const idx = store.categories.findIndex((c) => c._id === id);
    if (idx === -1) return null;
    const [removed] = store.categories.splice(idx, 1);
    saveData();
    return attachModelMethods(removed);
  }
}

module.exports = Category;
