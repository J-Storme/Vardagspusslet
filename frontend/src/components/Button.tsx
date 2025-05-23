import styled from 'styled-components';

// Definierar typ för propsen
interface ButtonProps {
  onClick: () => void; // void talar om för typescript att funktionen inte returnerar ett värde
  children: React.ReactNode; // children är en ReactNode, vilket betyder att den kan vara vad som helst som kan renderas i React (text, element, etc.)
  disabled?: boolean; // Disabled är en valfri prop
}

function Button({ onClick, children, disabled = false }: ButtonProps) {
  // children är det som finns inuti knappen (ex text eller ikon).
  return (
    <StyledButton onClick={onClick} disabled={disabled}>
      {children}
    </StyledButton>
  );
}

// Styling
const StyledButton = styled.button`
   button {
    margin-top: 20px;
    padding: 10px;
    font-size: 16px;
    background-color: #5b5fc7;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  
    &:hover {
    background-color: rgb(227, 166, 217);
  }

  &:disabled {
    background-color: rgb(151, 149, 151);
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export default Button;