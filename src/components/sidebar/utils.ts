import { UnionObject, UnionObjectType } from '../../apis';

export function isObjectHasType<T extends UnionObject>(
  object: UnionObject,
  objectType: T['type']
): object is T {
  return object.type === objectType;
}

export const getObjectName = (object: UnionObject): string => {
  switch (object.type) {
    case 'series':
    case 'topics':
      return object.title;
    case 'authors':
    case 'licensees':
      return object.name;
    default:
      return '';
  }
};
export const getObjectImageUrl = (object: UnionObject): string => {
  switch (object.type) {
    case 'series':
      return object.cover_image?.thumb_360 || '';
    case 'authors':
      return object.profile_image?.thumb_360 || '';
    case 'licensees':
      return object.profile_image?.thumb_360 || '';
    default:
      return '';
  }
};
export const isObjectHasImage = (object: UnionObject): boolean => {
  return !!getObjectImageUrl(object);
};

export const createNewObject = (
  objectType: UnionObjectType,
  id: string,
  name: string
): UnionObject => {
  switch (objectType) {
    case 'series':
      return {
        type: objectType,
        id,
        title: name,
        cover_image: null,
      };
    case 'topics':
      return {
        type: objectType,
        id,
        title: name,
      };
    case 'authors':
      return {
        type: objectType,
        id,
        email: '',
        name,
        job_title: '',
        about: '',
        profile_image: null,
      };
    case 'licensees':
      return {
        type: objectType,
        id,
        name,
        profile_image: null,
      };
  }
};
