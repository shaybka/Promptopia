'use client';
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Profile from "@components/Profile";

const UserProfile = ({ params }) => {
    const [posts, setPosts] = useState([]); 
    const searchParams = useSearchParams();
    const userName = searchParams.get('name'); 

    useEffect(() => {
        const fetchPosts = async () => {
            if (!params?.id) return; 
            
            try {
                const response = await fetch(`/api/users/${params.id}/posts`);
                if (!response.ok) {
                    throw new Error('Failed to fetch posts');
                }
                const data = await response.json();
                setPosts(data); // Update the state with fetched posts
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };

        fetchPosts(); 
    }, [params.id]); 

    return (
        <Profile
            name={userName}
            desc={`Welcome to ${userName}'s personalized page`}
            data={posts}  
        />
    );
};

export default UserProfile;
