import xhr from "axios/index";

export const SET_VOLUME_DATA = 'SET_VOLUME_DATA';
export const SET_PRICE_DATA = 'SET_PRICE_DATA';

export const setVolumeData = (volume = []) => ({
  type: SET_VOLUME_DATA,
  volume,
});


export const setPriceData = (prices = []) => ({
  type: SET_PRICE_DATA,
  prices,
});

export const loadPriceData = () => async (dispatch) => {

  let {data} = await xhr.get("https://min-api.cryptocompare.com/data/histoday?fsym=TRX&tsym=USD&limit=10");
  dispatch(setPriceData(data.Data));

  let {data: volumeData} = await xhr.get("https://min-api.cryptocompare.com/data/exchange/histohour?fsym=TRX&tsym=USD&limit=10");
  volumeData = volumeData.Data.map(row => ({
    time: row.time,
    volume: parseInt(row.volume),
  }));
  dispatch(setVolumeData(volumeData));
};
