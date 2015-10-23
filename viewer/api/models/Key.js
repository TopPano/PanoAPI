var Key = {
  // Enforce model schema in the case of schemaless databases
  schema: true,

  attributes: {
    apikey  : { type: 'string', unique: true },
    rate    : { type: 'string', require: true },

    // Associations
    //
    // Associate every key with one, and only one, user. This requires an
    // adapter compatible with associations.
    user    : { model: 'User', require: true }
  }
};

module.exports = Key;
