import { Client, Account } from "appwrite";

const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1") // Your Appwrite endpoint
  .setProject("675fcc1f000c7b70d9a4"); // Your Appwrite project ID

// Check Appwrite health status
client
  .call("get", "/health")
  .then((response) => {
    console.log("Appwrite is healthy:", response);
  })
  .catch((error) => {
    console.error("Appwrite endpoint test failed:", error.message);
  });

const account = new Account(client);

// Check Appwrite session function
const checkAppwriteSession = async () => {
  try {
    const session = await account.get();
    const { email } = session;
    console.log("User already logged in via Appwrite:", email);
    return email;
  } catch (error) {
    console.error("No active Appwrite session found:", error.message);
    return null;
  }
};

export { client, account, checkAppwriteSession };
