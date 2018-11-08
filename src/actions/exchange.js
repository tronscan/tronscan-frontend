export const SET_SELECT_DATA = 'SET_SELECT_DATA';
export const SET_SELECT_STATUS = 'SET_SELECT_STATUS';

export const setSelectData = (data) => ({
  type: SET_SELECT_DATA,
  data,
});

export const setSelectStatus = (status) => ({
  type: SET_SELECT_STATUS,
  status,
});

export const getSelectData = (data, isSelect = false) => async (dispatch) => {
    dispatch(setSelectData(data));
    dispatch(setSelectStatus(isSelect))
};
