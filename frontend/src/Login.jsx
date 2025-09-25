import { useState, useEffect } from "react";
import api from './api';
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./useAuth";

const Login = () => {
    const { setIsAuthenticated, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: "",
        password: ""
    });
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/home", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage("");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("auth/login", form);
            setMessage("Login Successful Redirecting...");
            setIsAuthenticated(true);
        } catch (err) {
            console.error(err);
            setMessage("Invalid Credentials try again");
        }
    };

    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    return (
        <div className="form">
            <form onSubmit={handleSubmit}>
                <h2>Login</h2>
                <label htmlFor="email">Email:</label>
                <br />
                <input name="email" id="email" placeholder="email" onChange={handleChange} />
                <br /><br />
                <label htmlFor="password">Password:</label>
                <br />
                <input type="password" name="password" id="password" placeholder="password" onChange={handleChange} />
                <br /><br />
                <button type="submit">Login</button>
                {message && <p>{message}</p>}

            </form>
            <p>Not a User
                <br></br>
                <Link to='/'>
                    Signup
                </Link>
            </p>
        </div>
    );
};

export default Login;
