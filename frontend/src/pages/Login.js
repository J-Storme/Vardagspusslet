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
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../context/LoginContext';
function Login() {
    var _this = this;
    var _a = useState(''), email = _a[0], setEmail = _a[1];
    var _b = useState(''), password = _b[0], setPassword = _b[1];
    var _c = useState(''), error = _c[0], setError = _c[1];
    var _d = useState(''), editName = _d[0], setEditName = _d[1];
    var _e = useState(''), message = _e[0], setMessage = _e[1];
    var navigate = useNavigate();
    var login = useLogin().login;
    useEffect(function () {
        var storedName = localStorage.getItem('userName') || '';
        setEditName(storedName);
    }, []);
    var handleLogin = function () { return __awaiter(_this, void 0, void 0, function () {
        var response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!email && !password) {
                        setError('Vänligen fyll i både e-post och lösenord.');
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch('http://localhost:8080/login', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email: email, password: password }),
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    if (!response.ok) {
                        setError(data.error || 'Inloggning misslyckades');
                        return [2 /*return*/];
                    }
                    // spara token, email, namn och adress
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userEmail', data.email);
                    localStorage.setItem('userName', data.name || '');
                    login(data.token, data.email, data.name);
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error('Inloggningsfel:', error_1);
                    setError('Något gick fel vid inloggning');
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // Navigera till registreringssidan
    var handleRegisterRedirect = function () {
        navigate('/register');
    };
    // spara uppdaterade namn/adress
    var handleSave = function () { return __awaiter(_this, void 0, void 0, function () {
        var token, response, data, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    token = localStorage.getItem('token');
                    if (!token)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch('http://localhost:8080/update-user', {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: "Bearer ".concat(token),
                            },
                            body: JSON.stringify({ name: editName }),
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    if (!response.ok) {
                        setMessage(data.error || 'Misslyckades med att spara');
                    }
                    else {
                        localStorage.setItem('userName', editName);
                        setMessage('Profil uppdaterad!');
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_2 = _a.sent();
                    console.error('Fel vid uppdatering:', error_2);
                    setMessage('Något gick fel');
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var token = localStorage.getItem('token');
    return (_jsxs(LoginContainer, { children: [_jsx("h2", { children: "Logga in" }), _jsx("input", { type: "email", placeholder: "E-post", value: email, onChange: function (event) { return setEmail(event.target.value); } }), _jsx("input", { type: "password", placeholder: "L\u00F6senord", value: password, onChange: function (event) { return setPassword(event.target.value); } }), error && _jsx("p", { children: error }), _jsx("button", { onClick: handleLogin, children: "Logga in" }), _jsxs("div", { children: [_jsx("p", { children: "Har du inget konto?" }), _jsx("button", { onClick: handleRegisterRedirect, children: "Registrera dig" })] }), token && (_jsxs(_Fragment, { children: [_jsx("h3", { children: "Din profil" }), _jsx("label", { children: "Namn:" }), _jsx("input", { type: "text", value: editName, onChange: function (event) { return setEditName(event.target.value); } }), _jsx("button", { onClick: handleSave, children: "Spara \u00E4ndringar" }), message && _jsx("p", { children: message })] }))] }));
}
var LoginContainer = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  padding: 20px;\n  max-width: 500px;\n  margin: 0 auto;\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n\n  div {\n    margin-top: 20px;\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n  }\n\n  button {\n    cursor: pointer;\n  }\n"], ["\n  padding: 20px;\n  max-width: 500px;\n  margin: 0 auto;\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n\n  div {\n    margin-top: 20px;\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n  }\n\n  button {\n    cursor: pointer;\n  }\n"])));
export default Login;
var templateObject_1;
//# sourceMappingURL=Login.js.map