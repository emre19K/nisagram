import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getLoginCookie } from "../../util/LoginCookie";
import { jwtDecode } from "jwt-decode";
import { easyGet, easyPost } from "../../util/EasyFetch";
import CommentComponent from "../comments/CommentComponent";
import { Modal } from "antd";
import { Link } from "react-router-dom";
import { IoCloseSharp } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import useIsMobile from "../../util/useIsMobile";
import { AiOutlineArrowUp } from "react-icons/ai";

export default function PostComponent({
  postId,
  postUserId,
  title,
  likes: initialLikes,
  author,
  image,
  onEdit,
  onDelete,
  home,
  selectedPost,
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [inputComment, setInputComment] = useState("");
  const [comments, setComments] = useState(null);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setisDropdownOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const userId = token ? jwtDecode(token)._id : null;
  const _id = postId;
  const isMobile = useIsMobile();

  async function handleLikeClick() {
    let body = {
      _id: userId,
    };
    try {
      let like = await easyPost(`/like/${_id}`, body, token);
      if (!like) {
        handleDislike();
        return;
      }
      setLikes(likes + 1);
      setIsLiked(true);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDislike() {
    let body = {
      _id: userId,
    };
    try {
      await easyPost(`/like/dislike/${_id}`, body, token);
      setLikes(likes - 1);
      setIsLiked(false);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    let loginCookie = getLoginCookie();
    setToken(loginCookie);
    let getComments = async () => {
      let comments = await easyGet(`/comment/${_id}`, token);
      setComments(comments);
    };

    let getUser = async () => {
      let user = await easyGet(`/user/${postUserId}`, token);
      setUser(user);
    };

    getComments();
    getUser();
    if (selectedPost) {
      setIsModalOpen(true);
    }

    getComments();
    getUser();
  }, [selectedPost]);

  useEffect(() => {
    let checkIsLiked = async () => {
      let liked = await easyGet(`/like/${_id}`, token);
      if (liked) setIsLiked(true);
    };

    checkIsLiked();
  }, [token]);

  async function handleCreateCommentClick() {
    let body = {
      text: inputComment,
    };

    if (!inputComment) return;

    try {
      let comment = await easyPost(`/comment/${_id}`, body, token);
      setComments((prevComments) => [
        ...prevComments,
        {
          text: comment.data.text,
          post: comment.data.post,
          user: comment.data.user,
          _id: comment.data._id,
        },
      ]);
      setInputComment("");
    } catch (err) {
      return;
    }
  }

  const showModal = () => {
    setIsModalOpen(true);
  };

  const toggleDropdown = () => {
    setisDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      {home ? (
        isMobile ? (
          <div className="mb-5 flex -m-14" style={{ overflowX: "hidden" }}>
            <div className="flex flex-col w-screen h-full mb-20">
              <div className="flex flex-wrap ml-4">
                <Link
                  className="flex flex-wrap mb-3"
                  to={`/profile/${postUserId}`}
                >
                  <div className="border-gradient">
                    <img
                      className="rounded-full border-transparent border-2"
                      style={{ width: "50px", height: "50px", zIndex: 1 }}
                      src={user && user.profilePicture}
                    />
                  </div>
                  <p className="mt-3 ml-3 font-bold text-16 font-josefine">
                    {author}
                  </p>
                </Link>
              </div>

              {image && (
                <img
                  className="w-screen object-contain"
                  src={image}
                  alt="Description of the image"
                />
              )}

              <div className="modal-details">
                <div className="mb-4 flex flex-wrap">
                  <div className="flex items-center space-x-4 -mt-4">
                    <button onClick={handleLikeClick}>
                      {isLiked ? (
                        <FaHeart alt="like-icon" size="25px" color="red" />
                      ) : (
                        <FaRegHeart alt="like-icon" size="25px" color="black" />
                      )}
                    </button>
                    <p className="font-bold">Gefällt {likes} Mal</p>
                  </div>

                  <Link
                    className="flex flex-wrap"
                    to={`/profile/${postUserId}`}
                  >
                    <p className="mt-3 font-bold text-16 font-josefine">
                      {author}
                    </p>
                  </Link>
                  <p className="mt-3 ml-5">{title}</p>
                </div>

                <button
                  className="text-lightGray whitespace-nowrap"
                  onClick={toggleDropdown}
                >
                  Alle {comments && comments.length} Kommentare Ansehen
                </button>
                {isDropdownOpen && (
                  <div className="flex-grow overflow-y-auto max-h-80 w-screen max-w-80">
                    {comments &&
                      comments.map((comment) => (
                        <CommentComponent
                          key={comment._id}
                          comment={comment.text}
                          user={comment.user}
                        />
                      ))}
                  </div>
                )}
                <div className="flex flex-grow w-screen -mt-4">
                  <input
                    className="w-9/12 p-2 border-b-2 hover:border-gray-400 focus:outline-none mt-5 rounded"
                    onChange={(e) => setInputComment(e.target.value)}
                    placeholder="Kommentieren..."
                    value={inputComment}
                  />
                  <button
                    style={{ height: "30px" }}
                    className="px-4 w-12 mt-10 bg-lila hover:bg-lilaLight text-white rounded flex items-center "
                    onClick={handleCreateCommentClick}
                  >
                    <AiOutlineArrowUp />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-24">
            <div className="flex w-full h-full">
              {image && (
                <img
                  className="w-2/3 object-contain"
                  src={image}
                  alt="Description of the image"
                />
              )}

              <div className="modal-details">
                <div className="mb-4">
                  <div className="flex flex-wrap">
                    <Link
                      className="flex flex-wrap"
                      to={`/profile/${postUserId}`}
                    >
                      <img
                        className="rounded-full"
                        style={{ width: "50px", height: "50px" }}
                        src={user && user.profilePicture}
                      ></img>
                      <p className="mt-3 ml-3 font-bold text-16 font-josefine">
                        {author}
                      </p>
                    </Link>
                  </div>

                  <p className="mt-2">{title}</p>

                  <div className="flex items-center space-x-4 mt-5">
                    <button onClick={handleLikeClick}>
                      {isLiked ? (
                        <FaHeart alt="like-icon" size="25px" color="red" />
                      ) : (
                        <FaRegHeart alt="like-icon" size="25px" color="black" />
                      )}
                    </button>

                    <p className="font-bold">Gefällt {likes} Mal</p>
                  </div>
                </div>
                <div className="flex-grow overflow-y-auto max-h-80 max-w-80 2xl:max-w-96">
                  {comments &&
                    comments.map((comment) => (
                      <CommentComponent
                        key={comment._id}
                        comment={comment.text}
                        user={comment.user}
                      />
                    ))}
                </div>
                <input
                  className="w-2/3 p-2 border border-gray-300 hover:border-gray-400 mt-5 rounded"
                  onChange={(e) => setInputComment(e.target.value)}
                  placeholder="Kommentieren..."
                  value={inputComment}
                />
                <button
                  className="px-4 py-2 w-1/3 bg-lila hover:bg-lilaLight text-white rounded"
                  onClick={handleCreateCommentClick}
                >
                  Posten
                </button>
              </div>
            </div>
          </div>
        )
      ) : (
        <>
          {image && (
            <img
              src={image}
              alt="Description of the image"
              className="beitrag-img"
              onClick={showModal}
            />
          )}
          {!isMobile ? (
            <div>
              <Modal
                open={isModalOpen}
                className="modal"
                footer={null}
                onCancel={() => setIsModalOpen(false)}
                closable={true}
                closeIcon={
                  <IoCloseSharp
                    style={{ fontSize: "17px", marginTop: "7px" }}
                  />
                }
                bodyStyle={{
                  height: "90vh",
                  width: "90vw",
                  backgroundColor: document.body.classList.contains("dark-mode")
                    ? "#3C3C3C"
                    : "#fff",
                  color: document.body.classList.contains("dark-mode")
                    ? "#E0E0E0"
                    : "#000",
                }}
              >
                <div className="flex justify-end w-full">
                  <div className="flex"></div>
                  {postUserId === userId && (
                    <div className="relative">
                      <button
                        className="text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded-sm mr-6 -mt-6"
                        onClick={toggleDropdown}
                      >
                        ☰
                      </button>
                      {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 py-2 w-48 bg-white dark:bg-dark-bg rounded-md shadow-xl z-50">
                          <li
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                            onClick={() => {
                              onEdit(_id);
                              toggleDropdown();
                            }}
                          >
                            Bearbeiten
                          </li>
                          <li
                            className="block px-4 py-2 text-sm text-red-700 hover:bg-lilaLight w-full text-left"
                            onClick={() => {
                              onDelete(_id);
                              toggleDropdown();
                            }}
                          >
                            Löschen
                          </li>
                          <li
                            className="block px-4 py-2 text-sm text-red-700 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                            onClick={() => setisDropdownOpen(false)}
                          >
                            Schließen
                          </li>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex w-full h-full -my-5">
                  {image && (
                    <img
                      className="modal-img"
                      src={image}
                      alt="Description of the image"
                    />
                  )}

                  <div className="modal-details">
                    <div className="mb-4">
                      <div className="flex flex-wrap">
                        <img
                          className="rounded-full"
                          style={{ width: "50px", height: "50px" }}
                          src={user && user.profilePicture}
                        ></img>
                        <p className="mt-3 ml-3 font-bold text-16 font-josefine">
                          {author}
                        </p>
                      </div>

                      <p className="mt-2">{title}</p>

                      <div className="flex items-center space-x-4 mt-5">
                        <button onClick={handleLikeClick}>
                          {isLiked ? (
                            <FaHeart alt="like-icon" size="25px" color="red" />
                          ) : (
                            <FaRegHeart
                              alt="like-icon"
                              size="25px"
                              color="black"
                            />
                          )}
                        </button>

                        <p className="font-bold">Gefällt {likes} Mal</p>
                      </div>
                    </div>
                    <div className="flex-grow overflow-y-auto max-h-80 xl:max-w-64 2xl:max-w-80">
                      {comments &&
                        comments.map((comment) => (
                          <CommentComponent
                            key={comment._id}
                            comment={comment.text}
                            user={comment.user}
                          />
                        ))}
                    </div>
                    <input
                      className="mt-6 w-3/4 p-2 border border-gray-300 dark:border-gray-600 hover:border-bg-lilaLight rounded"
                      onChange={(e) => setInputComment(e.target.value)}
                      placeholder="Kommentieren..."
                      value={inputComment}
                    />
                    <button
                      className="px-4 py-2 w-1/4 bg-lila hover:bg-lilaLight text-white rounded"
                      onClick={handleCreateCommentClick}
                    >
                      Posten
                    </button>
                  </div>
                </div>
              </Modal>
            </div>
          ) : (
            <Modal
              open={isModalOpen}
              className="modal"
              footer={null}
              onCancel={() => setIsModalOpen(false)}
              closable={true}
              closeIcon={
                <IoCloseSharp style={{ fontSize: "17px", marginTop: "7px" }} />
              }
              bodyStyle={{
                height: "80vh",
                width: "90vw",
                backgroundColor: document.body.classList.contains("dark-mode")
                  ? "#3C3C3C"
                  : "#fff",
                color: document.body.classList.contains("dark-mode")
                  ? "#E0E0E0"
                  : "#000",
              }}
            >
              <div className="flex justify-end  w-full ">
                {postUserId === userId && (
                  <div className="relative ">
                    <button
                      className="text-black  hover:bg-gray-100 px-2 py-1  rounded-sm mr-6 -mt-6  "
                      onClick={toggleDropdown}
                    >
                      ☰
                    </button>
                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-50">
                        <li
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          onClick={() => {
                            onEdit(_id);
                            toggleDropdown();
                          }}
                        >
                          Bearbeiten
                        </li>
                        <li
                          className="block px-4 py-2 text-sm text-red-700 hover:bg-lilaLight w-full text-left"
                          onClick={() => {
                            onDelete(_id);
                            toggleDropdown();
                          }}
                        >
                          Löschen
                        </li>
                        <li
                          className="block px-4 py-2 text-sm text-red-700 hover:bg-gray-100 w-full text-left"
                          onClick={() => setisDropdownOpen(false)}
                        >
                          Schließen
                        </li>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="flex flex-row mb-4">
                <img
                  className="rounded-full"
                  style={{ width: "50px", height: "50px" }}
                  src={user && user.profilePicture}
                ></img>
                <p className="mt-3 ml-3 font-bold text-16 font-josefine">
                  {author}
                </p>
              </div>
              {image && <img src={image}></img>}
              <p className="mt-4">{title}</p>
              <div className="flex items-center space-x-4 mt-5">
                <button onClick={handleLikeClick}>
                  {isLiked ? (
                    <FaHeart alt="like-icon" size="25px" color="red" />
                  ) : (
                    <FaRegHeart alt="like-icon" size="25px" color="black" />
                  )}
                </button>

                <p className="font-bold">Gefällt {likes} Mal</p>
              </div>
              <div className="flex-grow overflow-y-auto max-h-60 mt-4">
                {comments &&
                  comments.map((comment) => (
                    <CommentComponent
                      key={comment._id}
                      comment={comment.text}
                      user={comment.user}
                    />
                  ))}
              </div>
              <input
                className=" mt-6 w-3/4 p-2 border border-gray-300 hover:border-bg-lilaLight rounded"
                onChange={(e) => setInputComment(e.target.value)}
                placeholder="Kommentieren..."
                value={inputComment}
              />
              <button
                className="px-4 py-2 w-1/4  bg-lila hover:bg-lilaLight text-white rounded"
                onClick={handleCreateCommentClick}
              >
                Posten
              </button>
            </Modal>
          )}
        </>
      )}
    </>
  );
}

PostComponent.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  likes: PropTypes.number.isRequired,
  author: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
