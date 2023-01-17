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
 
  const [lastUpdatedElement, setLastUpdatedElement] = useState(null);
  
  const fetchLastUpdatedComponent = useCallback(() => {
    console.log('inside fetchLastUpdatedComponent');
    fetch("http://localhost:8080/game/getLastUpdatedComponent/" + gameSessionId, {
      method: "GET",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((resp) => setLastUpdatedElement(resp));
  },[gameSessionId]);


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
        console.log("get resp - " + JSON.stringify(resp));
        if (resp.status === "COMPLETED") {
          
          closeGame(resp.status, resp.message);
        } else if (resp.status === "DRAWN") {
          closeGame(resp.status, resp.message);
        }
        setPlayerTurn(false);
        fetchLastUpdatedComponent();
      })
      .catch(() => {
        console.log("error occured");
      });
  };

  for (let i = 0; i < 3; i++) {
    tictactoeRow = [];
    for (let j = 0; j < 3; j++) {
      var boxIndex = i * 3 + j + 1;
     var isUpdated = lastUpdatedElement===boxIndex;
      tictactoeRow.push(
        <div className="col-md-4" key={i * 3 + j}>
          <TicTacComponent
            playerTurn={playerTurn}
            boxIndex={boxIndex}
           isUpdated= {isUpdated}
            selectBox={selectBox}
            gameSessionId={gameSessionId}
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
      fetchLastUpdatedComponent();
      if (gameStatus === "COMPLETED" || gameStatus === "DRAWN") {
        setPlayerTurn(false);
      }
    }
  }, [playerTurn, gameStatus, setPlayerTurn, fetchLastUpdatedComponent]);
  return (
    <div className="container w-50 p-3">
      <div className="card">
        <div className="card-body">{tictactoeBoard}</div>
      </div>
    </div>
  );
}
