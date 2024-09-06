import React, { useEffect, useState } from "react";
import { easyGet } from "../../util/EasyFetch";
import { getLoginCookie } from "../../util/LoginCookie";
import { Link, useNavigate } from "react-router-dom";

export default function SearchBarComponent() {
  const ENV = process.env.REACT_APP_ENV || null
  const [term, setTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const displayCount = 25;
  const token = getLoginCookie();
  const navigate = useNavigate();

  useEffect(() => {
    if (term.length < 3) {
      setUsers([]);
      setPosts([]);
      return;
    }
    const timeHandler = setTimeout(() => {
      if (term.length > 0) {
        const searchByTerm = async () => {
          try {
            let userData = await easyGet(
              `/user/byterm/${term.toLowerCase()}`,
              token
            );
            setUsers(userData);
            if (!ENV) {
              let postData = await easyGet(
                `/posts/byterm/${term.toLowerCase()}`,
                token
              );
              setPosts(postData);
            }
          } catch (err) {
            console.log(err);
          }
        };
        searchByTerm();
      } else {
        setUsers([]);
        setPosts([]);
      }
    }, 500);

    return () => {
      clearTimeout(timeHandler);
    };
  }, [term]);

  const handlePostClick = (authorId, postId) => {
    navigate(`/profile/${authorId}`, { state: { selectedPost: postId } });
  };

  return (
    <>
      <input
        type="search"
        placeholder="Suchen"
        className="rounded-lg w-full border font-josefine bg-gray-100 hover:border-lila bg-beige block mb-2 p-2"
        onChange={(e) => setTerm(e.target.value)}
      />

      {Array.isArray(users) && users.length > 0 && (
        <>
          <div className="text-xl font-bold mb-2">Profile</div>
          {users.slice(0, displayCount).map((user) => (
            <div
              key={user.userID}
              className="text-16 font-josefine px-4 container mx-auto h-16 w-screen hover:bg-gray-100 "
            >
              <div className="flex space-x-4 mt-3">
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="mt-2 border-2 border-lilaLight rounded-full profilePicture w-12 h-12 object-cover"
                />
                <div className="mt-5">
                  <Link to={"/profile/" + user._id}>{user.userID}</Link>
                </div>
              </div>
            </div>
          ))}
        </>
      )}

      {Array.isArray(posts) && posts.length > 0 && !ENV && (
        <>
          <div className="text-xl font-bold mb-2">Posts</div>
          {posts.slice(0, displayCount).map((post) => (
            <div
              key={post._id}
              className="text-16 font-josefine px-4 container mx-auto h-16 w-screen hover:bg-gray-100 "
            >
              <div
                onClick={() => handlePostClick(post.author, post._id)}
                className="flex space-x-4 mt-3 cursor-pointer"
              >
                <img
                  src={post.image}
                  alt="Post"
                  className="mt-2 border-2 border-lilaLight rounded w-12 h-12 object-cover"
                />
                <div className="mt-5">
                  <span>{post.title}</span>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );
}
