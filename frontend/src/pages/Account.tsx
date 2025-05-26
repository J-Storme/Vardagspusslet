import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface FamilyMember {
  id: number;
  name: string;
  role: string;
}

const Account = () => {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('');

  // Läs in från localStorage när komponenten mountas
  useEffect(() => {
    const savedMembers = localStorage.getItem('familyMembers');
    if (savedMembers) {
      console.log('test')
      setMembers(JSON.parse(savedMembers));

    }
  }, []);

  // Spara till localStorage varje gång members ändras
  useEffect(() => {
    localStorage.setItem('familyMembers', JSON.stringify(members));
  }, [members]);

  const addMember = () => {
    if (newName.trim() === '') return;
    const newMember: FamilyMember = {
      id: Date.now(),
      name: newName.trim(),
      role: newRole.trim(),
    };
    setMembers([...members, newMember]);
    setNewName('');
    setNewRole('');
  };

  const startEditing = (member: FamilyMember) => {
    setEditId(member.id);
    setEditName(member.name);
    setEditRole(member.role);
  };

  const saveEdit = () => {
    if (editId === null) return;
    setMembers(
      members.map((m) =>
        m.id === editId ? { ...m, name: editName.trim(), role: editRole.trim() } : m
      )
    );
    cancelEdit();
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditName('');
    setEditRole('');
  };

  const deleteMember = (id: number) => {
    if (window.confirm('Vill du verkligen ta bort denna familjemedlem?')) {
      setMembers(members.filter((m) => m.id !== id));
    }
  };

  return (
    <Container>
      <h2>Hantera familjemedlemmar</h2>

      <AddMemberSection>
        <input
          type="text"
          placeholder="Namn"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Roll (t.ex. vuxen, barn)"
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
        />
        <button onClick={addMember}>Lägg till</button>
      </AddMemberSection>

      <List>
        {members.length === 0 && <p>Inga familjemedlemmar tillagda ännu.</p>}

        {members.map((member) =>
          editId === member.id ? (
            <ListItem key={member.id}>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
              <input
                type="text"
                value={editRole}
                onChange={(e) => setEditRole(e.target.value)}
              />
              <button onClick={saveEdit}>Spara</button>
              <button onClick={cancelEdit}>Avbryt</button>
            </ListItem>
          ) : (
            <ListItem key={member.id}>
              <span>
                <strong>{member.name}</strong> - {member.role}
              </span>
              <Buttons>
                <button onClick={() => startEditing(member)}>Redigera</button>
                <button onClick={() => deleteMember(member.id)}>Ta bort</button>
              </Buttons>
            </ListItem>
          )
        )}
      </List>
    </Container>
  );
};

export default Account;

// Styled Components

const Container = styled.div`
  max-width: 500px;
  margin: 20px auto;
  padding: 10px;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 0 8px rgba(0,0,0,0.1);
`;

const AddMemberSection = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  input {
    flex: 1;
    padding: 6px 10px;
    font-size: 16px;
  }
  button {
    padding: 6px 12px;
    font-size: 16px;
    cursor: pointer;
  }
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
`;

const ListItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;

  input {
    font-size: 16px;
    padding: 4px 8px;
    margin-right: 8px;
  }

  span {
    flex: 1;
  }
`;

const Buttons = styled.div`
  button {
    margin-left: 8px;
    padding: 4px 8px;
    cursor: pointer;
  }
`;
