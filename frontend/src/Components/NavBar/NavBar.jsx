import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import "./navbar.css";
import { logoutUser } from "../../Redux/apiRequest";
import { createAxiosInstance } from "../../axiosInstance";
import { logoutSuccess } from "../../Redux/authSlice";

const NavBar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.login?.currentUser);
    const id = user?._id;
    const accessToken = user?.accessToken;
    let axiosJWT = createAxiosInstance(user, dispatch, logoutSuccess);

    const handleLogout = () => {
        logoutUser(accessToken, id, dispatch, navigate, axiosJWT);
    };

    return (
        <nav className="navbar-container">
            <Link to="/" className="navbar-home">
                {" "}
                Home{" "}
            </Link>
            {user ? (
                <>
                    <p className="navbar-user">
                        Hi, <span> {user.email} </span>{" "}
                    </p>
                    <Link
                        to="/logout"
                        className="navbar-logout"
                        onClick={handleLogout}
                    >
                        {" "}
                        Log out
                    </Link>
                </>
            ) : (
                <>
                    <Link to="/login" className="navbar-login">
                        {" "}
                        Login{" "}
                    </Link>
                    <Link to="/register" className="navbar-register">
                        {" "}
                        Register
                    </Link>
                </>
            )}
        </nav>
    );
};

export default NavBar;
