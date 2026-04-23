// TEST CREDENTIALS — for local development only.
// Remove before deploying to a live environment.
const TEST_CREDENTIALS = { identity: 'matt', password: '123' };

const cmsLoginForm = document.querySelector('.cms-login-form');

if (cmsLoginForm) {
  const identityInput = document.querySelector('#cms-identity');
  const passwordInput = document.querySelector('#cms-password');
  const identityError = document.querySelector('#cms-identity-error');
  const passwordError = document.querySelector('#cms-password-error');

  // CMS authentication integration point:
  // Replace this with a secure request to your CMS auth endpoint.
  // On success, persist token/role via window.RSSCmsAccess.keys and redirect to admin editing UI.
  const persistCmsSession = (token, role) => {
    if (!window.RSSCmsAccess?.keys) {
      return;
    }

    sessionStorage.setItem(window.RSSCmsAccess.keys.token, token);
    sessionStorage.setItem(window.RSSCmsAccess.keys.role, role);
  };

  const setError = (input, errorElement, message) => {
    if (!input || !errorElement) {
      return;
    }

    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    errorElement.textContent = message;
  };

  const validateIdentity = () => {
    if (!identityInput) {
      return true;
    }

    const value = identityInput.value.trim();

    if (!value) {
      setError(identityInput, identityError, 'Email or username is required.');
      return false;
    }

    setError(identityInput, identityError, '');
    return true;
  };

  const validatePassword = () => {
    if (!passwordInput) {
      return true;
    }

    const value = passwordInput.value;

    if (!value) {
      setError(passwordInput, passwordError, 'Password is required.');
      return false;
    }

    const isTestUser = identityInput?.value.trim() === TEST_CREDENTIALS.identity;
    if (!isTestUser && value.length < 8) {
      setError(passwordInput, passwordError, 'Password must be at least 8 characters.');
      return false;
    }

    setError(passwordInput, passwordError, '');
    return true;
  };

  identityInput?.addEventListener('blur', validateIdentity);
  passwordInput?.addEventListener('blur', validatePassword);

  cmsLoginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const identity = identityInput?.value.trim();
    const password = passwordInput?.value;

    // Test credential check — replace with real CMS auth endpoint call.
    if (identity === TEST_CREDENTIALS.identity && password === TEST_CREDENTIALS.password) {
      persistCmsSession('test-token', 'admin');
      sessionStorage.setItem('rss-cms-identity', identity);
      window.location.assign('cms-admin.html');
      return;
    }

    const isIdentityValid = validateIdentity();
    const isPasswordValid = validatePassword();

    if (!isIdentityValid || !isPasswordValid) {
      event.preventDefault();

      if (!isIdentityValid) {
        identityInput?.focus();
        return;
      }

      passwordInput?.focus();
      return;
    }

    // CMS auth integration point:
    // event.preventDefault();
    // const authResult = await fetch('/cms/auth/login', ...);
    // persistCmsSession(authResult.token, authResult.role);
    // window.location.assign('/cms/admin');
  });
}
