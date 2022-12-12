(function () {
    "use strict";

    const
        s1 = document.getElementById("minutes"),
        s2 = document.getElementById("seconds"),

        e1 = new RegExp("^[0-9]{1,2}$"),

        NSPomodoro = (function () {
            function limit(element) {
                element.addEventListener("keypress", function (e) {
                    if (!e.key.match(e1) || this.innerText.length > 1) e.preventDefault();
                });
            }

            return {
                initial: function () {
                    limit(s1);
                    limit(s2);
                }
            };
        }())
    ;

    window.addEventListener("load", function () {
        NSPomodoro.initial();
    })
}());
