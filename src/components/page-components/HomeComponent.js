import React, { useState, useEffect, useCallback } from "react";
import { easyGet } from "../../util/EasyFetch";
import { getLoginCookie } from "../../util/LoginCookie";
import PostComponent from "../posts/PostComponent";
import { useLocation } from "react-router-dom";

export default function HomeComponent() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const token = getLoginCookie();
  const location = useLocation();

  const fetchPosts = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const newPosts = await easyGet(
        `/posts/homepage?page=${page}&limit=20`,
        token
      );

      if (newPosts && newPosts.length > 0) {
        setPosts((prevPosts) => [...prevPosts, ...newPosts]);
        if (newPosts.length < 20) {
          setHasMore(false);
        } else {
          setPage((prevPage) => prevPage + 1);
        }
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, token]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    if (location.state && location.state.selectedPost) {
      setPosts((prevPosts) => {
        const postExists = prevPosts.some(post => post._id === location.state.selectedPost._id);
        if (postExists) {
          const filteredPosts = prevPosts.filter(post => post._id !== location.state.selectedPost._id);
          return [location.state.selectedPost, ...filteredPosts];
        } else {
          return [location.state.selectedPost, ...prevPosts];
        }
      });
    }
  }, [location.state]);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 5 &&
      hasMore &&
      !loading
    ) {
      fetchPosts();
    }
  }, [fetchPosts, hasMore, loading]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <div className="p-7 flex flex-col">
      {posts.length > 0 ? (
        posts.map((post) => (
          <PostComponent
            key={post._id}
            postId={post._id}
            postUserId={post.author ? post.author._id : null}
            title={post.title}
            likes={post.likes}
            author={post.author ? post.author.userID : "Unknown"}
            image={post.image}
            home={true}
          />
        ))
      ) : (
        !loading && <p>Keine Posts verfügbar</p>
      )}
      {loading && <p>Zaubere Posts herbei...</p>}
    </div>
  );
}
