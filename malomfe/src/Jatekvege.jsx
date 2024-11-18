import { useNavigate, useParams } from "react-router-dom";

function Jatekvege() {
  const navigator = useNavigate();
  const { message, win } = useParams();
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-sm-5 mx-auto mt-5 bc">
            <div className="gks h-100 fs-1 text-center text-light">
              {decodeURIComponent(atob(message))}
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-4 mt-3 mx-auto">
          <button
            className="btn btn-dark p-3 fs-4 w-100"
            onClick={() => navigator("/")}
          >
            Új játék
          </button>
        </div>
      </div>
    </>
  );
}
export default Jatekvege;
