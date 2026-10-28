const { store, saveData, generateId, isValidId } = require('../data/store');
const AppError = require('../utils/AppError');

function populateCourse(course) {
  if (!course) return null;
  const copy = { ...course };
  if (copy.category) {
    const cat = store.categories.find((c) => c._id === copy.category);
    if (cat) {
      copy.category = { _id: cat._id, name: cat.name };
    }
  }
  return copy;
}

function createQuery(initialData, isArray = false) {
  let data = isArray
    ? initialData.map((item) => ({ ...item }))
    : initialData
    ? { ...initialData }
    : null;

  const query = {
    populate(field) {
      if (field === 'category') {
        if (isArray) {
          data = data.map(populateCourse);
        } else if (data) {
          data = populateCourse(data);
        }
      }
      return query;
    },
    sort() {
      if (isArray) {
        data = data.slice().reverse();
      }
      return query;
    },
    then(resolve, reject) {
      return Promise.resolve(data).then(resolve, reject);
    },
  };

  return query;
}

class Course {
  static async create({ title, description, price, duration, category, createdBy }) {
    if (!title || !title.trim()) {
      throw new AppError('Course title is required', 400);
    }
    if (!description || !description.trim()) {
      throw new AppError('Course description is required', 400);
    }
    if (price === undefined || price === null || price === '') {
      throw new AppError('Course price is required', 400);
    }
    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice < 0) {
      throw new AppError('Price cannot be negative', 400);
    }
    if (!category) {
      throw new AppError('Category is required', 400);
    }

    const newCourse = {
      _id: generateId(),
      title: title.trim(),
      description: description.trim(),
      price: numPrice,
      duration: duration ? duration.trim() : '',
      category,
      createdBy: createdBy || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    store.courses.push(newCourse);
    saveData();
    return { ...newCourse };
  }

  static find(filter = {}) {
    const list = store.courses.filter((course) => {
      for (const [key, val] of Object.entries(filter)) {
        if (String(course[key]) !== String(val)) return false;
      }
      return true;
    });

    return createQuery(list, true);
  }

  static findById(id) {
    if (!isValidId(id)) {
      return createQuery(null, false);
    }
    const course = store.courses.find((c) => c._id === id);
    return createQuery(course, false);
  }

  static async exists(query = {}) {
    return store.courses.some((course) => {
      for (const [key, val] of Object.entries(query)) {
        if (String(course[key]) !== String(val)) return false;
      }
      return true;
    });
  }

  static async findByIdAndUpdate(id, data = {}) {
    if (!isValidId(id)) return null;
    const course = store.courses.find((c) => c._id === id);
    if (!course) return null;

    if (data.title !== undefined) {
      if (!data.title || !data.title.trim()) {
        throw new AppError('Course title is required', 400);
      }
      course.title = data.title.trim();
    }
    if (data.description !== undefined) {
      if (!data.description || !data.description.trim()) {
        throw new AppError('Course description is required', 400);
      }
      course.description = data.description.trim();
    }
    if (data.price !== undefined) {
      const numPrice = Number(data.price);
      if (isNaN(numPrice) || numPrice < 0) {
        throw new AppError('Price cannot be negative', 400);
      }
      course.price = numPrice;
    }
    if (data.duration !== undefined) {
      course.duration = data.duration ? data.duration.trim() : '';
    }
    if (data.category !== undefined) {
      course.category = data.category;
    }

    course.updatedAt = new Date().toISOString();
    saveData();
    return { ...course };
  }

  static async findByIdAndDelete(id) {
    if (!isValidId(id)) return null;
    const idx = store.courses.findIndex((c) => c._id === id);
    if (idx === -1) return null;
    const [removed] = store.courses.splice(idx, 1);
    saveData();
    return { ...removed };
  }
}

module.exports = Course;
