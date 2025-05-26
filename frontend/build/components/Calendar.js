import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useState, useEffect } from 'react';
function CalendarView() {
    var _a = useState(new Date()), date = _a[0], setDate = _a[1];
    var _b = useState([]), events = _b[0], setEvents = _b[1];
    useEffect(function () {
        fetch('http://localhost:8080/events')
            .then(function (res) { return res.json(); })
            .then(function (data) { return setEvents(data); });
    }, []);
    return (_jsxs("div", { children: [_jsx(Calendar, { value: date, onChange: function (value) {
                    if (value instanceof Date)
                        setDate(value);
                } }), _jsx("h3", { children: "Dagens h\u00E4ndelser:" }), _jsx("ul", { children: date &&
                    events
                        .filter(function (e) { return new Date(e.date).toDateString() === date.toDateString(); })
                        .map(function (e) { return _jsx("li", { children: e.title }, e.id); }) })] }));
}
export default CalendarView;
//# sourceMappingURL=Calendar.js.map