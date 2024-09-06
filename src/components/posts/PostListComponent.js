import React, { useEffect, useState } from "react";
import {
  easyGet,
  easyDelete,
  easyPatchWithFile,
  easyPatch,
} from "../../util/EasyFetch"; // Import necessary functions
import PostComponent from "./PostComponent";
import EditPostComponent from "./EditPostComponent";
import { getLoginCookie } from "../../util/LoginCookie";
import { useParams } from "react-router-dom";

export default function PostListComponent({ selectedPost }) {
  // Hier werden die Posts gespeichert (Array)
  const [posts, setPosts] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);
  const token = getLoginCookie();
  // vorerst nötig
  // const userID = jwtDecode(token).userID;

  const paramId = useParams()._id;

  /**
   * GET-Anfrage, bei der alle Beiträge eines bestimmten Users abgerufen werden.
   * Die Beiträge werden in die State-Variable posts gespeichert.
   */
  useEffect(() => {
    const getPosts = async () => {
      let userPosts = await easyGet(`/posts/${paramId}`, token);
      setPosts(userPosts);
    };
    
    getPosts();
  }, [paramId, token]);

  /**
   * Setzt die ID des Beitrags, der bearbeitet werden soll
   * @param {string} id - ID des zu bearbeitenden Beitrags
   */
  const handleEdit = (id) => {
    setEditingPostId(id);
  };

  /**
   * Löscht den Beitrag mit der angegebenen ID
   * @param {string} id - ID des zu löschenden Beitrags
   */
  const handleDelete = async (id) => {
    try {
      await easyDelete(`/posts/${id}`, token);
      setPosts(posts.filter((post) => post._id !== id));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  /**
   * Speichert den bearbeiteten Beitrag
   * @param {string} id - ID des zu bearbeitenden Beitrags
   * @param {object} updatedPost - Aktualisierte Beitragsdaten
   * @param {File} imageFile - Aktualisierte Bilddatei (falls vorhanden)
   */
  const handleSave = async (id, updatedPost, imageFile) => {
    try {
      if (imageFile) {
        // Handhabt den Datei-Upload, falls ein neues Bild ausgewählt wurde
        const formData = new FormData();
        formData.append("title", updatedPost.title);
        formData.append("image", imageFile);

        await easyPatchWithFile(`/posts/${id}`, formData, token);
      } else {
        // Handhabt die Textaktualisierung, falls kein neues Bild ausgewählt wurde
        await easyPatch(`/posts/${id}`, updatedPost, token);
      }

      // Aktualisierte Liste der Beiträge abrufen
      const updatedPosts = await easyGet(`/posts/${paramId}`, token);
      setPosts(updatedPosts);
      setEditingPostId(null);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  /**
   * Bricht die Bearbeitung ab
   */
  const handleCancel = () => {
    setEditingPostId(null);
  };

  return (
    <>
      {/** Wenn ein Beitrag bearbeitet wird, rendere nur diesen Beitrag. */}
      {editingPostId
        ? posts.map((post) =>
            editingPostId === post._id ? (
              <EditPostComponent
                key={post._id}
                post={post}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            ) : null
          )
        : posts && (
            <div className="flex flex-wrap -mx-3 ">
              {posts.map((post) => (
                <PostComponent
                  selectedPost={selectedPost === post._id}
                  key={post._id}
                  postId={post._id}
                  postUserId={post.author._id}
                  title={post.title}
                  likes={post.likes}
                  author={post.author.userID}
                  image={post.image}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
    </>
  );
}
