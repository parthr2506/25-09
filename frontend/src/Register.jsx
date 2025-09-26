import { useState, useEffect } from "react";
import api from "./api";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./useAuth";

const Register = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState("")
    const { isAuthenticated } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/home", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('auth/register', formData);
            setMessage("SignUp Successefull Redirecting....")
            setFormData({ name: '', email: '', password: '' });
            navigate("/login");

        } catch (error) {
            console.error('Error:', error);
            setMessage("Signup Failed Try Again")
        }
    };

    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }
    return (
        <div className="form">
            <form onSubmit={handleSubmit}>
                <h2>SignUp</h2>
                {/* <label htmlFor="name">Name:</label>
                <br />
                <input type="text" name="name" id="name" placeholder="name" value={formData.name} onChange={handleChange} required />
                <br /><br /> */}
                <label htmlFor="email">Email:</label>
                <br />
                <input type="email" name="email" id="email" placeholder="email" value={formData.email} onChange={handleChange} required />
                <br /><br />

                <label htmlFor="password">Password:</label>
                <br />
                <input type="password" name="password" id="password" placeholder="password" value={formData.password} onChange={handleChange} required />
                <br /><br />

                <button type="submit">Submit</button>
                {message && <p>{message}</p>}
            </form>
            <p>Already a user
                <br></br>
                <Link to='/login'>
                    Login
                </Link>
            </p>
        </div>
    );
};

export default Register;


