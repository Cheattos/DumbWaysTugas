'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class myblog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  myblog.init({
    projectnama: DataTypes.STRING,
    startdate: DataTypes.DATEONLY,
    enddate: DataTypes.DATEONLY,
    description: DataTypes.TEXT,
    technologies: DataTypes.ARRAY(DataTypes.STRING),
    images: DataTypes.STRING,
    duration: DataTypes.STRING,
    title: DataTypes.STRING,
    author: {
      type: DataTypes.INTEGER,
      references: {
        model: 'usersbs', // Nama tabel yang diacu
        key: 'idusersb' // Kolom yang diacu
      }
    }
  }, {
    sequelize,
    modelName: 'myblog',
    timestamps: true,
    createdAt: true,
    updatedAt: 'updateTimestamp'
  });
  return myblog;
};