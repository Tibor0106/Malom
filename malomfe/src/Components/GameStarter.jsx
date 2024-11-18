import { useState, useRef, useContext } from "react";
import { GameContext } from "../Providers/GameProvider";
function GameStarter() {
  const nameRef = useRef();
  const [name, setName] = useState("");

  const { currentUser, setCurrentUser } = useContext(GameContext);

  const handleInputChange = () => {
    setName(nameRef.current.value);
  };

  return (
    <div className="">
      <h1 className="text-center my-1">Malom</h1>
      <h5 className="text-center my-1">Malmozz online a barátaiddal</h5>

      <div className="row">
        <div className="col-sm-4 mx-auto">
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <div className="gs mt-5">
            <h3>Játék kezdése</h3>
            <label>Add meg a Játékosneved!</label>
            <div className="input-group">
              <input
                type="text"
                className="form-control w-100"
                placeholder="mintaron"
                ref={nameRef}
                onChange={handleInputChange}
              />
            </div>
            <div className="input-group mt-2">
              <button
                className="btn btn-success"
                onClick={() => {
                  setCurrentUser(nameRef.current.value);
                }}
                disabled={name.length == 0}>
                Játék keresése
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameStarter;
