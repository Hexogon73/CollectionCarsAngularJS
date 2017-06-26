'use strict';
angular.module('CollectionCarsAppTR', ['ngResource', 'ngTable', 'ui.bootstrap', 'pascalprecht.translate']).config(['$translateProvider', function ($translateProvider) {
    // add translation table
    var translations = {
        Title: 'All Car',
        BUTTON_TEXT_EN: 'Eng',
        BUTTON_TEXT_RU: 'Рус',
        Clear: 'Clear',
        Name: 'Name',
        Class: 'Class',
        Manufacturer: 'Manufacturer',
        Save: 'Save',
        Cancel: 'Cancel',
        Search: 'Search',
        Action: 'Action',
        Edit: 'Edit',
        Delete: 'Delete',
        First: 'First',
        Last: 'Last',
        Next: 'Next',
        Previous: 'Previous',
        AddCar: 'Add Car',
        Car: 'Car'
    };
    var translations2 = {
        Title: 'Автомобили',
        BUTTON_TEXT_EN: 'Eng',
        BUTTON_TEXT_RU: 'Рус',
        Clear: 'Очистить',
        Name: 'Название',
        Class: 'Класс',
        Manufacturer: 'Производитель',
        Save: 'Сохранить',
        Cancel: 'Отмена',
        Search: 'Поиск',
        Action: 'Действия',
        Edit: 'Редактировать',
        Delete: 'Удалить',
        First: 'Первая',
        Last: 'Последняя',
        Next: 'Следующая',
        Previous: 'Предыдущая',
        AddCar: 'Добавить автомобиль',
        Car: 'Автомобиль'
    };
    $translateProvider
      .translations('en', translations)
        .translations('ru', translations2)
      .preferredLanguage('en');
}]).config(['uibPaginationConfig',
                                           function (uibPaginationConfig) {
                                               uibPaginationConfig.previousText = "‹";
                                               uibPaginationConfig.nextText = "›";
                                               uibPaginationConfig.firstText = "«";
                                               uibPaginationConfig.lastText = "»";
                                           }]);;