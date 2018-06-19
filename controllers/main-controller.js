
var MainController = function($timeout,$http) {
    var vm = this;
    vm.input = {};
  //  "./mockData/MOCK_DATA.json"
    $http({
        method: 'GET',
        url: "./mockData/MOCK_DATA.json"
     }).then(function (response){
         vm.users = response.data.users;
  
     },function (error){
  
     });
    vm.addItem = function (item) {
       vm.message = "I am a onblur"
       $timeout(()=>{
           vm.message = "";
       },2500)
    }

}

MainController.$inject = ["$timeout","$http"];
angular.module('app').controller("MainController", MainController);
