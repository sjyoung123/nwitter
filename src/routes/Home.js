import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "@firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import Nweet from "components/Nweet";
import { dbService, storageService } from "fbase";
import React, { useEffect, useRef, useState } from "react";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";

const Home = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);
  const [preview, setPreview] = useState(null);

  const fileInputRef = useRef();

  useEffect(() => {
    const q = query(
      collection(dbService, "nweets"),
      orderBy("createAt", "desc")
    );
    onSnapshot(q, (snapshot) => {
      const nweetArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNweets(nweetArr);
    });
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    let previewUrl = "";
    if (preview) {
      const previewRef = ref(storageService, `${userObj.uid}/${Date.now()}`);
      await uploadString(previewRef, preview, "data_url");
      previewUrl = await getDownloadURL(previewRef);
    }
    const nweetObject = {
      text: nweet,
      createAt: Date.now(),
      userId: userObj.uid,
      previewUrl,
    };
    await addDoc(collection(dbService, "nweets"), nweetObject);
    setNweet("");
    setPreview("");
    fileInputRef.current.value = "";
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNweet(value);
  };

  const onImageChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(theFile);
    reader.onload = (event) => {
      const {
        currentTarget: { result },
      } = event;
      setPreview(result);
    };
  };

  const onPreviewClear = () => {
    setPreview(null);
    fileInputRef.current.value = "";
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
        <input
          type="file"
          accept="image/*"
          onChange={onImageChange}
          ref={fileInputRef}
        />
        <input type="submit" value="Nweet" />
        {preview && (
          <div>
            <img src={preview} width="50px" height="50px" />
            <input type="submit" value="Clear" onClick={onPreviewClear} />
          </div>
        )}
      </form>
      <div>
        {nweets.map((nweet) => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.userId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};
export default Home;
