import { Licensee, ChUnit, Member, Post } from '../apis';

type GlobalData = {
  unit: ChUnit;
  nonce: string;
  i18n: Record<string, string>;
  post: Post;
  member: Member;
  chLicensees: Licensee[];
};

declare const GLOBAL_DATA: GlobalData;

export const unitId = GLOBAL_DATA.unit.id;
export const {
  nonce,
  i18n: i18nDataMap,
  post: initialPost,
  unit,
  member,
  chLicensees,
} = GLOBAL_DATA;
