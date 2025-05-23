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
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import styled from 'styled-components';
var Tasks = function () {
    var _a = useState([]), tasks = _a[0], setTasks = _a[1];
    var _b = useState(true), loading = _b[0], setLoading = _b[1];
    var _c = useState(null), error = _c[0], setError = _c[1];
    // Hämta uppgifter när komponenten laddas
    useEffect(function () {
        fetch('http://localhost:8080/tasks') // Hämta från backend
            .then(function (response) {
            if (!response.ok) {
                throw new Error('Något gick fel vid hämtning');
            }
            return response.json(); // Konvertera svaret till JSON
        })
            .then(function (data) {
            setTasks(data); // Spara uppgifterna i state
            setLoading(false);
        })
            .catch(function (error) {
            console.error(error);
            setError('Kunde inte hämta uppgifter');
            setLoading(false);
        });
    }, []);
    // Markera uppgift som klar/ej klar
    var toggleTask = function (id) {
        fetch("http://localhost:8080/tasks/".concat(id, "/toggle"), {
            method: 'PATCH',
        })
            .then(function (response) {
            if (!response.ok) {
                throw new Error('Misslyckades med att uppdatera uppgift');
            }
            setTasks(function (prev) {
                return prev.map(function (task) {
                    return task.id === id ? __assign(__assign({}, task), { completed: !task.completed }) : task;
                });
            });
        })
            .catch(function (err) {
            console.error(err);
        });
    };
    // Radera uppgift
    var deleteTask = function (id) {
        fetch("http://localhost:8080/tasks/".concat(id), {
            method: 'DELETE',
        })
            .then(function (response) {
            if (!response.ok) {
                throw new Error('Misslyckades med att radera uppgift');
            }
            setTasks(function (prev) { return prev.filter(function (task) { return task.id !== id; }); });
        })
            .catch(function (err) {
            console.error(err);
        });
    };
    if (loading)
        return _jsx("p", { children: "Laddar uppgifter..." });
    if (error)
        return _jsx("p", { children: error });
    return (_jsxs(Container, { children: [_jsx("h2", { children: "Uppgifter" })
            // Om det inte finn snågra uppgifter visas denna
            , "// Om det inte finn sn\u00E5gra uppgifter visas denna", tasks.length === 0 && _jsx("p", { children: "Inga uppgifter hittades." }), tasks.map(function (task) { return (_jsxs(TaskCard, { completed: task.completed, children: [_jsx("h3", { children: task.title }), task.description && _jsx("p", { children: task.description }), task.due_date && _jsxs("p", { children: [_jsx("strong", { children: "Deadline:" }), " ", task.due_date] }), _jsxs(ButtonGroup, { children: [_jsx(ToggleButton, { onClick: function () { return toggleTask(task.id); }, completed: task.completed, children: task.completed ? 'Ej klar' : 'Markera klar' }), _jsx(DeleteButton, { onClick: function () { return deleteTask(task.id); }, children: "Radera" })] })] }, task.id)); })] }));
};
export default Tasks;
// styling
var Container = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  padding: 2rem;\n"], ["\n  padding: 2rem;\n"])));
var TaskCard = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  border: 1px solid #ccc;\n  margin-bottom: 1rem;\n  padding: 1rem;\n  border-radius: 8px;\n  background-color: ", ";\n\n  h3 {\n    text-decoration: ", ";\n  }\n"], ["\n  border: 1px solid #ccc;\n  margin-bottom: 1rem;\n  padding: 1rem;\n  border-radius: 8px;\n  background-color: ", ";\n\n  h3 {\n    text-decoration: ", ";\n  }\n"])), function (_a) {
    var completed = _a.completed;
    return (completed ? '#e0ffe0' : '#fff');
}, function (_a) {
    var completed = _a.completed;
    return (completed ? 'line-through' : 'none');
});
var ButtonGroup = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  margin-top: 1rem;\n"], ["\n  margin-top: 1rem;\n"])));
var ToggleButton = styled.button(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  background-color: ", ";\n  color: white;\n  border: none;\n  padding: 0.5rem 1rem;\n  border-radius: 6px;\n  cursor: pointer;\n"], ["\n  background-color: ", ";\n  color: white;\n  border: none;\n  padding: 0.5rem 1rem;\n  border-radius: 6px;\n  cursor: pointer;\n"])), function (_a) {
    var completed = _a.completed;
    return (completed ? '#2ecc71' : '#bdc3c7');
});
var DeleteButton = styled.button(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  background-color: #e74c3c;\n  color: white;\n  border: none;\n  padding: 0.5rem 1rem;\n  border-radius: 6px;\n  margin-left: 10px;\n  cursor: pointer;\n"], ["\n  background-color: #e74c3c;\n  color: white;\n  border: none;\n  padding: 0.5rem 1rem;\n  border-radius: 6px;\n  margin-left: 10px;\n  cursor: pointer;\n"])));
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
//# sourceMappingURL=Tasks.js.map