// notesView.js
(function (angular) {

  var theModule = angular.module("notesView", ["ui.bootstrap"]);

  theModule.controller("notesViewController",
    ["$scope", "$window", "$http",
      function ($scope, $window, $http) {
        $scope.notes = [];
        $scope.newNote = createBlankNote();

        // Get the category name
        var urlParts = $window.location.pathname.split("/");
        var categoryName = urlParts[urlParts.length - 1];

        var notesUrl = "/api/notes/" + categoryName;
        $http.get(notesUrl)
          .then(function (result) {
            // success
            $scope.notes = result.data;
          }, function (err) {
            // Error
            alert(err);
          });

        var socket = io.connect();
        //socket.on("showThis", function (msg) {
        //  alert(msg);
        //});

        socket.emit("join category", categoryName);

        socket.on("broadcast note", function (note) {
          $scope.notes.push(note);
          $scope.$apply();
        });


        $scope.save = function () {

          $http.post(notesUrl, $scope.newNote)
            .then(function (result) {
              // success
              $scope.notes.push(result.data);
              $scope.newNote = createBlankNote();
              socket.emit("newNote", { category: categoryName, note: result.data });
            }, function (err) {
              // failure
              // TODO
            });

        };

      }
    ]);

    function createBlankNote() {
      return {
        note: "",
        color: "yellow"
      };
    }

})(window.angular);