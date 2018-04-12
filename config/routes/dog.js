'use strict';
const DogController =  require('../../src/controllers/dog');

module.exports = [
    { method: 'GET', path: '/dogs', handler: DogController.list },
    { method: 'GET', path: '/dogs/{id}', handler: DogController.get },
    { method: 'POST', path: '/dogs/{id}', handler: DogController.update },
    { method: 'DELETE', path: '/dogs/{id}', handler: DogController.remove }
];

// server.route({
//     method: 'GET',
//     path: '/dogs',
//     handler: DogController.list
//   });
  
//   server.route({
//     method: 'GET',
//     path: '/dogs/{id}',
//     handler: DogController.get
//   });
//   server.route({
//     method: 'POST',
//     path: '/dogs',
//     handler: DogController.create
//   });
  
//   server.route({
//     method: 'PUT',
//     path: '/dogs/{id}',
//     handler: DogController.update
//   });
  
//   server.route({
//     method: 'DELETE',
//     path: '/dogs/{id}',
//     handler: DogController.remove
//   });