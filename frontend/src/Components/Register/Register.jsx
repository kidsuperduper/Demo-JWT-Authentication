import { useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { registerUser } from "../../Redux/apiRequest";
import "./register.css";
const Register = () => {
    const emailRef = useRef();
    const passwordRef = useRef();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();
        const newUser = {
            email: emailRef.current.value,
            password: passwordRef.current.value,
        };
        registerUser(newUser, dispatch, navigate);
    };

    return (
        <section className="register-container">
            <div className="register-title"> Sign up </div>
            <form onSubmit={handleRegister}>
                <label>EMAIL</label>
                <input
                    ref={emailRef}
                    type="text"
                    placeholder="Enter your email"
                />
                <label>PASSWORD</label>
                <input
                    ref={passwordRef}
                    type="password"
                    placeholder="Enter your password"
                />
                <button type="submit"> Create account </button>
            </form>
        </section>
    );
};

export default Register;
