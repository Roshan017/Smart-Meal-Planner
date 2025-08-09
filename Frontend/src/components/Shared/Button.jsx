import React from "react";
import styled from "styled-components";

const Button = ({ title, onClick, sub }) => {
  return (
    <StyledWrapper>
      <button onClick={onClick}>
        <span className="title">{title}</span>
        {sub && <span className="subtitle">{sub}</span>}
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;

  button {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 4px;
    height: 200px;
    width: 300px;
    padding: 0 30px;
    border-left: 4px solid #08c18a;
    border-right: 4px solid #08c18a;
    background: #ffffff;
    color: #08c18a;
    font-weight: 600;
    font-size: 25px;
    font-family: inherit;
    user-select: none;
    transition: all 0.15s ease;
    text-align: center;
  }

  .title {
    font-size: 25px;
    font-weight: 600;
  }

  .subtitle {
    font-size: 16px;
    font-style: italic;
    font-weight: 300;
    color: #6b7280; /* gray-500 */
  }

  button:hover {
    cursor: pointer;
    background: #08c18a;
    color: #ffffff;
  }

  button:hover .subtitle {
    color: #e5e7eb; /* light gray when hovered */
  }

  button:active {
    transform: scale(0.95);
    background: #06a87a;
  }
`;

export default Button;
