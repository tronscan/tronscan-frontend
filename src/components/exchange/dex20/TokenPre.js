export const precisions = {
  ante_trx: 4,
  trx_usdt: 4,
  btt_trx: 4,
  "888_trx": 4,
  vcoin_trx: 4,
  tnx_trx: 4,
  terc_trx: 4,
  vena_trx: 4,
  seed_trx: 4,
  cgiza_trx: 4,
  poppy_trx: 4,
  twx_trx: 4,
  up_trx: 4,
  twm_trx: 4,
  scc_trx: 4,
  dc_trx: 4,
  kaos_trx: 4,
  cdf_trx: 4,
  tsy_trx: 4,
  ace_trx: 5,
  igg_trx: 5,
  win_trx: 5,
  win_usdt: 6,
  att_trx: 5,
  twj_trx: 5,
  tone_trx: 5,
  tronish_trx: 5,
  sct_trx: 5,
  btt_usdt: 6,
  igg_usdt: 6,
  lvh_trx: 6,
  truc_trx: 6,
  nfun_trx: 6,
  blaze_trx: 4,
  hora_trx: 6,
  mlt_trx: 6,
  live_trx: 4,
  vcoin_usdt: 5,
  poppy_usdt: 5,
  "888_usdt": 5,
  tshare_trx: 4,
  topia_trx: 3,
  dvs_trx: 2,
  bnkr_trx: 3,
  btzc_trx: 4,
};

export function fixed(value, n) {
  // return Math.floor(value * Math.pow(10, n)) / Math.pow(10, sn)
  value = value + "";
  if (n === 0) {
    value = parseInt(value);
  } else {
    if (value.lastIndexOf(".") > -1) {
      value = value.substring(0, value.lastIndexOf(".") + n + 1);
    }
  }

  return Number(value);
}
