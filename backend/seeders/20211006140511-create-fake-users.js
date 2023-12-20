'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
     await queryInterface.bulkInsert('users', [{
      uuid: "b394be64-1a18-4336-b30a-678590f7ac2e",
      firstname: "Bob",
      lastname: "L'éponge",
      email: "bob@test.fr",
      password: "$2b$10$llPO9rP/R4ckMRLFwAW2teaP0s7xCVs/v301zfbdCM6ekG7AUwHLG",
      avatar: "",
      couverture: "",
      bio: null,
      isAdmin: false,
      isConnected: false,
      connectedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
     },{
      uuid: "b394be64-1a18-4336-b30a-678600f7ac2e",
      firstname: "Patrick",
      lastname: "L'étoile de mer",
      email: "pat@test.fr",
      password: "$2b$10$llPO9rP/R4ckMRLFwAW2teaP0s7xCVs/v301zfbdCM6ekG7AUwHLG",
      avatar: "",
      couverture: "",
      bio: null,
      isAdmin: false,
      isConnected: false,
      connectedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
     },{
      uuid: "b394be64-1a18-4336-b3at-678600f7ac2e",
      firstname: "Admin",
      lastname: "admine",
      email: "admin@test.fr",
      password: "$2b$10$llPO9rP/R4ckMRLFwAW2teaP0s7xCVs/v301zfbdCM6ekG7AUwHLG",
      avatar: "",
      couverture: "",
      bio: null,
      isAdmin: true,
      isConnected: false,
      connectedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
     }], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     await queryInterface.bulkDelete('users', null, {});
  }
};
