var app = angular.module('starter.controllers', [])

app.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function() {
        $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
        console.log('Doing login', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function() {
            $scope.closeLogin();
        }, 1000);
    };
})



app.controller('PlaylistsCtrl', function($scope, $cordovaCapture, videosFactory) {

    var positions = {},
        videoMarkers = [],
        nextVideo = [],
        idFirstVideo = '',
        idFacebook,
        serverURL = "http://10.35.1.27";

    $scope.$on('positions', function(event, pos) {
        positions = pos;
    });


    $scope.$on('idFirstVideo', function(event, idFirst) {
        idFirstVideo = idFirst;
    });

    $scope.$on('fbID', function(event, fbID) {
        idFacebook = fbID;
    })


    $scope.$on('setVideo', function(event, nearestVideo) {
        var video = document.querySelector('#video');
        video.setAttribute("src", serverURL + ":8888/CadExq/App/node/uploads/" + nearestVideo.fileName);
        video.load();
    });

    $scope.$on('showVideo', function(event, nearestVideo) {
        google.maps.event.addListener(nearestVideo, 'click', function() {
            video.classList.toggle('hidden');
            video.play();
            video.onended = function(e) {
                video.classList.toggle('hidden');
            }
        });
    });

    // Capture video
    $scope.captureVideo = function() {
        // Upload files to server
        function uploadFile(mediaFile) {
            var ft = new FileTransfer(),
                path = mediaFile.fullPath,
                options = new FileUploadOptions();

            options.fileKey = "file";
            options.fileName = 'filename.mp4'; // We will use the name auto-generated by Node at the server side.
            options.mimeType = "video/mp4";
            options.chunkedMode = false;
            options.params = { // Whatever you populate options.params with, will be available in req.body at the server-side.
                "lat": positions.lat,
                "lng": positions.lng,
                "date": new Date().getTime(),
                "idFirstVideo": idFirstVideo,
                "idFacebook": idFacebook
            };

            ft.upload(path, serverURL + ":3000/video",
                function(result) {
                    console.log('Upload success: ' + result.responseCode);
                    console.log(result.bytesSent + ' bytes sent');
                    idFirstVideo = '';
                    videosFactory.addVideo(result);
                },
                function(error) {
                    console.log('Error uploading file ' + path + ': ' + error.code);
                },
                options);
        }

        // capture callback
        var captureSuccess = function(mediaFiles) {
            var i, path, len;
            for (i = 0, len = mediaFiles.length; i < len; i += 1) {
                path = mediaFiles[i].fullPath;
                uploadFile(mediaFiles[i]);
            }
        };

        // capture error callback
        var captureError = function(error) {
            navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
        };

        // start video capture
        navigator.device.capture.captureVideo(captureSuccess, captureError, {
            limit: 10,
            duration: 10
        });

    }




    // Continue video
    $scope.continueVideo = function() {

        // Upload files to server
        function uploadFile(mediaFile) {
            var ft = new FileTransfer(),
                path = mediaFile.fullPath,
                options = new FileUploadOptions();

            options.fileKey = "file";
            options.fileName = 'filename.mp4'; // We will use the name auto-generated by Node at the server side.
            options.mimeType = "video/mp4";
            options.chunkedMode = false;
            options.params = { // Whatever you populate options.params with, will be available in req.body at the server-side.
                "date": new Date().getTime(),
                "idFirstVideo": idFirstVideo,
                "idFacebook": idFacebook

            };

            ft.upload(path, serverURL + ":3000/video",
                function(result) {
                    console.log('Upload success: ' + result.responseCode);
                    console.log(result.bytesSent + ' bytes sent');
                    idFirstVideo = '';
                    videosFactory.addVideo(result);

                },
                function(error) {
                    console.log('Error uploading file ' + path + ': ' + error.code);
                },
                options);
        }

        // capture callback
        var captureSuccess = function(mediaFiles) {
            var i, path, len;
            for (i = 0, len = mediaFiles.length; i < len; i += 1) {
                path = mediaFiles[i].fullPath;
                uploadFile(mediaFiles[i]);
            }
        };

        // capture error callback
        var captureError = function(error) {
            navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
        };

        // start video capture
        navigator.device.capture.captureVideo(captureSuccess, captureError, {
            limit: 10,
            duration: 10
        });

    }

})