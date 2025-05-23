var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var Account = function () {
    var _a = useState([]), members = _a[0], setMembers = _a[1];
    var _b = useState(''), newName = _b[0], setNewName = _b[1];
    var _c = useState(''), newRole = _c[0], setNewRole = _c[1];
    var _d = useState(null), editId = _d[0], setEditId = _d[1];
    var _e = useState(''), editName = _e[0], setEditName = _e[1];
    var _f = useState(''), editRole = _f[0], setEditRole = _f[1];
    // Läs in från localStorage när komponenten mountas
    useEffect(function () {
        var savedMembers = localStorage.getItem('familyMembers');
        if (savedMembers) {
            setMembers(JSON.parse(savedMembers));
        }
    }, []);
    // Spara till localStorage varje gång members ändras
    useEffect(function () {
        localStorage.setItem('familyMembers', JSON.stringify(members));
    }, [members]);
    var addMember = function () {
        if (newName.trim() === '')
            return;
        var newMember = {
            id: Date.now(),
            name: newName.trim(),
            role: newRole.trim(),
        };
        setMembers(__spreadArray(__spreadArray([], members, true), [newMember], false));
        setNewName('');
        setNewRole('');
    };
    var startEditing = function (member) {
        setEditId(member.id);
        setEditName(member.name);
        setEditRole(member.role);
    };
    var saveEdit = function () {
        if (editId === null)
            return;
        setMembers(members.map(function (m) {
            return m.id === editId ? __assign(__assign({}, m), { name: editName.trim(), role: editRole.trim() }) : m;
        }));
        cancelEdit();
    };
    var cancelEdit = function () {
        setEditId(null);
        setEditName('');
        setEditRole('');
    };
    var deleteMember = function (id) {
        if (window.confirm('Vill du verkligen ta bort denna familjemedlem?')) {
            setMembers(members.filter(function (m) { return m.id !== id; }));
        }
    };
    return (_jsxs(Container, { children: [_jsx("h2", { children: "Hantera familjemedlemmar" }), _jsxs(AddMemberSection, { children: [_jsx("input", { type: "text", placeholder: "Namn", value: newName, onChange: function (e) { return setNewName(e.target.value); } }), _jsx("input", { type: "text", placeholder: "Roll (t.ex. vuxen, barn)", value: newRole, onChange: function (e) { return setNewRole(e.target.value); } }), _jsx("button", { onClick: addMember, children: "L\u00E4gg till" })] }), _jsxs(List, { children: [members.length === 0 && _jsx("p", { children: "Inga familjemedlemmar tillagda \u00E4nnu." }), members.map(function (member) {
                        return editId === member.id ? (_jsxs(ListItem, { children: [_jsx("input", { type: "text", value: editName, onChange: function (e) { return setEditName(e.target.value); } }), _jsx("input", { type: "text", value: editRole, onChange: function (e) { return setEditRole(e.target.value); } }), _jsx("button", { onClick: saveEdit, children: "Spara" }), _jsx("button", { onClick: cancelEdit, children: "Avbryt" })] }, member.id)) : (_jsxs(ListItem, { children: [_jsxs("span", { children: [_jsx("strong", { children: member.name }), " - ", member.role] }), _jsxs(Buttons, { children: [_jsx("button", { onClick: function () { return startEditing(member); }, children: "Redigera" }), _jsx("button", { onClick: function () { return deleteMember(member.id); }, children: "Ta bort" })] })] }, member.id));
                    })] })] }));
};
export default Account;
// Styled Components
var Container = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  max-width: 500px;\n  margin: 20px auto;\n  padding: 10px;\n  background-color: white;\n  border-radius: 6px;\n  box-shadow: 0 0 8px rgba(0,0,0,0.1);\n"], ["\n  max-width: 500px;\n  margin: 20px auto;\n  padding: 10px;\n  background-color: white;\n  border-radius: 6px;\n  box-shadow: 0 0 8px rgba(0,0,0,0.1);\n"])));
var AddMemberSection = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  display: flex;\n  gap: 10px;\n  margin-bottom: 20px;\n  input {\n    flex: 1;\n    padding: 6px 10px;\n    font-size: 16px;\n  }\n  button {\n    padding: 6px 12px;\n    font-size: 16px;\n    cursor: pointer;\n  }\n"], ["\n  display: flex;\n  gap: 10px;\n  margin-bottom: 20px;\n  input {\n    flex: 1;\n    padding: 6px 10px;\n    font-size: 16px;\n  }\n  button {\n    padding: 6px 12px;\n    font-size: 16px;\n    cursor: pointer;\n  }\n"])));
var List = styled.ul(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  list-style: none;\n  padding: 0;\n"], ["\n  list-style: none;\n  padding: 0;\n"])));
var ListItem = styled.li(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  margin-bottom: 10px;\n\n  input {\n    font-size: 16px;\n    padding: 4px 8px;\n    margin-right: 8px;\n  }\n\n  span {\n    flex: 1;\n  }\n"], ["\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  margin-bottom: 10px;\n\n  input {\n    font-size: 16px;\n    padding: 4px 8px;\n    margin-right: 8px;\n  }\n\n  span {\n    flex: 1;\n  }\n"])));
var Buttons = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  button {\n    margin-left: 8px;\n    padding: 4px 8px;\n    cursor: pointer;\n  }\n"], ["\n  button {\n    margin-left: 8px;\n    padding: 4px 8px;\n    cursor: pointer;\n  }\n"])));
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
//# sourceMappingURL=Account.js.map