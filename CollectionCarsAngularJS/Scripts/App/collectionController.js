'use strict';
var angmod = angular.module('CollectionCarsApp', ['CollectionCarsAppDB', 'CollectionCarsAppTR']);
angmod.controller('CollectionController', ['$scope', '$resource', '$translate', 'DataBaseService', function ($scope, $resource, $translate, DataBaseService) {
    var _cntrl = this;
    _cntrl.setPage = _setPage;
    _cntrl.pageChanged = _pageChanged;
    _cntrl.AddUpdateCar = _AddUpdateCar;
    _cntrl.EditCarItem = _EditCarItem;
    _cntrl.AddCarDiv = _AddCarDiv;
    _cntrl.CancelAddCarDiv = _CancelAddCarDiv;
    _cntrl.DeleteCar = _DeleteCar;
    _cntrl.refreshData = _refreshData;
    _cntrl.enterSearch = _enterSearch;
    _cntrl.cancelSearch = _cancelSearch;

    _cntrl.divCar = false;
    _cntrl.buttonAddCar = true;
    _cntrl.currentPage = 1;
    _cntrl.numPerPage = 5;
    _cntrl.statusSort = false;
    _getTotalItems();
    _cntrl.sortName = "id";
    _RefreshData("id", 1);

    //Смена языка
    _cntrl.changeLanguage = function (langKey) {
        $translate.use(langKey);
        _cntrl.currentLang = langKey;
        if (_cntrl.currentLang == 'ru') {
            if (_cntrl.Action == 'Add') {
                _cntrl.Action2 = "Добавление";
            }
            else {
                _cntrl.Action2 = "Обновление";
            }
        }
        else {
            _cntrl.Action2 = _cntrl.Action;
        }
    };

    function _getTotalItems(sortName, numberPage, statusSort, search) {
        var getData = DataBaseService.GetTotalItems(search);
        getData.then(function (param) {
            _cntrl.totalItems = param.data;
            _RefreshData(sortName, numberPage, statusSort, search);
        },
        function () {
            _cntrl.totalItems = 1;
            _RefreshData();
        });
    }

    function _setPage(pageNo) {
        _cntrl.currentPage = pageNo;
    };

    function _pageChanged() {
        _RefreshData(_cntrl.sortName, _cntrl.currentPage, _cntrl.statusSort, _cntrl.search)
    };

    //метод добавления или обновления автомобиля
    function _AddUpdateCar() {
        var Car = {
            Name: _cntrl.carName,
            Class: _cntrl.carClass,
            Manufacturer: _cntrl.carManufacturer
        };
        var getAction = _cntrl.Action;

        if (getAction == "Update") {
            Car.Id = _cntrl.carId;
            var getData = DataBaseService.UpdateCarItem(Car);
            getData.then(function (msg) {
                alert(msg.data);
                _cntrl.divCar = false;
                _cntrl.buttonAddCar = true;
                _RefreshData(_cntrl.sortName, _cntrl.currentPage, _cntrl.statusSort, _cntrl.search);
            }, function () {
                alert('Error in updating record');
            });
        }
        else {
            var getData = DataBaseService.AddCarItem(Car);
            getData.then(function (msg) {
                alert(msg.data);
                _cntrl.divCar = false;
                _cntrl.buttonAddCar = true;
                _getTotalItems();
                _cntrl.setPage(1);
            }, function () {
                alert('Error in adding record');
            });
        }
    }

    //редактирование автомобиля
    function _EditCarItem(car) {
        var getData = DataBaseService.GetCarItem(car.Id);
        getData.then(function (carItem) {
            _cntrl.car = carItem.data;
            _cntrl.carId = car.Id;
            _cntrl.carName = car.Name;
            _cntrl.carClass = car.Class;
            _cntrl.carManufacturer = car.Manufacturer;
            _cntrl.Action = "Update";
            if (_cntrl.currentLang == 'ru') {
                _cntrl.Action2 = "Обновление";
            }
            else {
                _cntrl.Action2 = "Update";
            }
            _cntrl.divCar = true;
            _cntrl.buttonAddCar = false;
        },
        function () {
            alert('Error in getting records');
        });
    }

    function _AddCarDiv() {
        _cntrl.buttonAddCar = false;
        _ClearFields();
        _cntrl.Action = "Add";
        if (_cntrl.currentLang == 'ru') {
            _cntrl.Action2 = "Добавление";
        }
        else {
            _cntrl.Action2 = "Add";
        }
        _cntrl.divCar = true;
    }

    //кнопка "Отмена"
    function _CancelAddCarDiv() {
        _ClearFields();
        _cntrl.buttonAddCar = true;
        _cntrl.divCar = false;
    }

    function _ClearFields() {
        _cntrl.carId = "";
        _cntrl.carName = "";
        _cntrl.carClass = "";
        _cntrl.carManufacturer = "";
    }

    function _DeleteCar(car) {
        var getData = DataBaseService.DeleteCarItem(car);
        getData.then(function (msg) {
            alert('Car Deleted');
            _getTotalItems();
            _cntrl.setPage(1);
        }, function () {
            alert('Error in Deleting Record');
        });
    }

    //обновление таблицы
    function _RefreshData(sortName, numberPage, statusSort, search) {
        //источник данных таблицы
        _cntrl.allCars = _GetCurrentList(sortName, numberPage, statusSort, search);
    }

    //получение записей всех корбалей с фильтрацией по параметрам
    function _GetCurrentList(sortName, numberPage, statusSort, search) {
        return $resource('/cars/cars').query({ sort: sortName, numberPage: numberPage, statusSort: statusSort, search: search });
    }

    //метод для сортировки по полям таблицы
    function _refreshData(sortName) {
        if (sortName == _cntrl.sortNamePrev) {
            _cntrl.statusSort = !_cntrl.statusSort;
            _cntrl.reverse = !_cntrl.reverse;
        }
        else {
            _cntrl.statusSort = false;
            _cntrl.reverse = false;
        }
        _cntrl.sortName = sortName;
        _cntrl.sortKey = sortName;
        _cntrl.sortNamePrev = sortName;
        _RefreshData(sortName, _cntrl.currentPage, _cntrl.statusSort, _cntrl.search);
    }

    //метод для поиска по записям
    function _enterSearch(keyEvent) {
        if (keyEvent.which === 13) {
            _getTotalItems(_cntrl.sortName, 1, _cntrl.statusSort, _cntrl.search);
        }
    }

    //сброс поиска по записям
    function _cancelSearch(keyEvent) {
        _cntrl.search = "";
        _getTotalItems(_cntrl.sortName, 1, _cntrl.statusSort, _cntrl.search);
        _cntrl.setPage(1);
    }
}]);