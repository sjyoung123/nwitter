import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
} from "@firebase/firestore";
import { dbService } from "fbase";
import React, { useEffect } from "react";
import { useState } from "react/cjs/react.development";

const Home = () => {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);

  useEffect(() => {
    getNweets();
  }, []);

  const getNweets = async () => {
    const q = query(collection(dbService, "nweets"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((document) => {
      const nweetObj = {
        ...document.data(),
        id: document.id,
      };
      setNweets((prev) => [nweetObj, ...prev]);
    });
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    await addDoc(collection(dbService, "nweets"), {
      nweet,
      createAt: Date.now(),
    });
    setNweet("");
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNweet(value);
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          value={nweet}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="submit" value="Nweet" />
      </form>
      <div>
        {nweets.map((nweet) => (
          <div key={nweet.id}>
            <h4>{nweet.nweet}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Home;
