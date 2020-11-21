import { ensureDirSync, writeJsonSync, readJsonSync, removeSync, writeFileSync} from 'fs-extra';
import * as nodePath from 'path';
import { readdirSync, existsSync } from 'fs';



export function touchFolder(folderPath: string) {
  return ensureDirSync(folderPath);
}


export function writeJsonFile(path: string, data: any) {
  return writeJsonSync(path, data);
}

export function readJsonFile(path: string) {
  return readJsonSync(path);
}

export function deleteFile(path: string) {
  return removeSync(path);
}

export function getFolderFiles(path: string, extension: string) {
  const files = readdirSync(path);
  const regexp = new RegExp(`${extension}$`,"i")
  return files.filter((file: string) => file.match(regexp));
}

export function fileExists(path: string, limitToAppStorage = true) {
  return existsSync(path);
}

export function writeFile(filePath: string, data: string, options: Record<string, any>) {
  const folderPath = nodePath.dirname(filePath);
  touchFolder(folderPath);

  return writeFileSync(filePath, data, options);
}
