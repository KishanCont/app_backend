import { Router } from "express";
import { AUTHORIZATION_URL } from "../constants/index.js";
import {
  OAuthCallback,
  webhookPayload,
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
  res.end();
});

installRouter.route("/webhook").post(webhookPayload);

export default installRouter;
