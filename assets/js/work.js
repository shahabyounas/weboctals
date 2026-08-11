/* Job filter for the projects gallery.
 *
 * Progressive enhancement only: with JS off every tile is visible and the
 * filter bar is hidden, so the page never depends on this running.
 */
(function () {
    'use strict';

    var bar = document.getElementById('wk-filters');
    var grid = document.getElementById('wk-grid');
    if (!bar || !grid) return;

    bar.hidden = false;

    var buttons = Array.prototype.slice.call(bar.querySelectorAll('.wk-filter'));
    var tiles = Array.prototype.slice.call(grid.querySelectorAll('.wk-tile'));
    var count = document.getElementById('wk-count');
    var empty = document.getElementById('wk-empty');

    function apply(job) {
        var shown = 0;

        tiles.forEach(function (tile) {
            var match = job === 'all' || tile.dataset.job === job;
            tile.hidden = !match;
            if (match) shown++;
        });

        if (count) {
            count.textContent =
                shown + (shown === 1 ? ' project' : ' projects') +
                (job === 'all' ? '' : ' — ' + job);
        }
        if (empty) empty.hidden = shown !== 0;
    }

    buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            buttons.forEach(function (b) {
                b.setAttribute('aria-pressed', String(b === btn));
            });
            apply(btn.dataset.job);
        });
    });

    apply('all');
})();
