"use client";
import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

const PromptCard = ({ handleTagClick, post, handleDelete, handleEdit }) => {
  const [copied, setCopied] = useState("");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(post.prompt);
      setCopied(post.prompt);
      setTimeout(() => {
        setCopied("");
      }, 3000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };
  const { data: session } = useSession();
  const pathName = usePathname();
  const router = useRouter();

  return (
    <div className="prompt_card">
      <div className="flex justify-between items-start gap-5">
        <div
          className="flex-1 flex justify-start items-center gap-3 cursor-pointer"
          onClick={() => {
            if (post.creator._id === session?.user.id) return router.push("/profile");
            router.push(`/profile/${post.creator._id}?name=${post.creator.username}`);
          }}
        >
          <Image
            src={post.creator.image}
            width={40}
            height={40}
            alt={`${post.creator.username}'s profile picture`}
            className="rounded-full object-contain"
          />
          <div className="flex flex-col">
            <h3 className="font-satoshi font-semibold text-gray-900">
              {post.creator.username}
            </h3>
            <p className="font-inter text-sm text-gray-500">
              {post.creator.email}
            </p>
          </div>
        </div>
        <div
          className="copy_btn"
          onClick={handleCopy}
          aria-label="Copy prompt text"
        >
          <Image
            src={
              copied === post.prompt
                ? "/assets/icons/tick.svg"
                : "/assets/icons/copy.svg"
            }
            width={12}
            height={12}
            alt={copied === post.prompt ? "Copied" : "Copy"}
          />
        </div>
      </div>
      <p className="my-4 font-satoshi text-sm text-gray-800">{post.prompt}</p>
      <p
        className="font-inter text-sm blue_gradient cursor-pointer"
        onClick={() => handleTagClick && handleTagClick(post.tag)}
      >
        #{post.tag}
      </p>
      {session?.user.id === post.creator._id && pathName === "/profile" && (
        <div className="mt-5 flex-center gap-4 border-gray-100 pt-3">
          <p
            className="font-inter tex-sm green_gradient cursor-pointer"
            onClick={handleEdit}
          >
            Edit
          </p>
          <p
            className="font-inter tex-sm orange_gradient cursor-pointer"
            onClick={handleDelete}
          >
            Delete
          </p>
        </div>
      )}
    </div>
  );
};

export default PromptCard;
