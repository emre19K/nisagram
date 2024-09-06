import React, { useEffect, useState } from "react";
import { getLoginCookie } from "../../util/LoginCookie";
import { easyDelete, easyGet, easyPost } from "../../util/EasyFetch";
import { useLocation, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import PostListComponent from "../posts/PostListComponent";
import useIsMobile from "../../util/useIsMobile";
import { FaQuestion, FaExclamation, FaFileImage } from "react-icons/fa";
import { useAlert } from "../../util/CustomAlert";

export default function ProfileComponent() {
  const token = getLoginCookie();
  const tokenId = jwtDecode(token)._id;
  const { _id } = useParams();
  const location = useLocation()
  const { selectedPost } = location.state || {}
  const [user, setUser] = useState(null);
  const [canFollow, setCanFollow] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [followed, setFollowed] = useState(0);
  const [followers, setFollowers] = useState(0);
  const [activeView, setActiveView] = useState("posts");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [inputQuestion, setInputQuestion] = useState("");
  const [inputAnswer, setInputAnswer] = useState("");
  const isMobile = useIsMobile();
  const { showAlert } = useAlert();
  useEffect(() => {
    const getUser = async () => {
      let user = await easyGet(`/user/${_id}`, token);
      setUser(user);
      setFollowed(user.following.length);
      setFollowers(user.followers.length);
      if (user.followers.includes(jwtDecode(token)._id)) {
        setIsFollowed(true);
      } else {
        setIsFollowed(false);
      }
      let tokenId = jwtDecode(token)._id;
      if (tokenId !== _id && !isFollowed) {
        setCanFollow(true);
      } else {
        setCanFollow(false);
      }
    };
    const getQuestions = async () => {
      let questions = await easyGet(`/question/my-questions`, token);
      setQuestions(questions);
    };
    const getAnswers = async () => {
      let answers = await easyGet(`/question/answers/${_id}`, token);
      setAnswers(answers);
    };
    getAnswers();
    getQuestions();
    getUser();
  }, [_id, token, activeView]);
  
  async function followUser() {
    let emptyBody = {};
    let followed = await easyPost(`/user/follow/${_id}`, emptyBody, token);
    if (followed) {
      setFollowers((followers) => followers + 1);

      setIsFollowed(true);
    }
  }

  async function unfollowUser() {
    let emptyBody = {};
    let unfollowed = await easyPost(`/user/unfollow/${_id}`, emptyBody, token);
    if (unfollowed) {
      setFollowers((followers) => followers - 1);
      setIsFollowed(false);
    }
  }
  async function askQuestionToUser(question) {
    let body = {
      question: question,
    };
    await easyPost(`/question/ask/${_id}`, body, token);
    setActiveView("posts");
    showAlert("Frage erfolgreich gestellt!");
  }
  async function answerOwnQuestion(answer, questionId) {
    let body = {
      answer: answer,
    };
    await easyPost(`/question/answer/${questionId}`, body, token);
    await easyDelete(`/question/delete/${questionId}`, token);
    setActiveView("answers");
    showAlert("Frage erfolgreich beantwortet!");
  }
  return (
    <>
      {user ? (
        tokenId && _id && tokenId === _id ? (
          <div className="flex flex-col">
            <div className="w-full relative">
              {user.bannerPicture ? !isMobile ?  (
                <img
                  src={user.bannerPicture}
                  alt="Banner"
                  className="w-full h-48 md:h-64 object-cover"
                />
              ) : <img
                  src={user.bannerPicture}
                  alt="Banner"
                  className="w-screen h-48 md:h-64 object-cover"
                /> : null}
              <div className="flex items-center justify-center">
                <div className="border-gradient rounded-full w-24 h-24 md:w-32 md:h-32 flex items-center justify-center absolute bottom-12 md:-bottom-16">
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className=" rounded-full w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
            <div className="md:mt-20 flex flex-col items-center">
              <div className="flex items-center">
                <div className="flex flex-row">
                  <p className="font-bold font-josefine text-2xl md:text-3xl mr-12">
                    {user.userID}
                  </p>
                  {!isMobile ? (
                    <>
                      <button
                        className="bg-neutral rounded-xl hover:text-lilaLight p-2 mr-12"
                        onClick={() => setActiveView("posts")}
                      >
                        Beiträge
                      </button>
                      <button
                        className="bg-neutral rounded-xl hover:text-lilaLight p-2 mr-12"
                        onClick={() => setActiveView("answers")}
                      >
                        Meine Antworten!
                      </button>
                      <button
                        className="bg-neutral rounded-xl hover:text-lilaLight p-2"
                        onClick={() => setActiveView("questions")}
                      >
                        Meine Fragen!
                      </button>{" "}
                    </>
                  ) : (
                    <>
                      <button
                        className="hover:text-lilaLight p-2 mr-4"
                        onClick={() => setActiveView("posts")}
                      >
                        <FaFileImage />
                      </button>
                      <button
                        className="hover:text-lilaLight p-2  mr-4"
                        onClick={() => setActiveView("answers")}
                      >
                        <FaExclamation />
                      </button>
                      <button
                        className="hover:text-lilaLight p-2"
                        onClick={() => setActiveView("questions")}
                      >
                        <FaQuestion />
                      </button>
                    </>
                  )}
                </div>
                {canFollow ? (
                  isFollowed ? (
                    <button className="text-lila ml-5" onClick={unfollowUser}>
                      Entfolgen
                    </button>
                  ) : (
                    <button className="text-lila ml-5" onClick={followUser}>
                      Folgen
                    </button>
                  )
                ) : null}
              </div>
              <div className="flex font-josefine text-lg md:text-xl space-x-4 md:space-x-8 mt-2">
                <p>{user.posts} Beiträge</p>
                <p>{followers} Follower</p>
                <p>{followed} Gefolgt</p>
              </div>
              <div className="font-josefine text-lg md:text-xl mt-4 text-center px-4">
                <p>{user.description}</p>
              </div>
            </div>
            {activeView === "questions" ? (
              !isMobile ? (
                questions.map((q) => (
                  <div
                    className="border border-neutral rounded w-full mb-8 mt-8"
                    key={q._id}
                  >
                    <div className="flex flex-row m-4">
                      <p>{q.question}</p>
                    </div>

                    <div className="m-4">
                      <div className="flex flex-row">
                        <input
                          onChange={(e) => setInputAnswer(e.target.value)}
                          className="w-full h-12"
                          placeholder="Antwort..."
                        />
                        <button
                          onClick={() => answerOwnQuestion(inputAnswer, q._id)}
                          className="hover:text-lilaLight"
                        >
                          Antworten
                        </button>
                      </div>
                      <hr />
                    </div>
                  </div>
                ))
              ) : (
                questions.map((q) => (
                  <div
                    className="border border-neutral rounded w-full mb-4 mt-4"
                    key={q._id}
                  >
                    <div className="flex flex-row m-4">
                      <p>{q.question}</p>
                    </div>
                    <div className="m-4">
                      <div className="flex flex-row">
                        <input
                          onChange={(e) => setInputAnswer(e.target.value)}
                          className="w-full h-12"
                          placeholder="Antwort..."
                        />
                        <button
                          onClick={() => answerOwnQuestion(inputAnswer, q._id)}
                          className="hover:text-lilaLight"
                        >
                          Antworten
                        </button>
                      </div>
                      <hr />
                    </div>
                  </div>
                ))
              )
            ) : activeView === "answers" ? (
              !isMobile ? (
                answers.map((a) => (
                  <div
                    className="border border-neutral rounded w-full mb-8 mt-8"
                    key={a._id}
                  >
                    <div className="flex flex-col m-4">
                      <p>{a.question}</p>
                      <hr className="mb-4 mt-4" />
                      <p>{a.answer}</p>
                    </div>
                  </div>
                ))
              ) : (
                answers.map((a) => (
                  <div
                    className="border border-neutral rounded w-full mb-4 mt-4"
                    key={a._id}
                  >
                    <div className="flex flex-col m-4">
                      <p>{a.question}</p>
                      <hr className="mb-4 mt-4" />
                      <p>{a.answer}</p>
                    </div>
                  </div>
                ))
              )
            ) : (
              <PostListComponent selectedPost={selectedPost} />
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-full relative">
              {user.bannerPicture && (
                <img
                  src={user.bannerPicture}
                  alt="Banner"
                  className="w-full h-48 md:h-64 object-cover"
                />
              )}
              <div className="relative flex items-center justify-center">
                <div className="border-gradient rounded-full w-24 h-24 md:w-32 md:h-32 flex items-center justify-center absolute   md:-bottom-16">
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className=" rounded-full w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
            <div className="mt-16 md:mt-20 flex flex-col items-center">
              <div className="flex items-center">
                <div className="flex flex-row">
                  <p className="font-bold font-josefine text-2xl md:text-3xl mr-12">
                    {user.userID}
                  </p>
                  {!isMobile ? (
                    <>
                      <button
                        className="bg-neutral rounded-xl hover:text-lilaLight p-2 mr-12"
                        onClick={() => setActiveView("posts")}
                      >
                        Beiträge
                      </button>
                      <button
                        className="bg-neutral rounded-xl hover:text-lilaLight p-2"
                        onClick={() => setActiveView("askme")}
                      >
                        Frag mich!
                      </button>{" "}
                    </>
                  ) : (
                    <>
                      <button
                        className="hover:text-lilaLight p-2 mr-4"
                        onClick={() => setActiveView("posts")}
                      >
                        <FaFileImage />
                      </button>
                      <button
                        className="hover:text-lilaLight p-2"
                        onClick={() => setActiveView("askme")}
                      >
                        <FaQuestion />
                      </button>
                    </>
                  )}
                </div>
                {canFollow ? (
                  isFollowed ? (
                    <button className="text-lila ml-5" onClick={unfollowUser}>
                      Entfolgen
                    </button>
                  ) : (
                    <button className="text-lila ml-5" onClick={followUser}>
                      Folgen
                    </button>
                  )
                ) : null}
              </div>
              <div className="flex font-josefine text-lg md:text-xl space-x-4 md:space-x-8 mt-2">
                <p>{user.posts} Beiträge</p>
                <p>{followers} Follower</p>
                <p>{followed} Gefolgt</p>
              </div>
              <div className="font-josefine text-lg md:text-xl mt-4 text-center px-4">
                <p>{user.description}</p>
              </div>
            </div>
            {/* Post images section */}
            <div className="w-full mt-8 md:mt-12 px-4">
              {activeView === "askme" ? (
                !isMobile ? (
                  <>
                    <div className="border border-neutral rounded w-full mb-8 mt-8">
                      <div className="m-4">
                        <div className="flex flex-row">
                          <input
                            onChange={(e) => setInputQuestion(e.target.value)}
                            placeholder="Stell deine Frage..."
                            className="w-full h-12"
                          />
                          <button
                            onClick={() => askQuestionToUser(inputQuestion)}
                          >
                            Fragen
                          </button>
                        </div>
                        <hr />
                      </div>
                    </div>
                    {answers.map((a) => (
                      <div
                        className="border border-lilaLight rounded w-full mb-8 mt-8"
                        key={a._id}
                      >
                        <div className="flex flex-col m-4">
                          <p>{a.question}</p>
                          <hr className="mb-4 mt-4" />
                          <p>{a.answer}</p>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    <div className="border border-neutral rounded w-full mb-8 mt-4">
                      <div className="m-4">
                        <div className="flex flex-row">
                          <input
                            onChange={(e) => setInputQuestion(e.target.value)}
                            placeholder="Stell deine Frage..."
                            className="w-full"
                          />
                          <button
                            onClick={() => askQuestionToUser(inputQuestion)}
                          >
                            Fragen
                          </button>
                        </div>
                        <hr />
                      </div>
                    </div>
                    {answers.map((a) => (
                      <div
                        className="border border-lilaLight rounded w-full mb-8 mt-8"
                        key={a._id}
                      >
                        <div className="flex flex-col m-4">
                          <p>{a.question}</p>
                          <hr className="mb-4 mt-4" />
                          <p>{a.answer}</p>
                        </div>
                      </div>
                    ))}
                  </>
                )
              ) : (
                <PostListComponent selectedPost={selectedPost} />
              )}
            </div>
          </div>
        )
      ) : null}
    </>
  );
}
