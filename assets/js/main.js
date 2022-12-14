(function () {
    "use strict";

    let
        original_time = 0,
        total_time = 0,
        percentage = 100,
        timer = null
    ;

    const
        s1 = document.getElementById("minutes"),
        s2 = document.getElementById("seconds"),
        s3 = document.getElementById("setting"),
        s4 = document.getElementById("pomodoro"),
        s5 = document.getElementById("start_stop"),
        s6 = document.getElementById("stop_alarm"),
        s7 = document.getElementById("percentage"),
        s8 = s7.querySelector(".circle"),

        c1 = "edit",
        c2 = "gear",
        c3 = "check",
        c4 = "start",
        c5 = "finish",
        c6 = "high",
        c7 = "medium",
        c8 = "low",

        l1 = [c6, c7, c8],

        e1 = new RegExp("^[0-9]{1,2}$"),

        alarm = document.getElementById("alarm"),

        NSPomodoro = (function () {
            function animation_stroke() {
                s8.setAttribute("stroke-dasharray", percentage + " 100");

                for (let item of l1) {
                    s8.classList.remove(item);
                }

                if (percentage > 50) {
                    s8.classList.add(c6);
                } else if (percentage > 20) {
                    s8.classList.add(c7);
                } else {
                    s8.classList.add(c8);
                }

            }
            function switch_ss(state = true) {
                if (state) {
                    s4.classList.remove(c4);
                    s5.classList.remove(c4);
                    s5.innerText = "Start";
                } else {
                    s4.classList.add(c4);
                    s5.classList.add(c4);
                    s5.innerText = "Stop";
                }
            }

            function limit(elements) {
                for (let item of elements) {
                    item.addEventListener("keypress", function (e) {
                        if (!e.key.match(e1) || this.innerText.length > 1) e.preventDefault();
                    });
                }
            }

            function seconds() {
                s2.addEventListener("keyup", function () {
                    let
                        initial_value = Number(this.innerText)
                    ;

                    if (initial_value >= 60) {
                        this.innerText = "00";
                    }
                });
            }

            function get_time() {
                let
                    minutes = Number(s1.innerText),
                    seconds = Number(s2.innerText)
                ;

                total_time = seconds + (minutes * 60);
            }

            function format_time() {
                for (let item of [s1, s2]) {
                    if (Number(item.innerText) < 10) item.innerText = "0" + Number(item.innerText);
                }
            }

            function change_display(time = total_time) {
                let
                    minutes = parseInt(time / 60, 10),
                    seconds = parseInt(time % 60, 10)
                ;

                s1.innerText = minutes;
                s2.innerText = seconds;

                format_time();
            }


            return {
                initial: function () {
                    limit([s1, s2]);
                    seconds();

                    s1.addEventListener("blur", format_time);
                    s2.addEventListener("blur", format_time);
                },

                setting: function () {
                    s3.addEventListener("click", function () {
                        s4.classList.toggle(c1);
                        s3.classList.toggle(c2);
                        s3.classList.toggle(c3);

                        if (s4.classList.contains(c1)) {
                            s5.disabled = true;
                            s1.contentEditable = true;
                            s2.contentEditable = true;

                            clearInterval(timer);
                            switch_ss();
                        } else {
                            s5.disabled = false;
                            s1.contentEditable = false;
                            s2.contentEditable = false;

                            get_time();
                            original_time = total_time;
                        }

                        // Adjust the visual format of minutes and seconds
                        format_time();
                    });
                },

                start_stop: function () {
                    // Calculate total time
                    get_time();
                    original_time = total_time;

                    s5.addEventListener("click", function () {
                        if (s4.classList.contains(c4)) {
                            // Stop pomodoro
                            clearInterval(timer);
                            switch_ss();
                        } else if (!s4.classList.contains(c1)
                            && !s4.classList.contains(c4)
                        ) {
                            // Calculate total time
                            get_time();

                            // Star Timer
                            NSPomodoro.star_timer();
                            switch_ss(false);
                        }
                    });
                },

                star_timer: function () {
                    s8.setAttribute("stroke-dasharray", percentage + " 100");
                    timer = setInterval(function () {
                        change_display();

                        if (total_time >= 0) {
                            total_time--;
                            percentage = Math.round((total_time * 100) / original_time);
                            percentage = (percentage >= 0)
                                ? percentage
                                : 0;

                            animation_stroke();
                        } else {
                            clearInterval(timer);
                            NSPomodoro.finish_timer();
                        }
                    }, 985);
                },

                finish_timer: function () {
                    change_display(original_time);
                    switch_ss();
                    alarm.play();
                    alarm.loop = true;
                    s4.classList.add(c5);
                    percentage = 100
                    s8.setAttribute("stroke-dasharray", percentage + " 100");
                },

                stop_alarm: function () {
                    s6.addEventListener("click", function () {
                        alarm.pause();
                        s4.classList.remove(c5);
                        animation_stroke();
                    });
                }
            };
        }())
    ;

    window.addEventListener("load", function () {
        NSPomodoro.initial();
        NSPomodoro.setting();
        NSPomodoro.start_stop();
        NSPomodoro.stop_alarm();
    });
}());
