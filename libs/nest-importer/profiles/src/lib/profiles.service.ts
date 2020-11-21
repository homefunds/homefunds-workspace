import { Injectable } from '@nestjs/common';
import { ActionResult, UserData } from './types';
import {decrypt, encrypt} from './crypto-utils';
import { touchFolder, readJsonFile, writeJsonFile, getFolderFiles, fileExists, deleteFile } from './fs-utils';
import * as shortid from "shortid";
import * as zxcvbn from "zxcvbn";
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

// pass meta properties to somewhere else
const metadataProperties = ['info'];
const excludeProperties = ['configuration', 'addon'];


@Injectable()
export class ProfilesService {
  private _appUsersFolder: string = '';

  constructor(private configService: ConfigService) {
    this._appUsersFolder = configService.get('PROFILES_PATH');
  }
  private _verifyAppUsersFolder = () => {
    if (!this._appUsersFolder) {
      throw new Error('missing app data folder (did you remember to provide it in configuration?)');
    }
  }

  getUserList = () : ActionResult<{users: {id: string, name: string, passwordHint: string}[]}> => {
    this._verifyAppUsersFolder();
    try {
      touchFolder(this._appUsersFolder);
      const users = getFolderFiles(this._appUsersFolder, '.json').map(fileName => {
        const fileContent = readJsonFile(path.join(this._appUsersFolder, fileName));
        return {
          id: this.getUserId(fileName),
          name: fileContent.info.name,
          passwordHint: fileContent.info.passwordHint
        }
      });

      return {status: true, users};
    }catch (e) {
      return {status: false, error: {id: 'get-user-list-failure', message: e.message}}
    }
  }

  getUserFilePathById = (id: string): string => {
    this._verifyAppUsersFolder();
    return path.join(this._appUsersFolder, `${id}.json`);
  }

  getUserId = (filePath: string): string => {
    this._verifyAppUsersFolder();
    return path.basename(filePath, '.json');
  }

  loadUser = (id: string, password: string) : ActionResult<{ data: UserData}> => {
    this._verifyAppUsersFolder();
    touchFolder(this._appUsersFolder);

    const filePath = this.getUserFilePathById(id);
    const fileContent = fileExists(filePath) ? readJsonFile(filePath) : null;

    try {
      if (fileContent) {
        const sensitiveContentText = decrypt(password, fileContent.encryptedContent);
        const userData = JSON.parse(sensitiveContentText);

        // TODO can remove once all relevant accounts were upgradeds
        userData.operations.forEach(operation => {
          if (operation.accounts && operation.accounts.length === 1 && Array.isArray(operation.accounts[0])) {
            operation.accounts = operation.accounts[0];
            return;
          }

          if (!operation.accountMatches) {
            return;
          }

          operation.accounts = operation.accountMatches.map(prevAccount => {
            return {
              fromId: prevAccount.sourceId,
              fromAccountId: prevAccount.sourceAccountId,
              toId: '',
              toAccountId: prevAccount.toAccountId,
              isActive: prevAccount.isActive
            }
          });

          delete operation.accountMatches;
        });

        return {
          status: true,
          data: {
            id: this.getUserId(id),
            info: fileContent.info,
            sources: userData.sources,
            operations: userData.operations,
            emailSettings: userData.emailSettings,
            accounts: [
              { id: '1',
                name: '4423',
                sourceId: '1',
              },
              { id: '1',
                name: '1234',
                sourceId: '2',
              }
            ]
          }
        }
      } else {
        return { status: false, error: {id: 'unknown_profile' }};
      }
    } catch (e) {
      return {
        status: false,
        error: /^Unexpected token [^ ]+? in JSON at position 0/.test(e.message) ?
          {id: 'invalid_credentials'}
          : {id: 'message', message: e.message}
      }
    }
  }

  getNewUserId = (): ActionResult<{id: string}> => {

    try {
      this._verifyAppUsersFolder();
      touchFolder(this._appUsersFolder);
      const usersResult = this.getUserList();

      if (!usersResult.status) {
        return { status: false, error: usersResult.error};
      }
      let invalidId = true;
      let id;

      while (invalidId) {
        id = shortid();
        invalidId = usersResult.users.map(user => user.id).indexOf(id) > -1;
      }

      return { status: true, id}
    }catch (e) {
      return { status: false, error: e}
    }

  }

  validatePasswordStrength = (password: string): { isValid: boolean, suggestion: string} => {
    if (!password) {
      return { isValid: false, suggestion: 'password cannot be empty'};
    }

    const {score, feedback: {warning, suggestions}} = zxcvbn(password);
    const isValid = score >= 3;
    const suggestion = !isValid ? warning || (suggestions && suggestions.length ? suggestions[0] : null) || 'Password is too simply' : null;
    return { isValid, suggestion}
  }

  createUser = (password, data): ActionResult<{id: string}> => {

    const {isValid, suggestion} = this.validatePasswordStrength(password);

    if (!isValid) {
      return {status: false, error: {id: 'message', message: suggestion}}
    }

    const newUserResult = this.getNewUserId();

    if (!newUserResult.status) {
      return {status: false, error: newUserResult.error}
    }

    const saveUserResult = this.saveUser(newUserResult.id, password, data);

    if (saveUserResult.status) {
      return {status: true, id: newUserResult.id};
    } else {
      return {status: false, error: saveUserResult.error}
    }
  }

  deleteUser = (id, password): ActionResult => {
    this._verifyAppUsersFolder();
    try {
      // make sure the user provided credentials for that user
      this.loadUser(id, password);
      const filePath = this.getUserFilePathById(id);
      deleteFile(filePath);
      return { status: true };
    } catch (e) {
      return {status: false, error: e};
    }
  }

  saveUser = (id, password, data): ActionResult => {
    this._verifyAppUsersFolder();
    try {
      touchFolder(this._appUsersFolder);

      const filePath = this.getUserFilePathById(id);

      const fileContent = Object.entries(data).reduce((acc, [propKey, propValue]) => {
        if (excludeProperties.indexOf(propKey) > -1) {
          return acc;
        }

        if (metadataProperties.indexOf(propKey) > -1) {
          acc.content[propKey] = propValue;
        } else {
          acc.sensitiveContent[propKey] = propValue;
        }

        return acc;
      }, {sensitiveContent: {}, content: {}});

      writeJsonFile(filePath, {
        ...fileContent.content,
        encryptedContent: encrypt(password, JSON.stringify(fileContent.sensitiveContent))
      });

      return { status: true }
    }catch(e) {
      return { status: false, error: e }
    }
  }
}
