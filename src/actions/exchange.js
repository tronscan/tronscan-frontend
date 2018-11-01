export const SET_SELECT_DATA = 'SET_SELECT_DATA';

export const setSelectData = (data) => ({
  type: SET_SELECT_DATA,
  data,
});

export const getSelectData = (data) => async (dispatch) => {
    dispatch(setSelectData(data));
};
