import React from "react";
import styled, { keyframes } from "styled-components";

const Warning = ({ show, onConfirm, onCancel }) => {
  if (!show) return null;

  return (
    <Overlay>
      <StyledWrapper>
        <div className="brutalist-card">
          <div className="brutalist-card__header">
            <div className="brutalist-card__icon">
              <svg viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
            </div>
            <div className="brutalist-card__alert">Are you sure?</div>
          </div>
          <div className="brutalist-card__message">
            Editing your profile will <b>reset all daily and weekly plans</b>.
            Do you wish to proceed?
          </div>
          <div className="brutalist-card__actions">
            <button
              onClick={onCancel}
              className="brutalist-card__button brutalist-card__button--cancel"
            >
              No
            </button>
            <button
              onClick={onConfirm}
              className="brutalist-card__button brutalist-card__button--confirm"
            >
              Yes
            </button>
          </div>
        </div>
      </StyledWrapper>
    </Overlay>
  );
};

// Shake Animation
const shake = keyframes`
  0% { transform: translate(0, 0) rotate(0deg); }
  15% { transform: translate(-5px, 0) rotate(-2deg); }
  30% { transform: translate(5px, 0) rotate(2deg); }
  45% { transform: translate(-4px, 0) rotate(-1deg); }
  60% { transform: translate(4px, 0) rotate(1deg); }
  75% { transform: translate(-3px, 0) rotate(-1deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
`;

const StyledWrapper = styled.div`
  animation: ${shake} 0.5s ease;

  .brutalist-card {
    width: 320px;
    border: 4px solid #000;
    background-color: #fff;
    padding: 1.5rem;
    box-shadow: 10px 10px 0 #000;
    font-family: "Arial", sans-serif;
  }

  .brutalist-card__header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
    border-bottom: 2px solid #000;
    padding-bottom: 1rem;
  }

  .brutalist-card__icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #006d3d; /* Forkcast green */
    padding: 0.5rem;
  }

  .brutalist-card__icon svg {
    height: 1.5rem;
    width: 1.5rem;
    fill: #fff;
  }

  .brutalist-card__alert {
    font-weight: 900;
    color: #000;
    font-size: 1.5rem;
    text-transform: uppercase;
  }

  .brutalist-card__message {
    margin-top: 1rem;
    color: #000;
    font-size: 0.9rem;
    line-height: 1.4;
    border-bottom: 2px solid #000;
    padding-bottom: 1rem;
    font-weight: 600;
  }

  .brutalist-card__actions {
    margin-top: 1rem;
    display: flex;
    gap: 0.5rem;
  }

  .brutalist-card__button {
    flex: 1;
    padding: 0.75rem;
    text-align: center;
    font-size: 1rem;
    font-weight: 700;
    text-transform: uppercase;
    border: 3px solid #000;
    background-color: #fff;
    color: #000;
    position: relative;
    transition: all 0.2s ease;
    box-shadow: 5px 5px 0 #000;
    overflow: hidden;
    cursor: pointer;
  }

  .brutalist-card__button::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      120deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    transition: all 0.6s;
  }

  .brutalist-card__button:hover::before {
    left: 100%;
  }

  .brutalist-card__button:hover {
    transform: translate(-2px, -2px);
    box-shadow: 7px 7px 0 #000;
  }

  /* Cancel (No) button - lighter green tone */
  .brutalist-card__button--cancel:hover {
    background-color: #4caf50;
    border-color: #4caf50;
    color: #fff;
    box-shadow: 7px 7px 0 #2e7d32;
  }

  /* Confirm (Yes) button - dark Forkcast green */
  .brutalist-card__button--confirm {
    background-color: #006d3d;
    color: #fff;
  }

  .brutalist-card__button--confirm:hover {
    background-color: #00994d;
    border-color: #00994d;
    color: #fff;
    box-shadow: 7px 7px 0 #004d29;
  }

  .brutalist-card__button:active {
    transform: translate(5px, 5px);
    box-shadow: none;
  }
`;

export default Warning;
