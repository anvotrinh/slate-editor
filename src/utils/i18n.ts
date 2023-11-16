import { i18nDataMap } from './const';

class I18n {
  get = function (key: string): string {
    return i18nDataMap[key] || key;
  };
  has = function (key: string): boolean {
    return !!i18nDataMap[key];
  };
}

export default new I18n();
