'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    //adicionando uma coluna
    return queryInterface.addColumn(
      'users', //tabela que vai ser adicionada a coluna
      'avatar_id', //coluna que vai ser adicionada a coluna
      //informacoes da coluna
      {
        type: Sequelize.INTEGER,
        references: { model: 'files', key: 'id'}, //informando a tabela e a chave
        onUpdate: 'CASCADE', //se a imagem for alterada  na outra tabela, altera aqui tambem
        onDelete: 'SET NULL', //se a imagem for deletada na outra tabela seta NULL nessa tabela
        allowNull: true, //forçando o allowNull, por padrão ja é null
      },
    );
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('users', 'avatar_id');
  }
};
