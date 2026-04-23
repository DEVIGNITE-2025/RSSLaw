/*
  CMS AUTH BRIDGE (scaffold)
  This file intentionally keeps auth checks lightweight for now.
  Replace sessionStorage logic with real CMS auth/session validation when backend is ready.
*/

const CMS_AUTH_TOKEN_KEY = 'rss-cms-auth-token';
const CMS_AUTH_ROLE_KEY = 'rss-cms-auth-role';

const getCmsAccessContext = () => {
  const token = sessionStorage.getItem(CMS_AUTH_TOKEN_KEY);
  const role = sessionStorage.getItem(CMS_AUTH_ROLE_KEY) || 'public';

  return {
    isAuthenticated: Boolean(token),
    role,
    token,
    canEditBlogsSocials: Boolean(token) && role === 'admin'
  };
};

window.RSSCmsAccess = {
  getContext: getCmsAccessContext,
  keys: {
    token: CMS_AUTH_TOKEN_KEY,
    role: CMS_AUTH_ROLE_KEY
  }
};