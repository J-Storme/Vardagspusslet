var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import styled from 'styled-components';
//function Events({ userId, token }: Props) {
function Events(_a) {
    var userId = _a.userId, token = _a.token, events = _a.events, setEvents = _a.setEvents;
    // state
    var _b = useState(''), title = _b[0], setTitle = _b[1];
    var _c = useState(''), description = _c[0], setDescription = _c[1];
    var _d = useState(''), eventDate = _d[0], setEventDate = _d[1];
    var _e = useState(''), startTime = _e[0], setStartTime = _e[1];
    var _f = useState(''), endTime = _f[0], setEndTime = _f[1];
    var _g = useState([]), selectedFamilyMembers = _g[0], setSelectedFamilyMembers = _g[1];
    var _h = useState(null), errorMessage = _h[0], setErrorMessage = _h[1];
    var _j = useState(false), isAddingEvent = _j[0], setIsAddingEvent = _j[1]; // Lägg till event-form visas ej från början
    //const [events, setEvents] = useState<Event[]>([]);
    var _k = useState([]), familyMembers = _k[0], setFamilyMembers = _k[1];
    var _l = useState(true), loading = _l[0], setLoading = _l[1];
    //const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    // Hämta events och familjemedlemmar när komponenten laddas
    useEffect(function () {
        fetchEvents();
        fetchFamilyMembers();
    }, []);
    function fetchFamilyMembers() {
        return __awaiter(this, void 0, void 0, function () {
            var res, data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, fetch('/api/family-members', {
                                headers: { Authorization: "Bearer ".concat(token) },
                            })];
                    case 1:
                        res = _a.sent();
                        return [4 /*yield*/, res.json()];
                    case 2:
                        data = _a.sent();
                        setFamilyMembers(data);
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Kunde inte hämta familjemedlemmar', error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function toggleFamilyMember(id) {
        if (selectedFamilyMembers.includes(id)) {
            setSelectedFamilyMembers(selectedFamilyMembers.filter(function (fm) { return fm !== id; }));
        }
        else {
            setSelectedFamilyMembers(__spreadArray(__spreadArray([], selectedFamilyMembers, true), [id], false));
        }
    }
    function fetchEvents() {
        return __awaiter(this, void 0, void 0, function () {
            var token_1, res, data, mappedEvents, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!token) {
                            setErrorMessage('Ingen token hittades, du är inte inloggad');
                            setLoading(false);
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        token_1 = localStorage.getItem('token');
                        return [4 /*yield*/, fetch('/api/events', {
                                headers: { Authorization: "Bearer ".concat(token_1) },
                            })];
                    case 2:
                        res = _a.sent();
                        return [4 /*yield*/, res.json()];
                    case 3:
                        data = _a.sent();
                        console.log('Events från backend:', data);
                        /*if (Array.isArray(data)) {
                          setEvents(data);*/
                        if (Array.isArray(data)) {
                            mappedEvents = data.map(function (ev) { return ({
                                id: ev.id,
                                title: ev.title,
                                description: ev.description,
                                event_date: ev.event_date,
                                start_time: ev.start_time,
                                end_time: ev.end_time,
                                family_member_ids: ev.family_member_ids,
                                user_id: ev.user_id
                            }); });
                            setEvents(mappedEvents);
                        }
                        else {
                            console.error('Fel format från backend. Förväntade en array, fick:', data);
                            setEvents([]); // Fallback
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        error_2 = _a.sent();
                        console.error('Kunde inte hämta events', error_2);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    function handleSubmit(event) {
        return __awaiter(this, void 0, void 0, function () {
            var startTimePlusZeros, endTimePlusZeros, res, errorData, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        event.preventDefault();
                        setErrorMessage('');
                        if (selectedFamilyMembers.length === 0) {
                            setErrorMessage('Minst en familjemedlem måste väljas.');
                            return [2 /*return*/];
                        }
                        startTimePlusZeros = startTime.length === 5 ? startTime + ':00' : startTime;
                        endTimePlusZeros = endTime.length === 5 ? endTime + ':00' : endTime;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        return [4 /*yield*/, fetch('/api/events', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: "Bearer ".concat(token)
                                },
                                body: JSON.stringify({
                                    title: title,
                                    description: description,
                                    event_date: eventDate,
                                    start_time: startTimePlusZeros,
                                    end_time: endTimePlusZeros,
                                    user_id: userId,
                                    family_member_ids: selectedFamilyMembers,
                                }),
                            })];
                    case 2:
                        res = _a.sent();
                        if (!!res.ok) return [3 /*break*/, 4];
                        return [4 /*yield*/, res.json()];
                    case 3:
                        errorData = _a.sent();
                        setErrorMessage(errorData.error || 'Något gick fel');
                        return [2 /*return*/];
                    case 4: return [4 /*yield*/, fetchEvents()];
                    case 5:
                        _a.sent();
                        // Töm formuläret
                        setTitle('');
                        setDescription('');
                        setEventDate('');
                        setSelectedFamilyMembers([]);
                        setIsAddingEvent(false); // Stänger formuläret för att skapa event
                        return [3 /*break*/, 7];
                    case 6:
                        error_3 = _a.sent();
                        setErrorMessage('Fel vid skapande av event');
                        console.error(error_3);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    }
    function handleDelete(id) {
        return __awaiter(this, void 0, void 0, function () {
            var res, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!window.confirm('Är du säker på att du vill ta bort eventet?'))
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fetch("/api/events/".concat(id), {
                                method: 'DELETE',
                                headers: { Authorization: "Bearer ".concat(token) },
                            })];
                    case 2:
                        res = _a.sent();
                        if (res.ok) {
                            setEvents(events.filter(function (ev) { return ev.id !== id; }));
                        }
                        else {
                            alert('Kunde inte ta bort eventet');
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _a.sent();
                        alert('Fel vid borttagning');
                        console.error(error_4);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    return (_jsxs(EventsFormContainer, { children: [_jsx(Title, { children: "Aktiviteter" }), _jsxs(FormContainer, { children: [!isAddingEvent && (_jsx(SubmitButton, { onClick: /*För att öppna formuläret */ function () { return setIsAddingEvent(true); }, children: "L\u00E4gg till nytt event" })), isAddingEvent && (_jsxs(StyledForm, { onSubmit: handleSubmit, children: [_jsxs(FormGroup, { children: [_jsx("label", { children: "Titel:" }), _jsx("input", { type: "text", value: title, onChange: function (event) { setTitle(event.target.value); }, required: true })] }), _jsxs(FormGroup, { children: [_jsx("label", { children: "Beskrivning:" }), _jsx("textarea", { value: description, onChange: function (event) { setDescription(event.target.value); } })] }), _jsxs(FormGroup, { children: [_jsx("label", { children: "Datum:" }), _jsx("input", { type: "date", value: eventDate, onChange: function (e) { return setEventDate(e.target.value); }, required: true })] }), _jsxs(FormGroup, { children: [_jsx("label", { children: "Starttid:" }), _jsx("input", { type: "time", value: startTime, onChange: function (event) { return setStartTime(event.target.value); }, required: true })] }), _jsxs(FormGroup, { children: [_jsx("label", { children: "Sluttid:" }), _jsx("input", { type: "time", value: endTime, onChange: function (event) { return setEndTime(event.target.value); }, required: true })] }), _jsxs(FormGroup, { children: [_jsx("label", { children: "Familjemedlemmar (minst en):" }), familyMembers.length === 0 && _jsx(NoFamilyMessage, { children: "Inga familjemedlemmar hittades." }), familyMembers.map(function (fm) { return (_jsxs(CheckboxLabel, { children: [_jsx("input", { type: "checkbox", checked: selectedFamilyMembers.includes(fm.id), onChange: function () { return toggleFamilyMember(fm.id); } }), fm.name] }, fm.id)); })] }), errorMessage && _jsx(ErrorMessage, { children: errorMessage }), _jsx(SubmitButton, { type: "submit", children: "Skapa Event" })] }))] }), Array.isArray(events) && events.length > 0 ? (_jsx(EventList, { children: events.map(function (event) { return (_jsxs(EventItem, { children: [_jsx(DeleteButton, { onClick: function () { return handleDelete(event.id); }, children: "Radera" }), _jsx("strong", { children: event.title }), _jsx("br", {}), /* Skapa ett Date-objekt med newDate(), omvandla till ISO-string .split('T' delar upp strängen i två delar,
                        och [0] tar första delen av arrayen som är datumet*/ new Date(event.event_date).toISOString().split('T')[0], _jsx("br", {}), // Visa start- och sluttid utan sekunder genom att ta bort 5 första tecknena
                        event.start_time && event.end_time
                            ? "".concat(event.start_time.slice(0, 5), " - ").concat(event.end_time.slice(0, 5))
                            : '', _jsx("br", {}), // Lägger till description om det finns
                        event.description && _jsx("em", { children: event.description }), _jsx("br", {}), !event.family_member_ids || event.family_member_ids.length === 0
                            ? 'Ingen'
                            : event.family_member_ids
                                .map(function (id) { var _a; return (_a = familyMembers.find(function (fm) { return fm.id === id; })) === null || _a === void 0 ? void 0 : _a.name; })
                                .filter(Boolean) // Ta bort undefined om någon inte hittas
                                .join(', ') //Gör en lista med kommatecken mellan
                        , _jsx("br", {})] }, event.id)); }) })) : (_jsx("p", { children: "Inga events skapade \u00E4n." }))] }));
}
export default Events;
// styling
var EventsFormContainer = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  max-width: 800px;\n  min-width: 350px;\n  margin: 0.5rem auto;\n  padding: 2rem;  \n  border-radius: 12px;  \n  background: transparent;\n"], ["\n  max-width: 800px;\n  min-width: 350px;\n  margin: 0.5rem auto;\n  padding: 2rem;  \n  border-radius: 12px;  \n  background: transparent;\n"])));
var Title = styled.h2(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  text-align: center;\n  margin-bottom: 0.5rem;\n  font-size: 28px;\n  font-family: 'Indie Flower', Arial, sans-serif;\n"], ["\n  text-align: center;\n  margin-bottom: 0.5rem;\n  font-size: 28px;\n  font-family: 'Indie Flower', Arial, sans-serif;\n"])));
var FormContainer = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  display: flex;\n  justify-content: center;\n"], ["\n  display: flex;\n  justify-content: center;\n"])));
var StyledForm = styled.form(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n  gap: 1.5rem;\n  width: 100%;\n"], ["\n  display: flex;\n  flex-direction: column;\n  gap: 1.5rem;\n  width: 100%;\n"])));
var FormGroup = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n\n  label {\n    font-weight: bold;\n    margin-bottom: 0.5rem;\n  }\n\n  input[type=\"text\"],\n  input[type=\"date\"],\n  textarea {\n    padding: 0.5rem;\n    border: 1px solid #ccc;\n    border-radius: 8px;\n    font-size: 1rem;\n  }\n\n  textarea {\n    resize: vertical;\n    min-height: 80px;\n  }\n"], ["\n  display: flex;\n  flex-direction: column;\n\n  label {\n    font-weight: bold;\n    margin-bottom: 0.5rem;\n  }\n\n  input[type=\"text\"],\n  input[type=\"date\"],\n  textarea {\n    padding: 0.5rem;\n    border: 1px solid #ccc;\n    border-radius: 8px;\n    font-size: 1rem;\n  }\n\n  textarea {\n    resize: vertical;\n    min-height: 80px;\n  }\n"])));
var CheckboxLabel = styled.label(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  margin-top: 0.25rem;\n"], ["\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  margin-top: 0.25rem;\n"])));
var SubmitButton = styled.button(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  background-color: rgb(117, 119, 212);\n  color: white;\n  font-weight: bold;\n  padding: 0.75rem 1.25rem;\n  border: none;\n  border-radius: 8px;\n  cursor: pointer;\n  transition: background-color 0.3s;\n\n  &:hover {\n    background-color: rgb(91, 201, 133);\n  }\n"], ["\n  background-color: rgb(117, 119, 212);\n  color: white;\n  font-weight: bold;\n  padding: 0.75rem 1.25rem;\n  border: none;\n  border-radius: 8px;\n  cursor: pointer;\n  transition: background-color 0.3s;\n\n  &:hover {\n    background-color: rgb(91, 201, 133);\n  }\n"])));
var ErrorMessage = styled.p(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  color: red;\n  font-weight: bold;\n"], ["\n  color: red;\n  font-weight: bold;\n"])));
var NoFamilyMessage = styled.p(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n  font-style: italic;\n  color: #555;\n"], ["\n  font-style: italic;\n  color: #555;\n"])));
var EventList = styled.ul(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n  list-style-type: none;\n  padding-left: 0;\n  max-width: 700px;\n  min-width: 300px;\n  margin: 0 auto;\n  "], ["\n  list-style-type: none;\n  padding-left: 0;\n  max-width: 700px;\n  min-width: 300px;\n  margin: 0 auto;\n  "])));
var EventItem = styled.li(templateObject_11 || (templateObject_11 = __makeTemplateObject(["\nposition: relative;\nborder: 1px solid #ccc;\nmargin: 1em 0;\npadding: 1em;\nborder-radius: 8px;\nbox-shadow: 0 2px 5px rgba(31, 30, 30, 0.5);\nbackground: linear-gradient(\n  135deg,\n  rgb(241, 232, 248), \n  rgb(243, 238, 247), \n  rgb(230, 226, 238)   \n);\n"], ["\nposition: relative;\nborder: 1px solid #ccc;\nmargin: 1em 0;\npadding: 1em;\nborder-radius: 8px;\nbox-shadow: 0 2px 5px rgba(31, 30, 30, 0.5);\nbackground: linear-gradient(\n  135deg,\n  rgb(241, 232, 248), \n  rgb(243, 238, 247), \n  rgb(230, 226, 238)   \n);\n"])));
var DeleteButton = styled.button(templateObject_12 || (templateObject_12 = __makeTemplateObject(["\nposition: absolute;\ntop: 8px;\nright: 6px;\nfont-size: 11px;\nbackground:rgb(116, 112, 111);\ncolor: rgb(255, 255, 255);\ncursor: pointer;\npadding: 0.15rem .5rem;\nborder: 1px;\nborder-radius: 8px;\ntransition: background - color 0.3s;\n\n  &:hover {\n  background: rgb(189, 11, 11);\n}\n"], ["\nposition: absolute;\ntop: 8px;\nright: 6px;\nfont-size: 11px;\nbackground:rgb(116, 112, 111);\ncolor: rgb(255, 255, 255);\ncursor: pointer;\npadding: 0.15rem .5rem;\nborder: 1px;\nborder-radius: 8px;\ntransition: background - color 0.3s;\n\n  &:hover {\n  background: rgb(189, 11, 11);\n}\n"])));
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12;
//# sourceMappingURL=Events.js.map