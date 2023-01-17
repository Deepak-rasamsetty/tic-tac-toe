import React, { useEffect, useState, useCallback } from "react";

export default function TicTacComponent(props) {
  console.log(props.boxIndex+ ' is rendereed, props - '+ JSON.stringify(props));
  const [componentFilledBy, setComponentFilledBy] = useState(null);
  const fetchComponenetFilledBy = useCallback(() => {
    fetch("http://localhost:8080/game/componentFilledBy/" + props.gameSessionId+"/"+props.boxIndex, {
      method: "GET",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((resp) => setComponentFilledBy(resp.player));
  },[props.gameSessionId]);
  const componentDisplay =
    componentFilledBy === "0" || componentFilledBy === null ? (
      <i className="bi bi-app"></i>
    ) : componentFilledBy === "P1" ? (
      <i className="bi bi-x-lg"></i>
    ) : (
      <i className="bi bi-circle"></i>
    );

  const handleBoxSelect = () => {
    props.selectBox(props.boxIndex);
  };
  useEffect(()=>{
    if( typeof props.gameSessionId!=='undefined' && props.isUpdated){
      fetchComponenetFilledBy();
    }

  },[fetchComponenetFilledBy, props.isUpdated])

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
