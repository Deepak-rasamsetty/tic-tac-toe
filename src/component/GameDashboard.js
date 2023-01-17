import React, { useCallback, useEffect, useRef, useState } from "react";
import TicTacToe from "./TicTacToe";

export default function GameDashboard() {
  const [player, setPlayer] = useState(null);
  const [gameSessionId, setgameSessionId] = useState(0);
  const [gameStatus, setGameStatus] = useState("");
  const [message, setMessage] = useState("");
  const [playerTurn, setPlayerTurn] = useState(false);
  const gameIdInputRef = useRef("");
  const [alertmessage, setAlertMessage] = useState('');
  const closeGame = (status, message) => {
    setGameStatus(status);
    setMessage(message);
  };
  const fetchAndUpdatePlayerTurn = useCallback(() => {
     fetch(
      "http://localhost:8080/game/gameStatus/" + gameSessionId + "/" + player,
      {
        method: "GET",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((resp) => {
        console.log("resp.status - " + resp.status);
        if (resp.status === "COMPLETED" || resp.status === "DRAW") {
          console.log("completed");
          setGameStatus(resp.status);
          setMessage(resp.message);
          setPlayerTurn(true);
        } else {
          console.log("in progress");
          setPlayerTurn(resp.playerTurn);
        }
      });
  },[gameSessionId,player]);
  const createGame = () => {
    fetch("http://localhost:8080/game/create", {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((resp) => {
        console.log("resp - " + resp);
        setgameSessionId(resp);
      });
    setGameStatus("INPROGRESS");
    setPlayer("P1");
    setAlertMessage('Created game and joined as Player 1. Please Share the code to join the game');
  };
  const joinGame = () => {
    setgameSessionId(gameIdInputRef.current.value);
    setGameStatus("INPROGRESS");
    setPlayer("P2");
    setAlertMessage('Joined game joined as Player 2');
  };
  useEffect(() => {
    if (!playerTurn && gameSessionId!==0 && gameStatus === "INPROGRESS") {
      const interval = setInterval(() => {
        console.log("This will run every second!");
        fetchAndUpdatePlayerTurn();
      }, 200);
      return () => clearInterval(interval);
    }
  },[playerTurn, gameSessionId, gameStatus, fetchAndUpdatePlayerTurn]);
  return (
    <div>
      {gameSessionId === 0 ? (
        <div className="container justify-content-center w-50 p-1 my-4">
          <div class="input-group mb-3">
            <button className="btn btn-light" onClick={createGame}>
              Create game
            </button>

            <input
              type="text"
              class="form-control"
              placeholder=""
              aria-label="Example text with two button addons"
              ref={gameIdInputRef}
            />
            <button className="btn btn-light" onClick={joinGame}>
              Join Game
            </button>
          </div>
        </div>
      ) : (
        <div className="container justify-content-center w-50 p-3">
          <div class="alert alert-secondary text-center" role="alert">
            {alertmessage + ' Game code - '+gameSessionId}
          </div>
          <div className="card">
            <div className="card-header text-center">
              {gameStatus === "COMPLETED" || gameStatus === "DRAW"
                ? message
                : playerTurn
                ? "Your turn"
                : "opponents Turn"}
            </div>
            <div className="card-body">
              <TicTacToe
                player={player}
                gameSessionId={gameSessionId}
                setPlayerTurn={setPlayerTurn}
                playerTurn={playerTurn}
                closeGame={closeGame}
                gameStatus={gameStatus}
              />
            </div>
          </div>


        </div>
      )}
    </div>
  );
}
