import { onRequestGet as __api_confirm_ts_onRequestGet } from "/Users/tolga_mac/Desktop/AI APPLICATIONS/openborders.tr/functions/api/confirm.ts"
import { onRequestPost as __api_register_ts_onRequestPost } from "/Users/tolga_mac/Desktop/AI APPLICATIONS/openborders.tr/functions/api/register.ts"

export const routes = [
    {
      routePath: "/api/confirm",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_confirm_ts_onRequestGet],
    },
  {
      routePath: "/api/register",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_register_ts_onRequestPost],
    },
  ]