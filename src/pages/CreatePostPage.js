import React from "react";
import CreatePostComponent from "../components/posts/CreatePostComponent";

export default function CreatePost() {
  return (
    <>
      <p className="font-josefine mt-10 pb-5 font-bold text-2xl">Beitrag erstellen</p>
      <CreatePostComponent />
    </>
  );
}
