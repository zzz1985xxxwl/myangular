'use strict';
define(['./module'], function (module) {
  module.service('Book', function () {
    return {
      books: [
        {title: "Magician", author: "Raymond E. Feist"},
        {title: "The Hobbit", author: "J.R.R Tolkien"}
      ]
    }
  });
});

