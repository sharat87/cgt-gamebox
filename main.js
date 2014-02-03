angular.module('gamebox', [])

.controller('MainCtrl', function ($scope) {
    $scope.width = 800;
    $scope.height = 400;

    $scope.turn = 'red';

    $scope.$watch('height', function (height) {
        $scope.floorY = height - 20;
    });

    $scope.bush = [
        {x1: 150, y1: 380, x2: 200, y2: 280, color: 'red'},
        {x1: 250, y1: 380, x2: 200, y2: 280, color: 'red'},
        {x1: 150, y1: 220, x2: 200, y2: 280, color: 'blue'},
        {x1: 500, y1: 280, x2: 200, y2: 280, color: 'blue'},
        {x1: 450, y1: 380, x2: 500, y2: 280, color: 'blue'},
        {x1: 550, y1: 380, x2: 500, y2: 280, color: 'blue'},
        {x1: 600, y1: 170, x2: 500, y2: 280, color: 'red'},
        {x1: 600, y1: 170, x2: 650, y2: 200, color: 'green'}
    ];

    $scope.$watch('bush', function () {
        var points = [], spoints = [];
        for (var i = $scope.bush.length; i-- > 0;) {
            var line = $scope.bush[i];
            var point = [line.x1, line.y1].join();
            if (spoints.indexOf(point) < 0) {
                spoints.push(point);
                points.push([line.x1, line.y1]);
            }
            point = [line.x2, line.y2].join();
            if (spoints.indexOf(point) < 0) {
                spoints.push(point);
                points.push([line.x2, line.y2]);
            }
        }
        $scope.points = points;
    }, true);

    $scope.strike = function (line) {
        line.striked = true;
        line.gone = true;
        floatDisconnected();
        $scope.turn = $scope.turn == 'red' ? 'blue' : 'red';
        checkWin();
    };

    function floatDisconnected() {
        var heldPoints = [], traversalDone = false;
        while (true) {
            var prevHeld = heldPoints.length;
            for (var i = $scope.bush.length; i-- > 0;) {
                var line = $scope.bush[i];
                var a = [line.x1, line.y1].join(), b = [line.x2, line.y2].join();
                if (line.gone) {
                    continue;
                } else if (line.y1 == $scope.floorY || line.y2 == $scope.floorY) {
                    if (heldPoints.indexOf(a) < 0)
                        heldPoints.push(a);
                    if (heldPoints.indexOf(b) < 0)
                        heldPoints.push(b);
                } else if (heldPoints.indexOf(a) >= 0) {
                    if (heldPoints.indexOf(b) < 0)
                        heldPoints.push(b);
                } else if (heldPoints.indexOf(b) >= 0) {
                    if (heldPoints.indexOf(a) < 0)
                        heldPoints.push(a);
                } else if (traversalDone) {
                    line.gone = true;
                }
            }
            if (traversalDone)
                break;
            if (prevHeld == heldPoints.length)
                traversalDone = true;
        }
    }

    function checkWin() {
        for (var i = $scope.bush.length; i-- > 0;) {
            var line = $scope.bush[i];
            if (!line.gone && (line.color == $scope.turn || line.color == 'green'))
                return;
        }
        $scope.winner = $scope.turn == 'red' ? 'blue' : 'red';
    }
});
