module.exports = (sequelize, DataTypes) => {
  const BlockChain = sequelize.define(
    'BlockChain',
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
        type: DataTypes.JSON,
        allowNull: false,
      },
      currHash: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      fromPublicKey: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      toPublicKey: {
        type: DataTypes.TEXT,
        allowNull: true,
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
  BlockChain.associate = function (models) {
    // associations can be defined here
  };
  return BlockChain;
};
