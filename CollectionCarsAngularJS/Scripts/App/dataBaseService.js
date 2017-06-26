

angular.module('CollectionCarsAppDB', ['CollectionCarsApp'])
  .service('DataBaseService', ['$http', function ($http) {
      // Add Car
      this.AddCarItem = function (car) {
          var response = $http({
              method: "post",
              url: "/cars/AddCar",
              data: JSON.stringify(car),
              dataType: "json"
          });
          return response;
      }

      this.GetCarItem = function (carID) {
          var response = $http({
              method: "get",
              url: "/cars/GetCarByNo",
              params: {
                  id: JSON.stringify(carID)
              }
          });
          return response;
      }

      // Update Car 
      this.UpdateCarItem = function (car) {
          var response = $http({
              method: "post",
              url: "/cars/UpdateCar",
              data: JSON.stringify(car),
              dataType: "json"
          });
          return response;
      }

      //Delete Car
      this.DeleteCarItem = function (car) {
          var response = $http({
              method: "post",
              url: "/cars/DelCar",
              data: JSON.stringify(car),
              dataType: "json"
          });
          return response;
      }

      this.GetTotalItems = function (search) {
          var response = $http({
              method: "get",
              url: "/cars/GetTotalItems",
              params: {
                  search: search
              }
          });
          return response;
      }      
  }]);
