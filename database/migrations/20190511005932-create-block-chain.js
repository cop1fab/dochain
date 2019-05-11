module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('BlockChains', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    prevHash: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    data: {
      type: Sequelize.JSON,
      allowNull: false,
    },
    currHash: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    fromPublicKey: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    toPublicKey: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('BlockChains'),
};
