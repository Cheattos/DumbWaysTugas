'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class usersb extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  usersb.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'usersb',
    timestamps: true,
    createdAt:true,
    updatedAt: 'updateTimestamp'
  });
  return usersb;
};