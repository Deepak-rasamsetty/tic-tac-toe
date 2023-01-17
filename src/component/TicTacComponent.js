import React from "react";

export default function TicTacComponent(props) {
  const componentDisplay =
    props.componentFilledBy === "0" || props.componentFilledBy === null ? (
      <i className="bi bi-app"></i>
    ) : props.componentFilledBy === "P1" ? (
      <i className="bi bi-x-lg"></i>
    ) : (
      <i className="bi bi-circle"></i>
    );

  const handleBoxSelect = () => {
    props.selectBox(props.boxIndex);
  };

  return (
    <button
      className="btn btn-light"
      onClick={handleBoxSelect}
      disabled={!props.playerTurn}
    >
      <h1>{componentDisplay}</h1>
    </button>
  );
}
