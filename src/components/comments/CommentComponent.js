import React from "react";

export default function CommentComponent({ comment, user }) {
  return (
    <div>
      <div className="flex flex-nowrap mt-4">
        {user && (
          <div className="flex items-start space-x-3 w-full">
            <div className="border-gradient flex-shrink-0">
              <img
                className="rounded-full border-transparent border-2"
                style={{ width: "50px", height: "50px" }}
                src={user.profilePicture}
              />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="mt-1 font-bold">{user.userID}</p>
              <p className="whitespace-normal break-words overflow-hidden">
                {comment}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
