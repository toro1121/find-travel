import React from "react";
// vendor
import "jquery-ui/themes/base/all";
import "jquery-ui/ui/i18n/datepicker-zh-TW";

export default class extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        $(() => {
            let dateFormat = "yy/mm/dd";
            let cur = -1;
            let prv = -1;
            let option = {
                // defaultDate: "+1w",
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
            let from = $("#start_date").datepicker(option)
            let to = $("#end_date").datepicker(option);
        });
    }
    render() {
        return (
            <div className="col-sm-12 clear">
                <div className="form-group w-45p float-left">
                    <label>出發日期</label>
                    <input type="text" className="form-control" id="start_date" placeholder="開始日期" readOnly />
                </div>
                <div className="w-10p m-t-10 float-left text-align-center line-height-70 color-white font-size-30 font-weight-bolder">–</div>
                <div className="form-group w-45p float-left">
                    <label className="none">&nbsp;</label>
                    <input type="text" className="form-control" id="end_date" placeholder="結束日期" readOnly />
                </div>
            </div>
        );
    }
}
