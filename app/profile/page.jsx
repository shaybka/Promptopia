'use client';
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Profile from "@components/Profile";

const MyProfile = () => {
    const { data: session } = useSession();
    const [posts, setPosts] = useState([]); 
    const router = useRouter();

    
    

    const handleEdit = async (post) => {
        // Use router.push to navigate to the edit page
        router.push(`/update-prompt?id=${post._id}`);
    };

    useEffect(() => {
        const fetchPosts = async () => {
            if (!session?.user.id) return; // Guard clause to ensure session is available

            try {
                const response = await fetch(`/api/users/${session.user.id}/posts`);
                if (!response.ok) {
                    throw new Error('Failed to fetch posts');
                }
                const data = await response.json();
                setPosts(data);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };

        fetchPosts();
    }, []); 

    const handleDelete = async (post) => {
        const hasConfirmed = confirm(
          "Are you sure you want to delete this prompt?"
        );
    
        if (hasConfirmed) {
          try {
            await fetch(`/api/prompt/${post._id.toString()}`, {
              method: "DELETE",
              headers: {
                'Content-Type': 'application/json',
            },
            });
    
            const filteredPosts = posts.filter((item) => item._id !== post._id);
    
            setPosts(filteredPosts);

          } catch (error) {
            console.log(error);
          }
        }
      };

    return (
        <Profile
            name="My"
            desc="Welcome to your personalized page"
            data={posts}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
        />
    );
};

export default MyProfile;
