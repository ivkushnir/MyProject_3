'use strict';

/* Controllers */

var fsApp = angular.module('fsApp', [
    'ngRoute',
    'fsControllers',
    'fsFilters'

]);

var fsControllers = angular.module('fsControllers', []);

//fsControllers.controller('AuthenController', ['$scope','$http','UserStorage',
//    function ($scope, $http, UserStorage) {
//        //наш склад всех строк - сообщений.
//        $scope.auth = UserStorage.auth;
//
//        $scope.UserAuth = function(UserName, PassWord){
//
//        }
//    }])
//    .service('UserStorage', function () {
//        this.auth = {
//            username: 'student',
//            password: 'studstud'
//        };
//    });


//var MainPath = 'http://127.0.0.1:8000/C://';
//var MainPath = 'http://localhost:8000/C://';

fsControllers.controller('MyFormController', ['$scope', '$http', 'mesStorage',

    function ($scope, $http, mesStorage) {
        //storage with all messages.
        $scope.message = mesStorage.message;

        $scope.MainList = function (field_ip, field_port) {

            var serv_address = 'http://' + field_ip + ':' + field_port + '/';

            var url1 = serv_address + $scope.message.get_dir_cont1;
            var url2 = serv_address + $scope.message.get_dir_cont2;
            //query from 1 window: serv_address/GetDirContent1/C
            //query from 2 window: serv_address/GetDirContent2/C
            var url_disk1 = url1 + $scope.message.disk;
            var url_disk2 = url2 + $scope.message.disk;


            $http.get(url_disk1).success(function (data) {
                $scope.docs1 = data;
                $scope.url1 = url1;
                //output in field of current address
                $scope.visualpath1 = $scope.message.root;

            }).error(function (data, status) {
                $scope.docs1 = $scope.message.err;
            });


            $http.get(url_disk2).success(function (data) {
                $scope.docs2 = data;
                $scope.url2 = url2;
                $scope.visualpath2 = $scope.message.root;

            }).error(function (data, status) {
                $scope.docs2 = $scope.message.err;
            });
        }

        $scope.NewList1 = function (doc) {
            //query: serv_address/GetDirContent1/dir_name
            var url_dir1 = $scope.url1 + doc.name;

            $http.get(url_dir1).success(function (data) {
                $scope.docs1 = data;
                $scope.visualpath1 = $scope.visualpath1 + doc.name + '/';

            }).error(function (data, status) {
                $scope.docs1 = $scope.message.err;
            });
        }

        $scope.NewList2 = function (doc) {

            var url_dir2 = $scope.url2 + doc.name;

            $http.get(url_dir2).success(function (data) {
                $scope.docs2 = data;
                $scope.visualpath2 = $scope.visualpath2 + doc.name + '/';

            }).error(function (data, status) {
                $scope.docs2 = $scope.message.err;
            });
        }

        $scope.PreviousList1 = function () {

            //query: serv_address/GetDirContent1/{parent-dir}
            var url_prev_dir1 = $scope.url1 + $scope.message.parent_dir;

            $http.get(url_prev_dir1).success(function (data) {
                $scope.docs1 = data;

                //if we in the root then visualpath1 = //
                if ($scope.visualpath1 == $scope.message.root) $scope.visualpath1 = $scope.message.root;
                else {
                    var path0 = $scope.visualpath1.substring(0, $scope.visualpath1.length - 1);
                    var i = path0.lastIndexOf('/');
                    $scope.visualpath1 = path0.substring(0, i + 1);
                }
            }).error(function (data, status) {
                $scope.docs1 = $scope.message.err;
            });

        }

        $scope.PreviousList2 = function () {

            var url_prev_dir2 = $scope.url2 + $scope.message.parent_dir;

            $http.get(url_prev_dir2).success(function (data) {
                $scope.docs2 = data;


                if ($scope.visualpath2 == $scope.message.root) $scope.visualpath2 = $scope.message.root;
                else {
                    var path0 = $scope.visualpath2.substring(0, $scope.visualpath2.length - 1);
                    var i = path0.lastIndexOf('/');
                    $scope.visualpath2 = path0.substring(0, i + 1);
                }
            }).error(function (data, status) {
                $scope.docs2 = $scope.message.err;
            });

        }


    }])
    .service('mesStorage', function () {

        this.message = {
            ip: '127.0.0.1',
            port: '8000',

            get_dir_cont1: 'GetDirContent1/',
            get_dir_cont2: 'GetDirContent2/',
            parent_dir: '{parent-dir}',
            disk: 'C',
            root: '//',
            err: 'Request failed'
        };
    });

