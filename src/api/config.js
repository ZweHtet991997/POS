const trimTrailingSlash = (value = "") => value.replace(/\/+$/, "");

const isProduction = String(import.meta.env.VITE_IS_PRODUCTION).toLowerCase() === "true";

const localApiUrl = trimTrailingSlash(import.meta.env.VITE_LOCAL_API_URL || "http://localhost:5284");
const productionApiUrl = trimTrailingSlash(
  import.meta.env.VITE_PRODUCTION_API_URL || "http://nksoftware-001-site15.anytempurl.com"
);

export const API_BASE_URL = isProduction ? productionApiUrl : localApiUrl;
export const API_V1_BASE_URL = `${API_BASE_URL}/api/v1`;
export const IS_PRODUCTION = isProduction;
