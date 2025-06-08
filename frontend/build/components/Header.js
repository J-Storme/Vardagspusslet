var __makeTemplateObject =
  (this && this.__makeTemplateObject) ||
  function (cooked, raw) {
    if (Object.defineProperty) {
      Object.defineProperty(cooked, 'raw', { value: raw });
    } else {
      cooked.raw = raw;
    }
    return cooked;
  };
import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import styled from 'styled-components';
import { useLogin } from '../context/LoginContext';
function Header() {
  var _a = useLogin(),
    isLoggedIn = _a.isLoggedIn,
    userName = _a.userName;
  return _jsxs(HeaderContainer, {
    children: [
      _jsxs(LogoContainer, {
        children: [
          _jsx('h1', { children: 'Vardagspusslet' }),
          _jsx('img', { src: '/logo.png', alt: 'logo' }),
        ],
      }),
      isLoggedIn &&
        _jsxs(WelcomeText, { children: ['Hush\u00E5ll ', userName, '!'] }),
    ],
  });
}
export default Header;
export var HeaderContainer = styled.header(
  templateObject_1 ||
    (templateObject_1 = __makeTemplateObject(
      [
        '\n  width: 100%;\n  max-width: 700px;\n  text-align: center;\n  margin-bottom: 20px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  position: relative;\n  padding: 24px 0;  \n\n  h1 {font-size: 36px;\n  }\n',
      ],
      [
        '\n  width: 100%;\n  max-width: 700px;\n  text-align: center;\n  margin-bottom: 20px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  position: relative;\n  padding: 24px 0;  \n\n  h1 {font-size: 36px;\n  }\n',
      ],
    )),
);
export var LogoContainer = styled.div(
  templateObject_2 ||
    (templateObject_2 = __makeTemplateObject(
      [
        "\n  display: flex;\n  align-items: center;  \n  gap: 2px;\n  margin: 0;\n\n  h1 {\n  font-size: 36px;\n  font-family: 'Indie Flower', Arial, sans-serif;\n  }\n  \n  img {\n    height: 60px;\n  }\n",
      ],
      [
        "\n  display: flex;\n  align-items: center;  \n  gap: 2px;\n  margin: 0;\n\n  h1 {\n  font-size: 36px;\n  font-family: 'Indie Flower', Arial, sans-serif;\n  }\n  \n  img {\n    height: 60px;\n  }\n",
      ],
    )),
);
var WelcomeText = styled.p(
  templateObject_3 ||
    (templateObject_3 = __makeTemplateObject(
      [
        "\n  position: absolute;\n  right: 10px;\n  top: 50%;\n  font-family: 'Indie Flower', Arial, sans-serif;\n  transform: translateY(-50%);  \n",
      ],
      [
        "\n  position: absolute;\n  right: 10px;\n  top: 50%;\n  font-family: 'Indie Flower', Arial, sans-serif;\n  transform: translateY(-50%);  \n",
      ],
    )),
);
var templateObject_1, templateObject_2, templateObject_3;
//# sourceMappingURL=Header.js.map
