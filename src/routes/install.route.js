import { Router } from "express";
import { AUTHORIZATION_URL, HUBSPOT_APP_ID } from "../constants/index.js";
import {
  CRMCardDataFetch,
  OAuthCallback,
  webhookPayloadGetProducts,
  webhookPostPayload,
} from "../controllers/install.controller.js";

const installRouter = Router();

// Handle the initial installation request
installRouter.route("/").get((_, res) => {
  // Redirect the user to the HubSpot OAuth 2.0 authorization URL
  res.redirect(AUTHORIZATION_URL);
});

// Handle the OAuth callback after the user grants authorization
installRouter.route("/oauth-callback").get(OAuthCallback);

installRouter.route("/success").get((_, res) => {
  res.setHeader("Content-Type", "text/html");
  res.write(`<h4>successfully installed<h4>`);
  res.status(200).send();
  res.end();
});

installRouter
  .route(`/webhook`)
  .get(webhookPayloadGetProducts)
  .post(webhookPostPayload);

installRouter.route("/fetchurl").get(CRMCardDataFetch);

export default installRouter;
