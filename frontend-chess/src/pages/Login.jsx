import React, {useState } from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import "./Pages.css";

const Login = ({ onLoginSucess }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8082/api/auth/login", {username, password});
            
            if (response.data) {
                onLoginSucess(response.data.username);
                navigate("/dashboard");
            }
        }
        catch (err) {
            if (err.response) {
                const status = err.response.status;
                
                if (status === 401 || status === 403) {
                    setError("Identifiants incorrects");
                } else if (status === 500) {
                    setError("Erreur serveur. Veuillez réessayer plus tard.");
                } else {
                    setError(err.response.data?.message || "Erreur de connexion");
                }
            } else if (err.request) {
                setError("Impossible de contacter le serveur");
            } else {
                setError("Erreur inattendue. Veuillez réessayer.");
            }
            
            console.error("Erreur de connexion:", err);
        }
    };

    return (
    <div className="login-container">
      <div className="login-box">
        <h1> Connexion </h1>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Pseudo</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ex: JRRZF"
            />
          </div>
          <div className="form-group">
            <label>Mot de passe</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="ex: chessplayer0830"
            />
          </div>
          {error && <p className="error-msg">{error}</p>}
          <button type="submit" className="btn-login">Entrer dans l'arène</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
