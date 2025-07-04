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
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import CalendarView from '../components/Calendar';
import Events from '../components/Events';
import { useLogin } from '../context/LoginContext';
import { useNavigate } from 'react-router-dom';
function Home() {
    var _a = useLogin(), token = _a.token, userId = _a.userId;
    var navigate = useNavigate(); // För att kunna navigera till annan sida
    var _b = useState([]), events = _b[0], setEvents = _b[1];
    var _c = useState([]), familyMembers = _c[0], setFamilyMembers = _c[1];
    useEffect(function () {
        if (!token || !userId) {
            navigate('/login');
            return;
        }
        function fetchData() {
            return __awaiter(this, void 0, void 0, function () {
                var response, data, allMembers, uniqueMembers, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, fetch('/api/events', {
                                    headers: {
                                        Authorization: "Bearer ".concat(token),
                                    },
                                })];
                        case 1:
                            response = _a.sent();
                            if (!response.ok) {
                                throw new Error('Något gick fel vid hämtning av data');
                            }
                            return [4 /*yield*/, response.json()];
                        case 2:
                            data = _a.sent();
                            console.log('Events från API:', data);
                            setEvents(data);
                            allMembers = data
                                .flatMap(function (event) { var _a; return (_a = event.family_members) !== null && _a !== void 0 ? _a : []; })
                                .filter(function (member) { return !!member; });
                            uniqueMembers = Array.from(new Map(allMembers.map(function (m) { return [m.id, m]; })).values());
                            setFamilyMembers(uniqueMembers);
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            console.error(error_1);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
        fetchData();
    }, [token, userId, navigate]);
    if (!token || !userId) {
        return _jsx("div", { children: "Du m\u00E5ste vara inloggad f\u00F6r att se events." });
    }
    return (_jsxs(EventsContainer, { children: [_jsx("h1", { children: "V\u00E4lkommen till Vardagspusslet!" }), _jsx("p", { children: "Planera familjens vardag tillsammans." }), _jsx(CalendarView, { events: events, familyMembers: familyMembers }), _jsx(Events, { token: token, userId: userId, events: events, setEvents: setEvents })] }));
}
export default Home;
// sTYLING
var EventsContainer = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n  max-width: 700px;\n  margin: 0 auto;\n  padding: 1rem;\n"], ["\n  display: flex;\n  flex-direction: column;\n  max-width: 700px;\n  margin: 0 auto;\n  padding: 1rem;\n"])));
var templateObject_1;
//# sourceMappingURL=Home.js.map