const Repository = function () {
};

Repository.prototype.add = function (data, callback) {
  const Model = this.model;
  const newItem = new Model(data);
  newItem.save(callback);
};

Repository.prototype.update = function (id, body, callback) {
  const query = this.model.update({ _id: id }, body);
  query.exec(callback);
};

Repository.prototype.delete = function (id, callback) {
  const model = this.model;
  const query = model.remove({ _id: id });
  query.exec(callback);
};

Repository.prototype.getAll = function (callback) {
  const model = this.model;
  const query = model.find();
  query.exec(callback);
};

Repository.prototype.getById = function (id, callback) {
  const model = this.model;
  const query = model.findOne({ _id: id });
  query.exec(callback);
};

Repository.prototype.findByConditions = function (conditions, callback) {
  const model = this.model;
  const query = model.find(conditions).populate('userId');
  query.exec(callback);
};

Repository.prototype.getByUsername = function (username, callback) {
  const model = this.model;
  const query = model.findOne({ username });
  query.exec(callback);
};

Repository.prototype.getByEmail = function (email, callback, isIntroduced = false) {
  const model = this.model;
  const query = model.findOne({ email, isIntroduced });
  query.exec(callback);
};

Repository.prototype.getByToken = function (token, callback) {
  const model = this.model;
  const query = model.findOne(token);
  query.exec(callback);
};

module.exports = Repository;
