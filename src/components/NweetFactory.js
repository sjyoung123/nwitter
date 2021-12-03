import { addDoc, collection } from "@firebase/firestore";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { dbService, storageService } from "fbase";
import { v4 as uuidv4 } from "uuid";
import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const NweetFactory = ({ userObj }) => {
  const [nweet, setNweet] = useState("");

  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef();

  const onSubmit = async (event) => {
    if (nweet === "") {
      return;
    }
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
    <form onSubmit={onSubmit} className="factoryForm">
      <div className="factoryInput__container">
        <input
          className="factoryInput__input"
          value={nweet}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="submit" value="&rarr;" className="factoryInput__arrow" />
      </div>
      <label htmlFor="attach-file" className="factoryInput__label">
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input
        id="attach-file"
        type="file"
        accept="image/*"
        onChange={onImageChange}
        ref={fileInputRef}
        style={{
          opacity: 0,
        }}
      />

      {preview && (
        <div className="factoryForm__attachment">
          <img
            src={preview}
            style={{
              backgroundImage: preview,
            }}
            alt="previewImage"
          />
          <div className="factoryForm__clear" onClick={onPreviewClear}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  );
};

export default NweetFactory;
