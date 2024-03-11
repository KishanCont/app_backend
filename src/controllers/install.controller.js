import {
  exchangeAuthorizationCodeForTokens,
  getAccessToken,
  getAccountInfo,
} from "../utils/index.js";
import { createDatabase, saveRefreshTokenToMongo } from "./table.controller.js";

export const OAuthCallback = async (req, res) => {
  // Extract the authorization code from the query parameters
  const authorizationCode = req.query.code;
  if (authorizationCode) {
    try {
      const tokens = await exchangeAuthorizationCodeForTokens(
        authorizationCode
      );
      const refreshToken = tokens.refresh_token;
      const accessToken = (await getAccessToken(refreshToken)).access_token;
      // Use the access token to make requests to the HubSpot API
      const accountInfo = await getAccountInfo(accessToken);
      console.log(accountInfo);
      // Extract organization name and ID from the accountInfo
      const orgName = accountInfo.accountType;
      const orgId = accountInfo.portalId;
      // You can save or use the orgName and orgId as needed
      console.log("Organization Name:", orgName);
      console.log("Organization ID:", orgId);
      // if(req.query.code){
      //   const params=new URLSearchParams();
      //   params.append("grant_type", 'authorization_code',)
      //   params.append('client_id', clientId)
      //   params.append('client_secret',clientSecret)
      //   params.append('redirect_uri', redirectUri)
      //   params.append('code', authorizationCode)
      //   //const token=await exchangeToken(null,params,client)
      //   return await axios({
      //     method:'post',
      //     url:'https://api.hubapi.com/oauth/v1/token',
      //     headers:{
      //       'Accept':'Application/json',
      //       'Content-Type':'application/x-www-form-urlencoded;charset=utf-8'
      //     },
      //     data:params
      //   }).then(async (response)=>{
      //     const tokens=response.data
      //     const refreshToken=tokens.refresh_token
      //     //const portalId=currentPortalId ? currentPortalId : await getCurrentPortal(tokens.access_token)
      //     console.log(refreshToken)
      await saveRefreshTokenToMongo(refreshToken, orgId);
      await createDatabase(orgId);
      //     // Use the access token to make requests to the HubSpot API
      //     const accessToken = tokens.access_token;
      //     // Create custom properties in HubSpot using the access token
      //     await createCustomProperties(accessToken);
      res.redirect(`/success`);
    } catch (error) {
      console.log(error);
    }
  }
};

export const webhookPayload = async (req, res) => {
  try {
    const data = req.body;

    console.log("Received webhook data:", data);
    res.status(200).send("Webhook received successfully");
  } catch (error) {
    console.log(error);
  }
};
