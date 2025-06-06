var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useState } from 'react';
import styled from 'styled-components';
function isSameDay(date1, date2) {
    return date1.toDateString() === date2.toDateString();
}
function CalendarView(_a) {
    var events = _a.events, familyMembers = _a.familyMembers;
    var _b = useState(new Date()), date = _b[0], setDate = _b[1];
    if (!events || !familyMembers) {
        return _jsx("p", { children: "Laddar kalenderdata..." });
    }
    // Filtrera events för det valda datumet
    var selectedDateEvents = events.filter(function (event) {
        var eventDate = new Date(event.event_date);
        return !isNaN(eventDate.getTime()) && isSameDay(eventDate, date);
    });
    return (_jsxs("div", { children: [_jsx(CalendarContainer, { children: _jsx(Calendar, { value: date, onChange: function (value) {
                        if (value instanceof Date)
                            setDate(value);
                    } }) }), _jsxs(DailyEventList, { children: [_jsx("h3", { children: "Dagens h\u00E4ndelser:" }), selectedDateEvents.length > 0 ? (selectedDateEvents.map(function (event) {
                        var _a;
                        var memberNames = ((_a = event.family_member_ids) !== null && _a !== void 0 ? _a : [])
                            .map(function (id) {
                            var member = familyMembers.find(function (m) { return m.id === id; });
                            return member ? member.name : null;
                        })
                            .filter(function (name) { return name !== null; })
                            .join(', ');
                        return (_jsxs(EventItem, { children: [event.title, " \u2014 ", memberNames] }, event.id));
                    })) : (_jsx("p", { children: "Inga h\u00E4ndelser denna dag." }))] })] }));
}
export default CalendarView;
var CalendarContainer = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  padding: 5px;  \n  margin: 0.6rem auto;\n  max-width: 400px;\n  border-radius: 10px;\n  overflow: hidden;  \n\n  /* Bakgrund och text */\n  .react-calendar {\n    background:rgb(117, 119, 212);\n    color: #ddd;\n    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;\n    border-radius: 10px;\n    box-shadow: 0 0 10px rgba(55, 55, 59, 0.7);\n  }\n\n  /* Navigation */\n  .react-calendar__navigation {\n    background: rgb(60, 43, 138);\n    display: flex;\n    justify-content: center;\n     border-radius: 10px;\n    gap: 1rem;\n  }\n\n  .react-calendar__navigation button {\n    color: #d8caff;\n    min-width: 44px;\n    background: transparent;\n    border: none;\n    font-weight: bold;\n    cursor: pointer;\n    border-radius: 5px;\n    transition: background 0.3s;\n  }\n\n  .react-calendar__navigation button:hover {\n    background: #7c66cc;\n  }\n\n  /* Veckodagar */\n  .react-calendar__month-view__weekdays {\n    background:rgb(80, 63, 158);\n    color: #c5b8ff;\n    text-transform: uppercase;\n    font-weight: 600;\n    font-size: 0.85rem;\n    font-family: 'Indie Flower', cursive;\n  }\n\n  /* Grid f\u00F6r dagrutor */\n.react-calendar__month-view__days {\n  display: grid !important;\n  grid-template-columns: repeat(7, 1fr); \n  gap: 4px; \n}\n\n  /* Dag-rutor */\n  .react-calendar__tile {\n    background: rgb(98, 80, 177);\n    color: white;\n    border-radius: 8px;\n    width: 100%;             \n    aspect-ratio: 1 / 1;     \n    height: 50px;    \n    display: flex;    \n    justify-content: center;\n    align-items: center;\n    transition: background 0.3s, color 0.3s;                   \n    box-sizing: border-box;\n  }\n\n  .react-calendar__tile:hover {\n    background: #9d87ff;\n    color: #2e1a6f;\n  }\n\n  /* Vald dag */\n  .react-calendar__tile--active {\n    background:rgb(229, 173, 255) !important;\n    color: #2e1a6f;\n    font-weight: bold;\n    box-shadow: 0 0 8px #b799ff;\n  }\n\n  /* Dagar utanf\u00F6r aktuell m\u00E5nad */\n  .react-calendar__tile--neighboringMonth {\n  color:rgb(193, 184, 230);\n  }\n"], ["\n  padding: 5px;  \n  margin: 0.6rem auto;\n  max-width: 400px;\n  border-radius: 10px;\n  overflow: hidden;  \n\n  /* Bakgrund och text */\n  .react-calendar {\n    background:rgb(117, 119, 212);\n    color: #ddd;\n    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;\n    border-radius: 10px;\n    box-shadow: 0 0 10px rgba(55, 55, 59, 0.7);\n  }\n\n  /* Navigation */\n  .react-calendar__navigation {\n    background: rgb(60, 43, 138);\n    display: flex;\n    justify-content: center;\n     border-radius: 10px;\n    gap: 1rem;\n  }\n\n  .react-calendar__navigation button {\n    color: #d8caff;\n    min-width: 44px;\n    background: transparent;\n    border: none;\n    font-weight: bold;\n    cursor: pointer;\n    border-radius: 5px;\n    transition: background 0.3s;\n  }\n\n  .react-calendar__navigation button:hover {\n    background: #7c66cc;\n  }\n\n  /* Veckodagar */\n  .react-calendar__month-view__weekdays {\n    background:rgb(80, 63, 158);\n    color: #c5b8ff;\n    text-transform: uppercase;\n    font-weight: 600;\n    font-size: 0.85rem;\n    font-family: 'Indie Flower', cursive;\n  }\n\n  /* Grid f\u00F6r dagrutor */\n.react-calendar__month-view__days {\n  display: grid !important;\n  grid-template-columns: repeat(7, 1fr); \n  gap: 4px; \n}\n\n  /* Dag-rutor */\n  .react-calendar__tile {\n    background: rgb(98, 80, 177);\n    color: white;\n    border-radius: 8px;\n    width: 100%;             \n    aspect-ratio: 1 / 1;     \n    height: 50px;    \n    display: flex;    \n    justify-content: center;\n    align-items: center;\n    transition: background 0.3s, color 0.3s;                   \n    box-sizing: border-box;\n  }\n\n  .react-calendar__tile:hover {\n    background: #9d87ff;\n    color: #2e1a6f;\n  }\n\n  /* Vald dag */\n  .react-calendar__tile--active {\n    background:rgb(229, 173, 255) !important;\n    color: #2e1a6f;\n    font-weight: bold;\n    box-shadow: 0 0 8px #b799ff;\n  }\n\n  /* Dagar utanf\u00F6r aktuell m\u00E5nad */\n  .react-calendar__tile--neighboringMonth {\n  color:rgb(193, 184, 230);\n  }\n"])));
var DailyEventList = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\nmax - width: 350px;\nmargin: 0.5rem auto;\npadding: 1rem;\nbackground: rgb(117, 119, 212);\ncolor: #fff;\nborder-radius: 8px;\nbox-shadow: 0 2px 5px rgba(31, 30, 30, 0.5);\n\nh3 {\nfont-family: 'Indie Flower', cursive;}\n"], ["\nmax - width: 350px;\nmargin: 0.5rem auto;\npadding: 1rem;\nbackground: rgb(117, 119, 212);\ncolor: #fff;\nborder-radius: 8px;\nbox-shadow: 0 2px 5px rgba(31, 30, 30, 0.5);\n\nh3 {\nfont-family: 'Indie Flower', cursive;}\n"])));
var EventItem = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\nmargin-bottom: 1rem;\nmargin-top: 1rem;\ncolor: #fff;\nfont-family: 'Indie Flower', cursive;\n"], ["\nmargin-bottom: 1rem;\nmargin-top: 1rem;\ncolor: #fff;\nfont-family: 'Indie Flower', cursive;\n"])));
var templateObject_1, templateObject_2, templateObject_3;
//# sourceMappingURL=Calendar.js.map