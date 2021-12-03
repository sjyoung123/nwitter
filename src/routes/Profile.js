import { updateProfile } from "@firebase/auth";
import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "@firebase/firestore";
import { authService, dbService } from "fbase";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Profile = ({ userObj, refreshUser }) => {
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

  const onLogOutClick = () => {
    authService.signOut();
  };

  const getMyNweet = async () => {
    const nweetsArry = await getDocs(
      query(
        collection(dbService, "nweets"),
        where("userId", "==", userObj.uid),
        orderBy("createAt", "desc")
      )
    );
    console.log(nweetsArry.docs.map((doc) => doc.data()));
  };

  useEffect(() => {
    getMyNweet();
  }, [userObj]);

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    await updateProfile(authService.currentUser, {
      displayName: newDisplayName,
    });
    refreshUser();
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Update your username"
          value={newDisplayName}
          onChange={onChange}
        />
        <input type="submit" value="Update" />
      </form>

      <button onClick={onLogOutClick}>
        <Link to="/">Log out</Link>
      </button>
    </>
  );
};
export default Profile;
