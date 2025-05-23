var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { jsx as _jsx } from "react/jsx-runtime";
import styled from 'styled-components';
function Button(_a) {
    var onClick = _a.onClick, children = _a.children, _b = _a.disabled, disabled = _b === void 0 ? false : _b;
    // children är det som finns inuti knappen (ex text eller ikon).
    return (_jsx(StyledButton, { onClick: onClick, disabled: disabled, children: children }));
}
// Styling
var StyledButton = styled.button(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n   button {\n    margin-top: 20px;\n    padding: 10px;\n    font-size: 16px;\n    background-color: #5b5fc7;\n    color: white;\n    border: none;\n    border-radius: 4px;\n    cursor: pointer;\n  \n    &:hover {\n    background-color: rgb(227, 166, 217);\n  }\n\n  &:disabled {\n    background-color: rgb(151, 149, 151);\n    cursor: not-allowed;\n    opacity: 0.6;\n  }\n"], ["\n   button {\n    margin-top: 20px;\n    padding: 10px;\n    font-size: 16px;\n    background-color: #5b5fc7;\n    color: white;\n    border: none;\n    border-radius: 4px;\n    cursor: pointer;\n  \n    &:hover {\n    background-color: rgb(227, 166, 217);\n  }\n\n  &:disabled {\n    background-color: rgb(151, 149, 151);\n    cursor: not-allowed;\n    opacity: 0.6;\n  }\n"])));
export default Button;
var templateObject_1;
//# sourceMappingURL=Button.js.map