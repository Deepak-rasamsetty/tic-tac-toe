import React, { useCallback, useEffect, useState } from "react";
import TicTacComponent from "./TicTacComponent";

export default function TicTacToe({
  player,
  gameSessionId,
  setPlayerTurn,
  playerTurn,
  closeGame,
  gameStatus,
}) {
  console.log("ticTacToe rednered");
  var tictactoeRow = [];
  var tictactoeBoard = [];
  const [allBoxState, setAllBoxState] = useState(null);
  const fetchAllBoxState = useCallback(() => {
    fetch("http://localhost:8080/game/getAllBoxState/" + gameSessionId, {
      method: "GET",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((resp) => setAllBoxState(resp));
  },[gameSessionId]);
  const getBoxState = (boxIndex) => {
    if (allBoxState === null) {
      return null;
    }
    var requiredBox;
    allBoxState.forEach((boxState) => {
      if (boxState.boxIndex === boxIndex) {
        console.log("filteredBoxState - " + JSON.stringify(boxState));
        requiredBox = boxState;
      }
    });
    return requiredBox.player;
  };

  const selectBox = (boxIndex) => {
    const request = {
      gameSessionId: gameSessionId,
      player: player,
      boxIndex: boxIndex,
    };
    fetch("http://localhost:8080/game/", {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw response;
        }
      })
      .then((resp) => {
        if (resp.status === "COMPLETED") {
          console.log("get resp - " + JSON.stringify(resp));
          closeGame(resp.status, resp.message);
        } else if (resp.status === "DRAWN") {
          closeGame(resp.status, resp.message);
        }
        setPlayerTurn(false);
        fetchAllBoxState();
      })
      .catch(() => {
        console.log("error occured");
      });
  };

  for (let i = 0; i < 3; i++) {
    tictactoeRow = [];
    for (let j = 0; j < 3; j++) {
      var boxIndex = i * 3 + j + 1;
      var componentFilledBy = getBoxState(boxIndex);
      tictactoeRow.push(
        <div className="col-md-4" key={i * 3 + j}>
          <TicTacComponent
            playerTurn={playerTurn}
            boxIndex={boxIndex}
            componentFilledBy={componentFilledBy}
            selectBox={selectBox}
          />
        </div>
      );
    }
    tictactoeBoard.push(
      <div className="row" key={i}>
        {tictactoeRow}
      </div>
    );
  }

  useEffect(() => {
    if (playerTurn && gameStatus !== "") {
      fetchAllBoxState();
      if (gameStatus === "COMPLETED" || gameStatus === "DRAWN") {
        setPlayerTurn(false);
      }
    }
  }, [playerTurn, gameStatus, setPlayerTurn, fetchAllBoxState]);
  return (
    <div className="container w-50 p-3">
      <div className="card">
        <div className="card-body">{tictactoeBoard}</div>
      </div>
    </div>
  );
}
