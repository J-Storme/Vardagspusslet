import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
import Calendar from '@toast-ui/react-calendar';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';
function CalendarView() {
    var calendarRef = useRef(null);
    useEffect(function () {
        fetch('http://localhost:8080/')
            .then(function (res) { return res.json(); })
            .then(function (data) {
            var _a;
            var calendarInstance = (_a = calendarRef.current) === null || _a === void 0 ? void 0 : _a.getInstance();
            if (calendarInstance) {
                calendarInstance.clear(); // tar bort gamla händelser
                calendarInstance.createSchedules(data); // Lägg till nya
            }
        });
    }, []);
    return (_jsxs("div", { children: [_jsx("h2", { children: "Min kalender" }), _jsx(Calendar, { height: "800px", view: "week", ref: calendarRef, theme: "light", calendars: [
                    {
                        id: '1',
                        name: 'Standard',
                        backgroundColor: '#03bd9e',
                    }
                ], template: {
                    time: function (event) {
                        return "".concat(event.title);
                    }
                }, week: {
                    showTimezoneCollapseButton: true,
                } })] }));
}
;
export default CalendarView;
//# sourceMappingURL=Calendar.js.map