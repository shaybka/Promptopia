import { connectToDB } from "@utils/database";
import Prompt from "@models/Prompt"; 

export const POST = async (req) => {
    try {
        // Parse the incoming JSON request
        const { prompt, userId, tag } = await req.json();

        // Ensure the required fields are provided
        if (!prompt || !userId || !tag) {
            return new Response(JSON.stringify({ message: "Missing required fields" }), {
                status: 400, // Bad Request
                headers: { "Content-Type": "application/json" }
            });
        }

        // Connect to the database
        await connectToDB();

        // Create a new Prompt document
        const newPrompt = new Prompt({ prompt, creator: userId, tag });
        await newPrompt.save();

        // Respond with the newly created prompt
        return new Response(JSON.stringify(newPrompt), {
            status: 201, // Created
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        // Log the error to the server console
        console.error("Error creating prompt:", error);

        // Respond with an error message
        return new Response(JSON.stringify({
            message: "Failed to create new prompt",
            error: error.message
        }), {
            status: 500, // Internal Server Error
            headers: { "Content-Type": "application/json" }
        });
    }
};
