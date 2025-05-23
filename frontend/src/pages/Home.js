var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styled from 'styled-components';
import CalendarView from '../components/Calendar';
function Home() {
    return (_jsxs(Container, { children: [_jsx("h1", { children: "V\u00E4lkommen till Vardagspusslet" }), _jsx("p", { children: "Planera familjens vardag tillsammans." }), _jsx(CalendarView, {})] }));
}
export default Home;
// sTYLING
var Container = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  padding: 2rem;\n"], ["\n  padding: 2rem;\n"])));
var templateObject_1;
//# sourceMappingURL=Home.js.map