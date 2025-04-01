import { useAuth } from "@/context/AuthContext";
import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <Link to="/" className="navbar-brand">
          Conduit
        </Link>
        
        <ul className="nav navbar-nav pull-xs-right">
          <li className="nav-item">
            <Link to="/" className="nav-link">Home</Link>
          </li>

          {!user ? (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link">Sign in</Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link">Sign up</Link>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/editor" className="nav-link">
                  <i className="ion-compose"></i> New Post
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/settings" className="nav-link">
                  <i className="ion-gear-a"></i> Settings
                </Link>
              </li>
              <li className="nav-item">
                <button className="nav-link btn btn-link" onClick={logout}>
                  <i className="ion-log-out"></i> Logout
                </button>
              </li>
              <li className="nav-item">
                <Link to={`/profile/${user.username}`} className="nav-link">
                  <img src={user?.image || ""} className="user-pic" />
                  {user?.username}
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
