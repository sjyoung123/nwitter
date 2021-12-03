import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "@firebase/firestore";
import { authService, dbService } from "fbase";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Profile = ({ userObj }) => {
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
  }, []);

  return (
    <>
      <button onClick={onLogOutClick}>
        <Link to="/">Log out</Link>
      </button>
    </>
  );
};
export default Profile;
