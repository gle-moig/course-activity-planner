var controllers = angular.module('app.controllers.Index', ['ngFileUpload']);

controllers.controller('Index', function($scope, $http, Upload) {
    $scope.alerts = [];
    $scope.closeAlert = function(index) {
       $scope.alerts.splice(index, 1);
    };

    $scope.submit = function() {
      if ($scope.form.file.$valid && $scope.file) {
        $scope.upload($scope.file);
      }
    };

    $scope.upload = function(file) {
      delete $scope.uploadSuccess;

      Upload.upload({
          url: 'http://localhost:5000/api/planning',
          data: {file: file, 'ics_url': $scope.ics_url}
      }).progress(function (evt) {
          $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
      }).success(function (data, status, headers, config) {
          if (data.planning) {
            var alert = {
                msg: 'Planning created with uuid ' + data.planning.uuid,
                type: 'success'};
            $scope.alerts.push(alert);
            delete $scope.file;
          }else {
            $scope.alerts.push({msg: 'An error occurred while uploading your file.', type: 'danger'});
          }
          delete $scope.progress;
      }).error(function (data, status, headers, config) {
          if (status == 413) {
              $scope.alerts.push({msg: 'Your file is too big !', type: 'danger'});
          } else {
              $scope.alerts.push({msg: 'An error occurred while uploading your file.', type: 'danger'});
          }
          delete $scope.file;
          delete $scope.progress;
      });
  }

});
