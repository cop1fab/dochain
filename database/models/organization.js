module.exports = (sequelize, DataTypes) => {
  const organization = sequelize.define(
    'Organization',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      prevHash: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      data: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      currHash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {},
  );
  organization.associate = function (models) {
    // associations can be defined here
  };
  return organization;
};
