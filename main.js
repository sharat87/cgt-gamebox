angular.module('gamebox', [])

.run(function ($rootScope) {
    $rootScope.turn = 'red';
})

.factory('Hackenbush', function ($rootScope) {

    function Hackenbush(game) {
        // `game` is {width: ..., height: ..., verts: ..., lines: ...}
        angular.extend(this, game);
        this.compileLines();
    }

    Hackenbush.prototype = {

        tpl: 'hackenbush.html',

        // Builds a `clines` array using `verts` and `lines` which can be easily
        // used by the template to render the game.
        compileLines: function () {
            this.clines = [];
            for (var i = this.lines.length; i-- > 0;) {
                var line = this.lines[i];
                this.clines.push({
                    x1: this.verts[line.from].x,
                    y1: this.verts[line.from].y,
                    x2: this.verts[line.to].x,
                    y2: this.verts[line.to].y,
                    color: line.color
                });
            }
        },

        strike: function (line) {
            if (line.color != $rootScope.turn) return;
            line.gone = true;
            this.strikeFloating();
            $rootScope.turn = $rootScope.turn == 'red' ? 'blue' : 'red';
            this.checkWin();
        },

        strikeFloating: function () {
            var heldPoints = [], traversalDone = false;
            while (true) {
                var prevHeld = heldPoints.length;
                for (var i = this.clines.length; i-- > 0;) {
                    var line = this.clines[i];
                    var a = [line.x1, line.y1].join(), b = [line.x2, line.y2].join();
                    if (line.gone) {
                        continue;
                    } else if (line.y1 === 0 || line.y2 === 0) {
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
            for (var i = this.clines.length; i-- > 0;) {
                var line = this.clines[i];
                if (!line.gone && (line.color == $rootScope.turn || line.color == 'green'))
                    return;
            }
            $rootScope.winner = $rootScope.turn == 'red' ? 'blue' : 'red';
        }

    };

    /**
     * Verts are x-y points, with the coordinate system translated to have the
     * origin at the left end of the ground and positive y going upwards.
     */
    var games = {
        horse: {
            width: 800,
            height: 250,
            verts: {
                a: {x: 150, y: 0},
                b: {x: 200, y: 100},
                c: {x: 250, y: 0},
                d: {x: 150, y: 160},
                e: {x: 500, y: 100},
                f: {x: 450, y: 0},
                g: {x: 550, y: 0},
                h: {x: 600, y: 210},
                i: {x: 650, y: 180}
            },
            lines: [
                {from: 'a', to: 'b', color: 'red'},
                {from: 'c', to: 'b', color: 'red'},
                {from: 'd', to: 'b', color: 'blue'},
                {from: 'e', to: 'b', color: 'blue'},
                {from: 'e', to: 'f', color: 'blue'},
                {from: 'e', to: 'g', color: 'blue'},
                {from: 'e', to: 'h', color: 'blue'},
                {from: 'i', to: 'h', color: 'blue'}
            ]
        }
    };

    Hackenbush.getGame = function (name) {
        return new Hackenbush(games[name]);
    };

    return Hackenbush;
})

.controller('MainCtrl', function ($scope, Hackenbush) {
    $scope.games = [
        Hackenbush.getGame('horse')
    ];
});
