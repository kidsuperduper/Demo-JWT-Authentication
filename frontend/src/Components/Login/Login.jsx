import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../Redux/apiRequest";
import { useDispatch } from "react-redux";
import { useRef } from "react";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const emailRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = (e) => {
        e.preventDefault();
        const user = {
            email: emailRef.current.value,
            password: passwordRef.current.value,
        };
        loginUser(user, dispatch, navigate);
    };

    return (
        <section className="login-container">
            <div className="login-title"> Log in</div>
            <form onSubmit={handleSubmit}>
                <label>USERNAME</label>
                <input
                    ref={emailRef}
                    type="text"
                    placeholder="Enter your username"
                />
                <label>PASSWORD</label>
                <input
                    ref={passwordRef}
                    type="password"
                    placeholder="Enter your password"
                />
                <button type="submit"> Continue </button>
            </form>
            <div className="login-register"> Don't have an account yet? </div>
            <Link className="login-register-link" to="/register">
                Register one for free{" "}
            </Link>
        </section>
    );
};

export default Login;
