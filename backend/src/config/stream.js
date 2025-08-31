import {StreamChat} from "stream-chat";
import {ENV} from "../config/env.js"

const streamClient = StreamChat.getInstance(ENV.STREAM_API_KEY, ENV.STREAM_API_SECRET)

export const upsertStreamUser = async(userData)=>{
    try {
        await streamClient.upsertStreamUser(userData)
        console.log("stream user upserted sucessfully:" ,userData.nmae)
    } catch (error) {
        console.log("error upserting stream user:",error)
    }
}
export const deleteStreamUser = async (userId)=>{
    try {
        await streamClient.deactivateUser(userId)
        console.log("user deleted sucesscfully:".userId)
    } catch (error) {
        console.error("error deleteding stream user:",error)
    }
}

export const generateStreamToken = (userId)=>{
    try {
        const userIdString = userId.toString();
        return streamClient.createToken(userIdString);
    } catch (error) {
        console.log("erroe generating stream token:", error);
        return null;
    }
}
export const addUserToPublicChannels = async (newUserId) => {
  const publicChannels = await streamClient.queryChannels({ discoverable: true });

  for (const channel of publicChannels) {
    await channel.addMembers([newUserId]);
  }
};