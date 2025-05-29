import { Link } from 'react-router-dom';
import { useState } from 'react';
import styled from 'styled-components';
import { useLogin } from '../context/LoginContext';

function Navbar() {
  const { isLoggedIn, logout } = useLogin();

  return (
    <NavbarContainer>
      <NavbarList>

        <NavbarItemWithDropdown>
          <NavbarLink to="/">Hem</NavbarLink>
          <DropdownMenu>
            <DropdownItem>
              <Link to="/tasks">Uppgifter</Link>
            </DropdownItem>
            {!isLoggedIn && (
              <DropdownItem>
                <Link to="/login">Logga in</Link>
              </DropdownItem>
            )}
            {isLoggedIn && (
              <DropdownItem onClick={(event) => {
                event.preventDefault();
                logout();
              }}>
                <Link to="/">Logga ut</Link>
              </DropdownItem>
            )}
          </DropdownMenu>
        </NavbarItemWithDropdown>

        <NavbarItem>
          <NavbarLink to="/tasks">Tasks</NavbarLink>
        </NavbarItem>

        <NavbarItem>
          <NavbarLink to="/account">Hantera konto</NavbarLink>
        </NavbarItem>
      </NavbarList>

      <TasksIconContainer>
        <TasksIconWithHover>
          <Link to="/tasks">
          </Link>
        </TasksIconWithHover>
      </TasksIconContainer>
    </NavbarContainer>
  );
}

//Styling
const TasksIconContainer = styled.div`
  position: relative;
  display: inline-block;
  left: -10px;
`;

const TasksIconImage = styled.img`
  width: 40px;
  height: 40px;
`;

const NumberofItems = styled.span`
  position: absolute;
  top: 10px;
  right: -14px;
  background-color: rgb(241, 36, 180);
  color: #ffffff;
  padding: 3px 6px;
  font-size: 12px;
  border-radius: 50%;
  width: 20px;
  height: 20px;
`;

const TasksIconWithHover = styled.div`
  position: relative;

  &:hover {
    opacity: 1; 
  }
`;

const NavbarContainer = styled.nav`
  width: 100%;
  background-color: rgb(117, 119, 212);
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const NavbarList = styled.ul`
  list-style: none;
  display: flex;
  gap: 30px; 
  margin: 0;
  padding: 0;
`;

const NavbarItem = styled.li`
  margin: 0 15px;
`;

const NavbarLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 18px;

  &:hover {
    color: #ddd;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background-color: rgb(223, 217, 223);
  width: 95px;
  border-radius: 3px;
  box-shadow: 1px 2px 10px rgba(0, 0, 0, 0.2);
  display: none;  /* Dölj menyn som standard */
  flex-direction: column;
  padding: 0;
`;

const DropdownItem = styled.div`
  padding: 8px;
  color: white;
  text-align: center;
 border: solid black;
  width: 100%;
  &:hover {
    background-color: rgb(187, 183, 183);
  }
  a {
    color: black;
    text-decoration: none;
  }
`;

// Visa dropdown-menyn när man hovrar över navbaritem
const NavbarItemWithDropdown = styled(NavbarItem)` 
 position: relative;
  &:hover ${DropdownMenu} {
    display: flex;  /* Visa dropdown när man hovrar över "Hem" */
  }
`;

export default Navbar;
