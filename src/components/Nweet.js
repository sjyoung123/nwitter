import { deleteDoc, doc, updateDoc } from "@firebase/firestore";
import { dbService } from "fbase";
import React, { useState } from "react";

const Nweet = ({ nweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);

  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure delete?");
    if (ok) {
      await deleteDoc(doc(dbService, "nweets", `${nweetObj.id}`));
    }
  };

  const toggleEdit = () => {
    setEditing((prev) => !prev);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    await updateDoc(doc(dbService, "nweets", `${nweetObj.id}`), {
      text: newNweet,
    });
    toggleEdit();
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewNweet(value);
  };

  return (
    <div>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="Edit your Nweet"
              value={newNweet}
              onChange={onChange}
              required
            />
            <input type="submit" value="Update" />
          </form>
          <button onClick={toggleEdit}>Cancel</button>
        </>
      ) : (
        <>
          <h4>{nweetObj.text}</h4>
          {nweetObj.previewUrl && (
            <img src={nweetObj.previewUrl} width="50px" height="50px" />
          )}
          {isOwner && (
            <>
              <button onClick={toggleEdit}>Edit</button>
              <button onClick={onDeleteClick}>Delete</button>
            </>
          )}
        </>
      )}
    </div>
  );
};
export default Nweet;
