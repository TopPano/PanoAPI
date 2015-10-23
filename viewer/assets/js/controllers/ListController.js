'use strict';

var dependencies = ['$scope'];

function ListController($scope) {
  $scope.name = 'Ike';
  $scope.list = [
    {title: '商辦中心',src: '../images/list-image/0.jpg', panoID: '00000000'},
    {title: '教堂',src: '../images/list-image/1.jpg', panoID: '00000001'},
    {title: '台大舊體',src: '../images/list-image/2.jpg', panoID: '00000002'},
    {title: '日出',src: '../images/list-image/3.jpg', panoID: '00000003'},
    {title: '海洋',src: '../images/list-image/4.jpg', panoID: '00000004'}
  ];
  $scope.change = function(ID) {
    test.change2Scene(ID);
  };

}

module.exports = dependencies.concat([ListController]);
