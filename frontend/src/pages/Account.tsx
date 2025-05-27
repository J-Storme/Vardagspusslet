import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLogin } from '../context/LoginContext';

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
  const [userName, setUserName] = useState<string>('');

  const token = localStorage.getItem('token');

  // Hämta suerName från local storage
  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  // Hämta familjemedlemar från backend
  useEffect(() => {
    if (!token) return;

    const fetchMembers = async () => {
      try {
        const response = await fetch('/api/family-members', {
          headers: {
            'Authorization': `Bearer ${token}` // Eller bara token
          }
        });

        if (!response.ok) {
          throw new Error('Misslyckades med att hämta familjemedlemmar');
        }

        const data = await response.json();
        setMembers(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMembers();
  }, [token]);

  const addMember = async () => {
    if (newName.trim() === '') return;

    try {
      const response = await fetch('/api/family-members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token || ''
        },
        body: JSON.stringify({
          name: newName.trim(),
          role: newRole.trim(),
          profile_image: null
        })
      });

      if (!response.ok) {
        throw new Error('Kunde inte lägga till familjemedlem');
      }

      const newMember = await response.json();
      setMembers([...members, newMember]);
      setNewName('');
      setNewRole('');
    } catch (error) {
      console.error(error);
    }
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

  const deleteMember = async (id: number) => {
    if (!window.confirm('Vill du verkligen ta bort denna familjemedlem?')) return;

    try {
      const response = await fetch(`/api/family-members/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token || ''
        }
      });

      if (!response.ok) {
        throw new Error('Kunde inte ta bort familjemedlem');
      }

      setMembers(members.filter((m) => m.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <h2>Hantera familjemedlemmar</h2>
      <p>Lägg till medlemmar i hushåll {userName}</p>

      <AddMemberSection>
        <input
          type="text"
          placeholder="Namn"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
          <option value="">Välj roll</option>
          <option value="vuxen">Vuxen</option>
          <option value="barn">Barn</option>
        </select>
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
                onChange={(event) => setEditName(event.target.value)}
              />
              <input
                type="text"
                value={editRole}
                onChange={(event) => setEditRole(event.target.value)}
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
  margin: 40px auto;
  padding: 10px;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 0 8px rgba(0,0,0,0.1);

h2 {
margin-top: 20px;
}

p {
margin-top: 28px;
margin-bottom: 10px;
}
`;

const AddMemberSection = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
  margin-bottom: 40px;
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
