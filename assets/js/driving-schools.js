/* Week grid for the driving schools page.
 *
 * Renders an instructor's week as a grid of hour slots and lets the reader
 * flip between the diary as it typically looks and the same diary with
 * weekday-daytime gaps filled. Every money figure on screen is derived from
 * the hourly rate the reader types in — nothing here asserts a rate, a
 * revenue figure, or an outcome on anyone's behalf.
 */
(function () {
    'use strict';

    var grid = document.getElementById('ds-week-grid');
    if (!grid) return;

    var DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var FIRST_HOUR = 9;
    var LAST_HOUR = 19;

    // 'B' = already booked, '+' = a weekday-daytime slot the "filled" view
    // adds, '.' = stays empty. One string per day, one char per hour.
    var WEEK = {
        Mon: '..B+...BBBB',
        Tue: '.B++...BBB.',
        Wed: '..B+..+BBBB',
        Thu: '..+....BBBB',
        Fri: '..B..B.BBB.',
        Sat: 'BBBBBB.BB..'
    };

    var WORKING_WEEKS = 46;

    var rateInput = document.getElementById('ds-rate');
    var buttons = Array.prototype.slice.call(
        document.querySelectorAll('[data-week-view]')
    );
    var out = {
        booked: document.getElementById('ds-out-booked'),
        empty: document.getElementById('ds-out-empty'),
        value: document.getElementById('ds-out-value'),
        valueLabel: document.getElementById('ds-out-value-label')
    };

    var view = 'now';

    function hourLabel(h) {
        return (h < 10 ? '0' + h : h) + ':00';
    }

    function build() {
        var frag = document.createDocumentFragment();

        var corner = document.createElement('div');
        corner.setAttribute('aria-hidden', 'true');
        frag.appendChild(corner);

        DAYS.forEach(function (d) {
            var cell = document.createElement('div');
            cell.className = 'ds-grid-day';
            cell.textContent = d;
            frag.appendChild(cell);
        });

        for (var h = FIRST_HOUR; h <= LAST_HOUR; h++) {
            var label = document.createElement('div');
            label.className = 'ds-grid-hour';
            label.textContent = hourLabel(h);
            frag.appendChild(label);

            for (var i = 0; i < DAYS.length; i++) {
                var slot = document.createElement('div');
                slot.className = 'ds-slot';
                slot.dataset.day = DAYS[i];
                slot.dataset.hour = String(h);
                slot.dataset.code = WEEK[DAYS[i]].charAt(h - FIRST_HOUR);
                frag.appendChild(slot);
            }
        }

        grid.appendChild(frag);
    }

    function money(n) {
        return '£' + Math.round(n).toLocaleString('en-GB');
    }

    function render() {
        var slots = grid.querySelectorAll('.ds-slot');
        var booked = 0;
        var added = 0;

        Array.prototype.forEach.call(slots, function (slot) {
            var code = slot.dataset.code;
            var state = 'empty';

            if (code === 'B') {
                state = 'booked';
                booked++;
            } else if (code === '+' && view === 'filled') {
                state = 'added';
                added++;
            }

            slot.dataset.state = state;
            slot.setAttribute(
                'aria-label',
                slot.dataset.day +
                    ' ' +
                    hourLabel(Number(slot.dataset.hour)) +
                    ' — ' +
                    (state === 'empty' ? 'free' : 'teaching')
            );
        });

        var total = DAYS.length * (LAST_HOUR - FIRST_HOUR + 1);
        var taught = booked + added;
        var rate = Math.max(0, Number(rateInput && rateInput.value) || 0);

        out.booked.textContent = taught;
        out.empty.textContent = total - taught;

        if (view === 'filled') {
            out.valueLabel.textContent = 'Those ' + added + ' hours, a year';
            out.value.textContent = money(added * rate * WORKING_WEEKS);
        } else {
            out.valueLabel.textContent = 'This week, at your rate';
            out.value.textContent = money(taught * rate);
        }
    }

    buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            view = btn.dataset.weekView;
            buttons.forEach(function (b) {
                b.setAttribute('aria-pressed', String(b === btn));
            });
            render();
        });
    });

    if (rateInput) {
        rateInput.addEventListener('input', render);
    }

    build();
    render();
})();
