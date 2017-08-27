var Game = Tetris.Game;
// shim layer with setTimeout fallback
var requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();
(function () {
    "use strict";
    function init() {
        var game = new Game();
    }
    window.addEventListener('DOMContentLoaded', init, false);
})();
//# sourceMappingURL=app.js.map