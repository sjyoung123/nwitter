import { addDoc, collection } from "@firebase/firestore";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { dbService, storageService } from "fbase";
import { v4 as uuidv4 } from "uuid";
import React, { useRef, useState } from "react";

const NweetFactory = ({ userObj }) => {
  const [nweet, setNweet] = useState("");

  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef();

  const onSubmit = async (event) => {
    event.preventDefault();
    let previewUrl = "";
    if (preview) {
      const previewRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
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
          <img src={preview} width="50px" height="50px" alt="previewImage" />
          <input type="submit" value="Clear" onClick={onPreviewClear} />
        </div>
      )}
    </form>
  );
};

export default NweetFactory;
