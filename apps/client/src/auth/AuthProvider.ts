import { User } from "database";
import { JwtPayload, jwtDecode } from "jwt-decode";
import { HTTP_METHOD, customFetch } from "../common/custom-fetcher";

interface AuthProvider {
  loaded: boolean;
  isAuthenticated: boolean;
  email: string | null;
  user: User | null;
  authTokens: {
    accessToken: string | null;
    refreshToken: string | null;
  };
  isAuthenticatedAsync(): Promise<boolean>;
  signin(email: string, password: string): Promise<Response>;
  signout(): Promise<void>;
  refreshToken(): Promise<void>;
  loadFromStorage(): Promise<void>;
  loadUserProfile(): Promise<void>;
  updateUserProfile(updates: object): Promise<void>;
  tokenIsExpired(token: string): boolean;
  getAccessTokenFromStorage(): string | null;
  getRefreshTokenFromStorage(): string | null;
  changePassword(password: string): Promise<Response>;
}

export const AUTH_TOKENS = "authTokens";

const AuthProvider: AuthProvider = {
  // indicates that the auth provider has full initialized
  // from memory/short-term storage
  loaded: false,
  isAuthenticated: false,
  email: null,
  user: null,
  authTokens: {
    accessToken: null,
    refreshToken: null,
  },
  async isAuthenticatedAsync() {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (this.loaded) {
          resolve(this.isAuthenticated);
          clearInterval(interval);
        }
      }, 100);
    });
  },
  async signin(email: string, password: string): Promise<Response> {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (response.ok) {
      const { accessToken, refreshToken } = await response.json();

      this.isAuthenticated = true;
      this.email = email;
      this.authTokens.accessToken = accessToken;
      this.authTokens.refreshToken = refreshToken;
      localStorage.setItem(AUTH_TOKENS, JSON.stringify(this.authTokens));

      await this.loadUserProfile();
    }

    return response;
  },
  async loadUserProfile(): Promise<void> {
    const { data } = await customFetch("/api/auth/profile");
    this.user = data;
    this.email = data.email;
  },
  async updateUserProfile(updates: object): Promise<void> {
    const { data } = await customFetch("/api/auth/profile", {
      method: "POST",
      body: JSON.stringify(updates),
    });
    this.user = data;
    this.email = data.email;
  },
  async signout() {
    await fetch("/api/auth/logout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.authTokens.accessToken}`,
      },
    });

    this.isAuthenticated = false;
    this.email = null;
    this.user = null;
    this.authTokens.accessToken = null;
    this.authTokens.refreshToken = null;
    localStorage.removeItem(AUTH_TOKENS);
  },
  async refreshToken(): Promise<void> {
    const token = this.getRefreshTokenFromStorage();
    console.log("user token is expired. Attempting to refresh.");
    const response = await fetch("/api/auth/refresh", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      console.log("user token successfully refreshed");
      const { accessToken, refreshToken } = await response.json();
      this.authTokens.accessToken = accessToken;
      this.authTokens.refreshToken = refreshToken;
      localStorage.setItem(AUTH_TOKENS, JSON.stringify(this.authTokens));
    } else {
      await this.signout();
    }
  },

  tokenIsExpired(token: string) {
    const decodedToken = jwtDecode<JwtPayload>(token);

    if (!token || !decodedToken.exp) {
      return true;
    }

    const currentTimestamp = Date.now() / 1000;
    return decodedToken.exp < currentTimestamp;
  },

  async loadFromStorage() {
    console.log("loading user authentication from storage");
    const accessToken = this.getAccessTokenFromStorage();
    const refreshToken = this.getRefreshTokenFromStorage();

    const isAuthenticated =
      accessToken && this.tokenIsExpired(accessToken) === false;
    if (isAuthenticated) {
      console.log("user is authenticated via access token");
      // User access token is still valid we don't need to do anything
      this.authTokens.accessToken = accessToken;
      this.authTokens.refreshToken = refreshToken;
      this.isAuthenticated = true;
      this.loaded = true;
      await this.loadUserProfile();
      return;
    }

    const isExpired = accessToken && this.tokenIsExpired(accessToken);
    if (isExpired) {
      // Access token exists, but is expired. Let's try to refresh before kicking the user out
      this.authTokens.accessToken = accessToken;
      this.authTokens.refreshToken = refreshToken;
      await this.refreshToken();
      this.isAuthenticated = true;
      this.loaded = true;
      await this.loadUserProfile();
      return;
    }

    // We've failed to prove if the token is expired or valid.
    // Kick the user out because we can't be sure what's going on.
    this.loaded = true;
    await this.signout();
  },

  getAccessTokenFromStorage(): string | null {
    const tokens = localStorage.getItem(AUTH_TOKENS);
    const decodedTokens = tokens ? JSON.parse(tokens) : {};
    return decodedTokens.accessToken || null;
  },

  getRefreshTokenFromStorage(): string | null {
    const tokens = localStorage.getItem(AUTH_TOKENS);
    const decodedTokens = tokens ? JSON.parse(tokens) : {};
    return decodedTokens.refreshToken || null;
  },
  async changePassword(password: string): Promise<Response> {
    const response = await fetch("/api/auth/change-password", {
      method: HTTP_METHOD.POST,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.authTokens.accessToken}`,
      },
      body: JSON.stringify({ password }),
    });
    return response;
  },
};

export default AuthProvider;
