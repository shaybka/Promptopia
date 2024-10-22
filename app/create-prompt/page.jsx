'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Form from '@components/Form';

const CreatePrompt = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [post, setPost] = useState({
        prompt: '',
        tag: '',
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Check if user is authenticated
    if (!session) {
        return <p>You must be logged in to create a prompt.</p>;
    }

    const createPrompt = async (e) => {
        e.preventDefault();
        console.log("Current post state:", post);
        setSubmitting(true);
        setError(''); // Clear previous error
        setSuccessMessage(''); // Clear previous success message

        // Validation for prompt and tag
        if (post.prompt.trim().length < 10) {
            setError('The prompt must be at least 10 characters long.');
            setSubmitting(false);
            return;
        }
        if (!post.tag.startsWith('#')) {
            setError('The tag must start with a # character.');
            setSubmitting(false);
            return;
        }

        try {
            const response = await fetch('/api/propmt/new', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: post.prompt,
                    userId: session.user.id,
                    tag: post.tag,
                }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Could not create prompt');
            }

            // Clear the form on success
            setPost({ prompt: '', tag: '' });
            setSuccessMessage('Prompt created successfully!');
            router.push('/');
        } catch (error) {
            console.error("Error creating prompt:", error); // Enhanced logging
            setError(error.message || 'An unexpected error occurred');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
            <Form
                type="Create"
                post={post}
                setPost={setPost}
                submitting={submitting}
                handleSubmit={createPrompt}
            />
        </section>
    );
};

export default CreatePrompt;
