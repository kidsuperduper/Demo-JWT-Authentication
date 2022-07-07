import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { deleteUser, getAllUsers } from "../../Redux/apiRequest";
import "./home.css";
import { createAxiosInstance } from "../../axiosInstance";
import { loginSuccess } from "../../Redux/authSlice";

const HomePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.login?.currentUser);
    const userList = useSelector((state) => state.users.users?.allUsers);
    const msg = useSelector((state) => state.users?.msg);
    let axiosJWT = createAxiosInstance(user, dispatch, loginSuccess);

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }

        if (user?.accessToken) {
            getAllUsers(user?.accessToken, dispatch, axiosJWT);
        }
    }, []);

    const handleDelete = (id) => {
        if (!user) {
            navigate("/login");
        }
        if (user?.accessToken) {
            deleteUser(user?.accessToken, dispatch, id, axiosJWT);
        }
    };

    return (
        <main className="home-container">
            <div className="home-title">User List</div>
            <div className="home-role">{`Your role: ${
                user?.admin ? `Admin` : `User`
            }`}</div>
            <div className="home-userlist">
                {userList?.map((user, index) => {
                    return (
                        <div key={index} className="user-container">
                            <div className="home-user">{user.email}</div>
                            <div
                                className="delete-user"
                                onClick={() => handleDelete(user._id)}
                            >
                                {" "}
                                Delete{" "}
                            </div>
                        </div>
                    );
                })}
            </div>
            <br />
            <div className="errorMessage">{msg}</div>
        </main>
    );
};

export default HomePage;
