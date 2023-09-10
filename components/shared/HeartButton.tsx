"use client";

import React, { useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import {
  addLikeToThread,
  getLikesCount,
  isAlreadyLiked,
  removeLikeFromThread,
} from "@/lib/actions/thread.action";

interface HeartButtonProps {
  threadId: string;
  currentUserId: string;
}

const HeartButton = ({ threadId, currentUserId }: HeartButtonProps) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const fetchLikesCount = async () => {
    const count = await getLikesCount(threadId);
    setLikesCount(count);
  };

  const toggleLike = async () => {
    try {
      if (!liked) {
        await addLikeToThread(threadId, currentUserId);
      } else {
        await removeLikeFromThread(threadId, currentUserId);
      }
      fetchLikesCount();
      setLiked(!liked);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await isAlreadyLiked(threadId, currentUserId).then((res) => {
        setLiked(res);
      });
      fetchLikesCount();
    };
    fetchData();
  }, []);

  const heartIconStyles = `
    text-red-500 text-2xl cursor-pointer hover:text-red-600 
    transition-colors duration-200 w-6 h-6 overflow-hidden
  `;

  return (
    <div className="flex flex-row justify-center items-center space-x-1">
      {!liked ? (
        <AiOutlineHeart className={heartIconStyles} onClick={toggleLike} />
      ) : (
        <AiFillHeart className={heartIconStyles} onClick={toggleLike} />
      )}

      <p className="text-light-1 text-sm font-semibold ">{likesCount}</p>
    </div>
  );
};

export default HeartButton;
