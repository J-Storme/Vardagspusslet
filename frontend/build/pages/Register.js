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
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../context/LoginContext';
function Register() {
    var _this = this;
    var _a = useState(''), name = _a[0], setName = _a[1];
    var _b = useState(''), email = _b[0], setEmail = _b[1];
    var _c = useState(''), password = _c[0], setPassword = _c[1];
    var _d = useState(''), error = _d[0], setError = _d[1];
    var navigate = useNavigate();
    var login = useLogin().login;
    var handleRegister = function () { return __awaiter(_this, void 0, void 0, function () {
        var response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!name || !email || !password) {
                        setError('Vänligen fyll i alla fält.');
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch('http://localhost:8080/api/register', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ name: name, email: email, password: password }),
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    console.log('Response text:', data);
                    if (!response.ok) {
                        setError(data.error || 'Kunde inte registrera användare');
                        return [2 /*return*/];
                    }
                    // Efter lyckad registrering, spara token och användaruppgifter
                    localStorage.setItem('token', data.token); // Använd token som returnerades vid registreringen
                    localStorage.setItem('userEmail', email);
                    localStorage.setItem('userName', name);
                    localStorage.setItem('userId', data.id.toString());
                    // Logga in användaren direkt
                    login(data.token, data.email, data.name, data.id);
                    navigate('/'); // Navigera till home efter inloggning
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    return (_jsx(_Fragment, { children: _jsxs(RegisterContainer, { children: [_jsx("h2", { children: "Registrera ett konto f\u00F6r hush\u00E5llet" }), _jsxs(LabelRow, { children: [_jsx("label", { htmlFor: "name", children: "Hush\u00E5llets namn:" }), _jsx("input", { type: "text", placeholder: "Hush\u00E5llets namn", value: name, onChange: function (event) { return setName(event.target.value); } })] }), _jsxs(LabelRow, { children: [_jsx("label", { htmlFor: "email", children: "E-post:" }), _jsx("input", { type: "email", placeholder: "E-post", value: email, onChange: function (event) { return setEmail(event.target.value); } })] }), _jsxs(LabelRow, { children: [_jsx("label", { htmlFor: "password", children: "L\u00F6senord:" }), _jsx("input", { type: "password", placeholder: "L\u00F6senord", value: password, onChange: function (event) { return setPassword(event.target.value); } })] }), error && _jsx("p", { children: error }), _jsx(Button, { onClick: handleRegister, children: "Registrera" })] }) }));
}
export default Register;
// Styling
var RegisterContainer = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  padding: 20px;\n  max-width: 400px;\n  margin: 0 auto;\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n\n  h2 {\n  margin-top: 30px;\n  }\n"], ["\n  padding: 20px;\n  max-width: 400px;\n  margin: 0 auto;\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n\n  h2 {\n  margin-top: 30px;\n  }\n"])));
var LabelRow = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  \n  label {\n    font-weight: bold;\n    width: 100px; \n  }\n\n  input {\n    flex: 1;\n    padding: 8px;\n    font-size: 16px;\n  }\n"], ["\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  \n  label {\n    font-weight: bold;\n    width: 100px; \n  }\n\n  input {\n    flex: 1;\n    padding: 8px;\n    font-size: 16px;\n  }\n"])));
var Button = styled.button(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  display: inline-block;\n  background-color:rgb(117, 119, 212);\n  color: white;\n  font-weight: bold;\n  padding: 0.75rem 1.25rem;\n  border: none;\n  margin-left: 7rem;\n  margin-right: 0px;\n  border-radius: 8px;\n  cursor: pointer;\n  transition: background-color 0.3s;\n\n  &:hover {\n    background-color:rgb(138, 212, 142);\n  }\n"], ["\n  display: inline-block;\n  background-color:rgb(117, 119, 212);\n  color: white;\n  font-weight: bold;\n  padding: 0.75rem 1.25rem;\n  border: none;\n  margin-left: 7rem;\n  margin-right: 0px;\n  border-radius: 8px;\n  cursor: pointer;\n  transition: background-color 0.3s;\n\n  &:hover {\n    background-color:rgb(138, 212, 142);\n  }\n"])));
var templateObject_1, templateObject_2, templateObject_3;
//# sourceMappingURL=Register.js.map