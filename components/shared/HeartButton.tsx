"use client"

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
  const [liked, setLiked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(0);

  const fetchLikesCount = async () => {
    const count = await getLikesCount(threadId);
    setLikesCount(count);
  };

  const toggleLike = async () => {
    try {
      if (liked) {
        await removeLikeFromThread(threadId, currentUserId);
      } else {
        await addLikeToThread(threadId, currentUserId);
      }
      fetchLikesCount();
      setLiked(!liked);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await isAlreadyLiked(threadId, currentUserId);
        setLiked(res);
        fetchLikesCount();
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [threadId, currentUserId]); // Include threadId and currentUserId as dependencies

  const heartIconStyles = `
    text-red-500 text-2xl cursor-pointer hover:text-red-600 
    transition-colors duration-200 w-6 h-6 overflow-hidden
  `;

  return (
    <div className="flex flex-row justify-center items-center space-x-1">
      {liked ? (
        <AiFillHeart className={heartIconStyles} onClick={toggleLike} />
      ) : (
        <AiOutlineHeart className={heartIconStyles} onClick={toggleLike} />
      )}

      <p className="text-light-1 text-sm font-semibold">{likesCount}</p>
    </div>
  );
};

export default HeartButton;
