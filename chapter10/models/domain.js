const Sequelize = require('sequelize');

module.exports = class Domain extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        host: {
          type: Sequelize.STRING(80),
          allowNull: false,
        },
        type: {
          type: Sequelize.ENUM('free', 'premium'), // 넣을 수 있는 값 제한
          allowNull: false,
        },
        // 다른 개발자들이 NodeBird의 API를 사용할 때 필요한 비밀 키.
        clientSecret: {
          type: Sequelize.UUID, // 랜덤한 문자열
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        paranoid: true,
        modelName: 'Domain',
        tableName: 'domains',
      }
    );
  }
  static associate(db) {
    db.Domain.belongsTo(db.User);
  }
};
