import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import "./Styles/style.css";
import Home from "./Home";
import { SocketProvider } from "./Providers/SocketProvider";
import { GameProvider } from "./Providers/GameProvider";
import Cookies from "js-cookie";
import Jatekvege from "./Jatekvege"
const root = ReactDOM.createRoot(document.getElementById("root"));

const Rules = () => {
  const navigator = useNavigate();
  const loc = useLocation();
  useEffect(() => {
    if(loc.pathname != '/') return;
    var accepted = Cookies.get("accepted");
    if(accepted != null){
      return navigator("/play");
    }
  }, [])
  return (
    <div className="row">
      <div className="col-sm-6 mx-auto text-center mt-5">
      <div className="rules text-light">
        <h1><b>Szabályok</b></h1>
        <h2>
            <p>Bábuk elhelyezése:</p>
        </h2>

        Mindkét játékos 9 bábuval játszik.
        <br/>
        A játékosok felváltva helyeznek le egy-egy bábut a tábla üres pontjaira.
        <br/>
        Ha három bábu egymás mellett vagy alatt helyezkedik el, "malom" alakul ki, és az ellenféltől el lehet venni egy
        bábut (nem vehető el olyan bábu, amely már egy malom része, kivéve, ha nincs más lehetőség).
        <br/>
        <h2>
            <p>Mozgatás:</p>
        </h2>
        Miután az összes bábu a táblán van, a játékosok felváltva mozgatják bábukat a szomszédos pontokra. <br/>
        Mozgatni csak az üres szomszédos pontokra lehet.
        <br/>
        <h2>
            <p>Ugrás:</p>
        </h2>
        Ha egy játékosnak már csak 3 bábuja van, azok bárhová ugorhatnak a táblán.
        <br/>
        <h2>
            <p>Nyert állapot:</p>
        </h2>
        Egy játékos nyer, ha az ellenfelének csak 2 bábuja marad, vagy nem tud lépni.
    </div>
      </div>

      <div className="d-flex justify-content-center"><button className="btn btn-success mt-4 fs-4" onClick={() => {navigator("/play"); Cookies.set("accepted", true)}}>Megértettem, kezdődjön a játék</button></div>
    </div>
    
     
   
  )
}
root.render(
  <SocketProvider>
    <BrowserRouter>
      <Routes>
        <Route
          path="/play"
          element={
            <GameProvider>
              <Home />
            </GameProvider>
          }
          
        />
         <Route
          path="/"
          element={
           <Rules/>
          }
          
        />
        <Route
          path="/jateknak-vege/:message"
          element={
           <Jatekvege/>
          }
          
        />
      </Routes>
    </BrowserRouter>
  </SocketProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
