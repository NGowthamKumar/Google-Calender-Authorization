import fs from 'fs';
import {SCOPES, TOKEN_PATH} from '../constants/constants';
import {google} from 'googleapis';
import {googleEvent} from '../helpers/eventFormat';

/**
 * Google calendar class
 */
export class GoogleCalendar {
  /**
    * @constructor
    */
  constructor() {
    if (!GoogleCalendar._credentials) {
      const content = fs.readFileSync(`${__dirname}/../../src/constants/credentials.json`);
      GoogleCalendar._credentials = JSON.parse(content);
    }
  }

  /**
   * Authorise google users
   *
   * @return {Promise}
   */
  authorize() {
    const {client_secret, client_id, redirect_uris} = GoogleCalendar._credentials.web;
    GoogleCalendar.oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);
    return new Promise((resolve, reject) => {
      fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) {
          return this.getAccessToken(GoogleCalendar.oAuth2Client, (concentPageGoogle)=>{
            resolve(concentPageGoogle);
          });
        }
        GoogleCalendar.oAuth2Client.setCredentials(JSON.parse(token));
        resolve('A_GEN');
      });
    });
  }

  /**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
  getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    callback(authUrl);
  }

  /**
   * create auth after google oath completes ( token generation )
   *
   * @param {String} code
   * @return {Promise}
   */
  createAuth(code) {
    return new Promise((resolve, reject) => {
      GoogleCalendar.oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        GoogleCalendar.oAuth2Client.setCredentials(token);
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return reject(err);
          resolve(TOKEN_PATH);
        });
      });
    });
  }
