"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Form from "@components/Form";

const CreatePrompt = () => {
  const [post, setPost] = useState({
    prompt: "",
    tag: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { data: session } = useSession(); // Correct placement

  const createPrompt = async (e) => {
    // prevent default browser behavior
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("/api/prompt/new", {
        method: "POST",
        body: JSON.stringify({
          userId: session?.user.id,
          prompt: post.prompt,
          tag: post.tag,
        }),
      });

      if (response.ok) {
        router.push("/"); // Redirect after successful submission
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {session ? (
        <Form
          type="Create"
          post={post}
          setPost={setPost}
          submitting={submitting}
          handleSubmit={createPrompt}
        />
      ) : (
        <div className="w-full max-w-full bg-red-100 px-10 py-4 border-2 border-red-500">
          To create or edit a prompt, you need to sign in.
        </div>
      )}
    </div>
  );
};

export default CreatePrompt;
