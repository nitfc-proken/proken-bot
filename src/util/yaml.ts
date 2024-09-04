import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

export class YamlConfiguation{ 
  private static filePath = path.resolve('data/.yaml');
  private static fileContents = fs.readFileSync(YamlConfiguation.filePath, 'utf8');
  private static data:any = yaml.load(YamlConfiguation.fileContents);

  static get(key: string): any {
    const keys = key.split('.');
    let value = YamlConfiguation.data;

    for (const k of keys) {
      if (value[k] !== undefined) {
        value = value[k];
      } else {
        throw new Error(`Key "${key}" not found in YAML file.`);
      }
    }
    return value;
  }

}


