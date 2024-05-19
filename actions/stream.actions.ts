'use server';

import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";
import { StreamVideoClient } from "@stream-io/video-react-sdk";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.STREAM_SECRET_KEY;

export const tokenProvider = async () => {
    const user = await currentUser();
    if (!user) throw new Error('User is Not Logged In');
    if (!apiKey) throw new Error('Stream API key not found or Missing');
    if (!apiSecret) throw new Error('Stream API secret not found or Missing');

    // create stream client
    const client = new StreamClient(apiKey, apiSecret);
    

    // set issued time
    const issued = Math.floor(Date.now() / 1000 ) - 60
    // set expire time
    const exp = Math.round(new Date().getTime() / 1000) + 60 * 60;

    // create token
    const token = client.createToken(user.id, exp, issued);
    return token;
}