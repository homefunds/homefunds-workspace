export type ActionResult<T extends {} = {}> = ({ status: true, error?: never } & T) | ({ status: false, error: {id: string, message?: string}});


export type UserDataSource = {
  id: string;
  description?: string;
  sourceId: string;
  addons: Record<string, string>,
  data: Record<string, any>;
}

export type UserDataAccount = {
  id: string;
  name: string;
  sourceId: string;
}

export interface UserOperationAccount {
  fromId: string,
  fromAccountId: string,
  toId?: string,
  toAccountId?: string,
  isActive: boolean
}

export type UserDataOperation = {
  id: string;
  operationAddonId: string;
  description: string;
  data: Record<string, any>,
  lastExecuteTime: Date | null,
  accounts: UserOperationAccount[]
}

export type UserEmailSettingsProviders  = SendGridProvider | SMTPProvider;


export interface UserEmailSettings {
  sendFrom: string,
  sendTo: string,
  provider: UserEmailSettingsProviders
}

export function isSendGridProvider(provider: any) : provider is SendGridProvider {
  return provider && provider.id === EmailProviders.SendGrid;
}

export enum EmailProviders {
  SendGrid = 'sendgrid',
  SMTP = 'smtp'
}

export interface SendGridProvider {
  id: EmailProviders.SendGrid,
  apiKey: string,
}

export function isSMTPProvider(provider: any) : provider is SMTPProvider {
  return provider && provider.id === EmailProviders.SMTP;
}

export interface SMTPProvider {
  id: EmailProviders.SMTP,
  host: string,
  secure: boolean,
  port: number,
  username: string,
  password: string
}

export type UserData = {
  id: string;
  info: {
    name: string;
  };
  accounts: UserDataAccount[];
  sources: UserDataSource[];
  operations: UserDataOperation[];
  emailSettings: UserEmailSettings | null
};
