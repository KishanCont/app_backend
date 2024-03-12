import axios from "axios";
import {
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
  REFRESH_TOKEN,
} from "../constants/index.js";

export async function exchangeAuthorizationCodeForTokens(authorizationCode) {
  // Use the authorization code to obtain the access and refresh tokens
  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("client_id", CLIENT_ID);
  params.append("client_secret", CLIENT_SECRET);
  params.append("redirect_uri", REDIRECT_URI);
  params.append("code", authorizationCode);
  try {
    const response = await axios({
      method: "post",
      url: "https://api.hubapi.com/oauth/v1/token",
      headers: {
        Accept: "Application/json",
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      data: params,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error exchanging authorization code for tokens:",
      error.message
    );
    throw error;
  }
}

export async function getAccessToken(refreshToken) {
  // Use the authorization code to obtain the access and refresh tokens
  const params = new URLSearchParams();
  params.append("grant_type", "refresh_token");
  params.append("client_id", CLIENT_ID);
  params.append("client_secret", CLIENT_SECRET);
  params.append("redirect_uri", REDIRECT_URI);
  params.append("refresh_token", refreshToken);
  try {
    const response = await axios({
      method: "post",
      url: "https://api.hubapi.com/oauth/v1/token",
      headers: {
        //'Accept':'Application/json',
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      data: params,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error exchanging authorization code for tokens:",
      error.message
    );
    throw error;
  }
}

export async function getAccountInfo(accessToken) {
  try {
    const response = await axios.get(
      "https://api.hubapi.com/integrations/v1/me",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error getting account information:", error.message);
    throw error;
  }
}

export async function getRecords(dealId) {
  const getLineItems = `https://api.hubapi.com/crm/v3/objects/line_items?associations.deals=${dealId}`;
  try {
    const data = await getAccessToken(REFRESH_TOKEN);
    const response = await axios.get(getLineItems, {
      headers: {
        Authorization: `Bearer ${data.access_token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(error.message);
  }
}
