import "bootstrap/dist/css/bootstrap.min";
import "jquery-ui/themes/base/all";
import "jquery-ui/ui/i18n/datepicker-zh-TW";
import "../vendor/jquery.parallax.min";
import "../sass/main.scss";

$(() => {
    let dateFormat = "yy/mm/dd";
    let cur = -1;
    let prv = -1;
    let option = {
        defaultDate: "+1w",
        changeMonth: true,
        numberOfMonths: 1,
        beforeShowDay: (date) => {
            return [true, ((date.getTime() >= Math.min(prv, cur) && date.getTime() <= Math.max(prv, cur)) ? "date-range-selected" : "")];
        },
        onSelect: (dateText, inst) => {
            let d1, d2;

            prv = cur;
            cur = (new Date(inst.selectedYear, inst.selectedMonth, inst.selectedDay)).getTime();
            if (prv == -1 || prv == cur) {
                prv = cur;
                from.val(dateText);
            } else {
                d1 = $.datepicker.formatDate(dateFormat, new Date(Math.min(prv, cur)), {});
                d2 = $.datepicker.formatDate(dateFormat, new Date(Math.max(prv, cur)), {});
                from.val(d1);
                to.val(d2);
            }
        },
    };
    let from = $("#from").datepicker(option)
    let to = $("#to").datepicker(option);

    $(".parallax").parallax();
});
