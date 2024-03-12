import hubspot from "@hubspot/api-client";
import { HUBSPOT_API_KEY, HUBSPOT_APP_ID } from "../constants/index.js";
import {
  exchangeAuthorizationCodeForTokens,
  getAccessToken,
  getAccountInfo,
  getRecords,
} from "../utils/index.js";
import {
  createDatabase,
  saveRefreshTokenToMongo,
  saveTestData,
} from "./table.controller.js";

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

const hubspotClient = new hubspot.Client({
  developerApiKey: HUBSPOT_API_KEY,
});
const appId = HUBSPOT_APP_ID;

export const webhookPayloadGetProducts = async (req, res) => {
  try {
    const apiResponse = await hubspotClient.crm.products.getAll(
      appId,
      (err, data) => {
        if (err) {
          console.log(err);
        } else {
          console.log(data);
        }
      }
    );
    console.log(JSON.stringify(apiResponse, null, 2));

    res.status(200).send(apiResponse);
  } catch (e) {
    e.message === "HTTP request failed"
      ? console.error(JSON.stringify(e.response, null, 2))
      : console.error(e);
  }
};

export const webhookPostPayload = async (req, res) => {
  const SubscriptionCreateRequest = {
    propertyName: "email",
    active: true,
    eventType: "product.creation",
  };

  try {
    const apiResponse = await hubspotClient.webhooks.subscriptionsApi.create(
      appId,
      SubscriptionCreateRequest
    );
    console.log(JSON.stringify(apiResponse, null, 2));
  } catch (e) {
    e.message === "HTTP request failed"
      ? console.error(JSON.stringify(e.response, null, 2))
      : console.error(e);
  }
};

export const CRMCardDataFetch = async (req, res) => {
  try {
    const { associatedObjectId } = req.query;

    const record = await getRecords(associatedObjectId);
    await saveTestData(record);
    res.status(200).send(record);
  } catch (error) {
    console.log(error.message);
  }
};

// https://cloud.mongodb.com/v2/65e82976734145225f070c7c?userId=50994124&userEmail=ravi.rawat@contrivers.com&associatedObjectId=17961353877&associatedObjectType=DEAL&portalId=45485806&dealname=trailDeal&dealstage=appointmentscheduled#/metrics/replicaSet/65e82a0f1d5417457af783d6/explorer/

// associatedObjectId=17961353877
// userId

// https://hubspot-app-df0m.onrender.com/fetchurl?userId=50994124&userEmail=ravi.rawat@contrivers.com&associatedObjectId=17961353877&associatedObjectType=DEAL&portalId=45485806&dealname=trailDeal&dealstage=appointmentscheduled

// async function updateRecords(dealId, accessToken) {
//   const getLineItems = `https://api.hubapi.com/crm/v3/objects/line_items?associations.deals=${dealId}`;
//   try {
//     const response = await axios.post(getLineItems, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });
//   } catch (error) {
//     console.error(error.message);
//   }
// }
