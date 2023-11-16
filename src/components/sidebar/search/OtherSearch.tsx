import React, { ReactNode } from 'react';
import AsyncCreatableSelect from 'react-select/async-creatable';

import i18n from '../../../utils/i18n';
import { unitId } from '../../../utils/const';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { toggleUsingItem } from '../../../store/sidebar';
import { openCreateSeriesModal } from '../../../store/series';
import { createTopic } from '../../../store/topic';
import { ObjectResponse, UnionObject, UnionObjectType } from '../../../apis';
import { createNewObject, getObjectName } from '../utils';
import { MultiValue } from 'react-select';
import { showAlertMessage } from '../../../utils/common';

type Props = {
  type: UnionObjectType;
};
const OtherSearch = ({ type }: Props): JSX.Element => {
  const dispatch = useAppDispatch();
  const sidebarState = useAppSelector((state) => state.sidebar);
  const { using } = sidebarState[type];

  const handleChange = (data: MultiValue<UnionObject>): void => {
    if (data.length === 0) return;
    dispatch(toggleUsingItem({ type, item: data[0] }));
  };

  const handleCreateOption = async (title: string) => {
    if (type === 'series') {
      dispatch(openCreateSeriesModal(title));
    } else if (type === 'topics') {
      const resultAction = await dispatch(createTopic(title));
      if (createTopic.rejected.match(resultAction)) {
        showAlertMessage('Unknow error');
      }
    }
  };

  const loadOptions = async (input: string): Promise<UnionObject[]> => {
    if (!input) {
      return Promise.resolve([]);
    }
    // nonce is not needed. only login cookie is sent for auth.
    const response = await fetch(
      `/cms/ch/${unitId}/${type}/list?query=${input}&offset=0&limit=20`,
      {
        credentials: 'include',
      }
    );
    const { series, topics }: ObjectResponse = await response.json();
    if (type === 'series' && series) {
      return series
        .filter((item) => using.length === 0 || item.id !== using[0].id)
        .map((item) => ({ type: 'series', ...item }));
    }
    if (type === 'topics' && topics) {
      return topics
        .filter((item) => using.length === 0 || item.id !== using[0].id)
        .map((item) => ({ type: 'topics', ...item }));
    }
    return [];
  };

  const getNewOptionData = (
    inputValue: string,
    optionLabel: ReactNode
  ): UnionObject =>
    createNewObject(type, inputValue, optionLabel?.toString() || '');

  return (
    <div className="articleOptionDetail__content">
      <AsyncCreatableSelect
        value={[]}
        defaultOptions
        isMulti
        backspaceRemovesValue
        cacheOptions={false}
        loadOptions={loadOptions}
        placeholder=""
        onCreateOption={handleCreateOption}
        getOptionValue={(option: UnionObject): string => option.id}
        getOptionLabel={(option: UnionObject): string => getObjectName(option)}
        formatCreateLabel={(inputValue: string) =>
          `${i18n.get('create')}: ${inputValue}`
        }
        isValidNewOption={(inputValue: string) => inputValue.trim() !== ''}
        onChange={handleChange}
        getNewOptionData={getNewOptionData}
      />
    </div>
  );
};

export default OtherSearch;
