angular.module('gamebox', [])

.run(function ($rootScope) {
    $rootScope.turn = 'red';
})

.factory('Hackenbush', function ($rootScope) {

    function Hackenbush(width, height, lines) {
        this.lines = lines;
        this.width = width;
        this.height = height;
        this.floorY = height - 20;
        this.cacheVertices();
    }

    Hackenbush.prototype = {

        tpl: 'hackenbush.html',

        cacheVertices: function () {
            var verts = [], sverts = [];
            for (var i = this.lines.length; i-- > 0;) {
                var line = this.lines[i];
                var point = [line.x1, line.y1].join();
                if (sverts.indexOf(point) < 0) {
                    sverts.push(point);
                    verts.push([line.x1, line.y1]);
                }
                point = [line.x2, line.y2].join();
                if (sverts.indexOf(point) < 0) {
                    sverts.push(point);
                    verts.push([line.x2, line.y2]);
                }
            }
            this.verts = verts;
        },

        strike: function (line) {
            line.gone = true;
            this.strikeFloating();
            $rootScope.turn = $rootScope.turn == 'red' ? 'blue' : 'red';
            this.checkWin();
        },

        strikeFloating: function () {
            var heldPoints = [], traversalDone = false;
            while (true) {
                var prevHeld = heldPoints.length;
                for (var i = this.lines.length; i-- > 0;) {
                    var line = this.lines[i];
                    var a = [line.x1, line.y1].join(), b = [line.x2, line.y2].join();
                    if (line.gone) {
                        continue;
                    } else if (line.y1 == this.floorY || line.y2 == this.floorY) {
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
        },

        checkWin: function () {
            for (var i = this.lines.length; i-- > 0;) {
                var line = this.lines[i];
                if (!line.gone && (line.color == $rootScope.turn || line.color == 'green'))
                    return;
            }
            $scope.winner = $scope.turn == 'red' ? 'blue' : 'red';
        }

    };

    return Hackenbush;
})

.controller('MainCtrl', function ($scope, Hackenbush) {
    $scope.games = [
        new Hackenbush(800, 250, [
            {x1: 150, y1: 230, x2: 200, y2: 130, color: 'red'},
            {x1: 250, y1: 230, x2: 200, y2: 130, color: 'red'},
            {x1: 150, y1: 70, x2: 200, y2: 130, color: 'blue'},
            {x1: 500, y1: 130, x2: 200, y2: 130, color: 'blue'},
            {x1: 450, y1: 230, x2: 500, y2: 130, color: 'blue'},
            {x1: 550, y1: 230, x2: 500, y2: 130, color: 'blue'},
            {x1: 600, y1: 20, x2: 500, y2: 130, color: 'red'},
            {x1: 600, y1: 20, x2: 650, y2: 50, color: 'green'}
        ])
    ];
});
