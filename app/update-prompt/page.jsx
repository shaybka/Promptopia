'use client';
import { useEffect, useState } from 'react';

import { useRouter ,useSearchParams} from 'next/navigation';
import Form from '@components/Form';

const EditPrompt = () => {
   const searchParams =useSearchParams();
   const promptId = searchParams.get('id');
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [post, setPost] = useState({
        prompt: '',
        tag: '',
    });
     useEffect(() =>{
        const getPropmtDetails = async() =>{
            const response = await fetch(`/api/prompt/${promptId}`);
            const data = await response.json();
            setPost({
                prompt: data.prompt,
                tag: data.tag,
            });
        };
        if(promptId )getPropmtDetails();
     },[promptId])


  

   
    const updatePrompt = async (e) => {
        
        if(!promptId)return alert("post Id not found");

        try {
            const response = await fetch(`/api/prompt/${promptId}`, { 
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: post.prompt,
                    
                    tag: post.tag,
                }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Could not updated prompt');
            }

            // Clear the form on success
            setPost({ prompt: '', tag: '' });
           
            router.push('/');
        } catch (error) {
            console.error("Error creating prompt:", error); 
            setError(error.message || 'An unexpected error occurred');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section>
          
            <Form
                type="Edit"
                post={post}
                setPost={setPost}
                submitting={submitting}
                handleSubmit={updatePrompt}
            />
        </section>
    );
};

export default EditPrompt;
