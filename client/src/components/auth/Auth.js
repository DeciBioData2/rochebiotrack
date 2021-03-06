import auth0 from 'auth0-js';

class Auth {
  constructor() {
    this.devLink = 'http://localhost:3000'
    this.productionLink = 'https://rochebiotrack.herokuapp.com'
    this.auth0 = new auth0.WebAuth({
      // the following three lines MUST be updated
      domain: 'decibio.auth0.com',
      audience: 'https://decibio.auth0.com/userinfo',
      clientID: 'Ulr1N4yAY3xzKN6Jn8493PRYn5zbnFhw',
      redirectUri: `${this.productionLink}/callback`,
      responseType: 'id_token',
      scope: 'openid profile'
    });

    this.getProfile = this.getProfile.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
  }

  getProfile() {
    return this.profile;
  }

  getIdToken() {
    return this.idToken;
  }

  isAuthenticated() {
    return new Date().getTime() < this.expiresAt;
  }

  signIn() {
    this.auth0.authorize();
  }

  handleAuthentication() {
    return new Promise((resolve, reject) => {
      this.auth0.parseHash((err, authResult) => {
        if (err) return reject(err);
        if (!authResult || !authResult.idToken) {
          return reject(err);
        }
        this.setSession(authResult);
        resolve();
      });
    })
  }

  setSession(authResult) {
    this.idToken = authResult.idToken;
    this.profile = authResult.idTokenPayload;
    // set the time that the id token will expire at
    this.expiresAt = authResult.idTokenPayload.exp * 1000;
  }

  signOut() {
    // clear id token, profile, and expiration
    this.auth0.logout({
      returnTo: `${this.productionLink}`,
      clientID: 'Ulr1N4yAY3xzKN6Jn8493PRYn5zbnFhw',
    });
  }

  silentAuth() {
    return new Promise((resolve, reject) => {
      this.auth0.checkSession({}, (err, authResult) => {
        if (err) return reject(err);
        this.setSession(authResult);
        resolve();
      });
    });
  }
}

const auth0Client = new Auth();

export default auth0Client;