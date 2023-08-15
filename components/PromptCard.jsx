import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const PromptCard = ({ post, handleEdit, handleDelete, handleTagClick }) => {
  const { data: session } = useSession();
  const pathName = usePathname();
  const router = useRouter();

  const [copied, setCopied] = useState("");
  const [loading, setLoading] = useState(true);

  const handleProfileClick = () => {
    if (post.creator?._id === session?.user?.id) return router.push("/profile");

    router.push(`/profile/${post.creator?._id}?name=${post.creator?.username}`);
  };

  const handleCopy = () => {
    setCopied(post.prompt);
    navigator.clipboard.writeText(post.prompt);
    setTimeout(() => setCopied(""), 3000);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#444">
      <div className={`prompt_card ${loading ? "loading" : ""}`}>
        <div className="flex justify-between items-start gap-5">
          <div
            className="flex-1 flex justify-start items-center gap-3 cursor-pointer"
            onClick={handleProfileClick}
          >
            {loading ? (
              <Skeleton circle={true} width={40} height={40} />
            ) : (
              <>
                <Image
                  src={post.creator?.image}
                  alt="user_image"
                  width={40}
                  height={40}
                  className="rounded-full object-contain"
                />
                <div className="flex flex-col">
                  <h3 className="font-satoshi font-semibold text-white">
                    {post.creator?.username}
                  </h3>
                  <p className="font-inter text-sm text-white">
                    {post.creator?.email}
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="copy_btn" onClick={handleCopy}>
            <Image
              src={
                copied === post.prompt
                  ? "/assets/icons/tick.svg"
                  : "/assets/icons/copy.svg"
              }
              alt={copied === post.prompt ? "tick_icon" : "copy_icon"}
              width={12}
              height={12}
            />
          </div>
        </div>

        <p className="my-4 font-satoshi text-sm text-white">
          {loading ? <Skeleton count={3} /> : post.prompt}
        </p>
        <p
          className="font-inter text-sm text-white cursor-pointer"
          onClick={() => handleTagClick && handleTagClick(post.tag)}
        >
          {loading ? <Skeleton width={50} /> : `#${post.tag}`}
        </p>

        {session?.user?.id === post.creator?._id && pathName === "/profile" && (
          <div className="mt-5 flex-center gap-4 border-t border-gray-100 pt-3">
            <p
              className="font-inter text-sm green_gradient cursor-pointer"
              onClick={handleEdit}
            >
              Edit
            </p>
            <p
              className="font-inter text-sm orange_gradient cursor-pointer"
              onClick={handleDelete}
            >
              Delete
            </p>
          </div>
        )}
      </div>
    </SkeletonTheme>
  );
};

export default PromptCard;
