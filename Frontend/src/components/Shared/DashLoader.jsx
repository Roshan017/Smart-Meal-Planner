import React from "react";
import styled from "styled-components";

const DashLoader = () => {
  return (
    <StyledWrapper>
      <div className="spinner">
        <img
          src={"/images/Logo-NoBg1.png"}
          alt="ForkCast Logo"
          className="logo"
        />
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #ffffff;

  .spinner {
    --size-of-spinner: 80px;
    --spinner-border-width: 4px;
    --spinner-color: #08c18a;
    --circle-color: #8bc34a24;
    --speed-of-animation: 1s;
    --scale: 1.3;

    width: var(--size-of-spinner);
    height: var(--size-of-spinner);
    background: var(--circle-color);
    border-radius: 50%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .spinner img.logo {
    width: 60%;
    height: 60%;
    object-fit: contain;
    pointer-events: none;
  }

  .spinner::after {
    content: "";
    position: absolute;
    border-radius: 50%;
    inset: 0;
    border: var(--spinner-border-width) solid var(--spinner-color);
    border-left-color: transparent;
    border-right-color: transparent;
    animation: spinny var(--speed-of-animation) linear infinite;
  }

  @keyframes spinny {
    0% {
      transform: rotate(0deg) scale(1);
    }
    50% {
      transform: rotate(45deg) scale(var(--scale));
    }
    100% {
      transform: rotate(360deg) scale(1);
    }
  }
`;

export default DashLoader;
