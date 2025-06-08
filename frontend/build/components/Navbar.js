var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useLogin } from '../context/LoginContext';
function Navbar() {
    var _a = useLogin(), isLoggedIn = _a.isLoggedIn, logout = _a.logout;
    return (_jsxs(NavbarContainer, { children: [_jsxs(NavbarList, { children: [_jsxs(NavbarItemWithDropdown, { children: [_jsx(NavbarLink, { to: "/", children: "Hem" }), _jsxs(DropdownMenu, { children: [_jsx(DropdownItem, { children: _jsx(Link, { to: "/", children: "Aktiviteter" }) }), _jsx(DropdownItem, { children: _jsx(Link, { to: "/account", children: "Konto" }) }), !isLoggedIn && (_jsx(DropdownItem, { children: _jsx(Link, { to: "/login", children: "Logga in" }) })), isLoggedIn && (_jsx(DropdownItem, { onClick: function (event) {
                                            event.preventDefault();
                                            logout();
                                        }, children: _jsx(Link, { to: "/", children: "Logga ut" }) }))] })] }), _jsx(NavbarItem, { children: _jsx(NavbarLink, { to: "/tasks", children: "To-do" }) }), _jsx(NavbarItem, { children: _jsx(NavbarLink, { to: "/weeklyschedule", children: "Veckoschema" }) }), _jsx(NavbarItem, { children: _jsx(NavbarLink, { to: "/account", children: "Hantera konto" }) })] }), _jsx(TasksIconContainer, { children: _jsx(TasksIconWithHover, { children: _jsx(Link, { to: "/tasks" }) }) })] }));
}
//Styling
var TasksIconContainer = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  position: relative;\n  display: inline-block;\n  left: -10px;\n"], ["\n  position: relative;\n  display: inline-block;\n  left: -10px;\n"])));
var TasksIconWithHover = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  position: relative;\n\n  &:hover {\n    opacity: 1;\n  }\n"], ["\n  position: relative;\n\n  &:hover {\n    opacity: 1;\n  }\n"])));
var NavbarContainer = styled.nav(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  width: 100%;\n  background-color: rgb(117, 119, 212);\n  padding: 1rem;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n"], ["\n  width: 100%;\n  background-color: rgb(117, 119, 212);\n  padding: 1rem;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n"])));
var NavbarList = styled.ul(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  list-style: none;\n  display: flex;\n  gap: 30px;\n  margin: 0;\n  padding: 0;\n"], ["\n  list-style: none;\n  display: flex;\n  gap: 30px;\n  margin: 0;\n  padding: 0;\n"])));
var NavbarItem = styled.li(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  margin: 0 15px;\n"], ["\n  margin: 0 15px;\n"])));
var NavbarLink = styled(Link)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  color: white;\n  text-decoration: none;\n  font-size: 18px;\n\n  &:hover {\n    color: #ddd;\n  }\n"], ["\n  color: white;\n  text-decoration: none;\n  font-size: 18px;\n\n  &:hover {\n    color: #ddd;\n  }\n"])));
var DropdownMenu = styled.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  position: absolute;\n  top: 100%;\n  left: 0;\n  background-color: rgb(235, 206, 235);\n  width: 95px;\n  border-radius: 8px;\n  border: rgb(148, 130, 148);\n  box-shadow: 1px 2px 10px rgba(0, 0, 0, 0.2);\n  display: none;\n  flex-direction: column;\n  padding: 0;\n"], ["\n  position: absolute;\n  top: 100%;\n  left: 0;\n  background-color: rgb(235, 206, 235);\n  width: 95px;\n  border-radius: 8px;\n  border: rgb(148, 130, 148);\n  box-shadow: 1px 2px 10px rgba(0, 0, 0, 0.2);\n  display: none;\n  flex-direction: column;\n  padding: 0;\n"])));
var DropdownItem = styled.div(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  padding: 8px;\n  color: white;\n  text-align: center;\n  width: 100%;\n  border: rgb(148, 130, 148);\n  &:hover {\n    background-color: rgb(187, 183, 183);\n    border-radius: 8px;\n    border: rgb(148, 130, 148);\n  }\n  a {\n    color: black;\n    text-decoration: none;\n  }\n"], ["\n  padding: 8px;\n  color: white;\n  text-align: center;\n  width: 100%;\n  border: rgb(148, 130, 148);\n  &:hover {\n    background-color: rgb(187, 183, 183);\n    border-radius: 8px;\n    border: rgb(148, 130, 148);\n  }\n  a {\n    color: black;\n    text-decoration: none;\n  }\n"])));
// Visa dropdown-menyn när man hovrar över navbaritem
var NavbarItemWithDropdown = styled(NavbarItem)(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n  position: relative;\n  &:hover ", " {\n    display: flex; /* Visa dropdown n\u00E4r man hovrar \u00F6ver \"Hem\" */\n  }\n"], ["\n  position: relative;\n  &:hover ", " {\n    display: flex; /* Visa dropdown n\u00E4r man hovrar \u00F6ver \"Hem\" */\n  }\n"])), DropdownMenu);
export default Navbar;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9;
//# sourceMappingURL=Navbar.js.map