import { authService } from "fbase";
import React from "react";
import { Link } from "react-router-dom";

const Profile = () => {
  const onLogOutClick = () => {
    authService.signOut();
  };
  return (
    <>
      <button onClick={onLogOutClick}>
        <Link to="/">Log out</Link>
      </button>
    </>
  );
};
export default Profile;
