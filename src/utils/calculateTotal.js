const calculateTotal = (
  morning,
  evening,
  morning_win,
  evening_win,
  commission,
  gameX
) => {
  morning = parseInt(morning);
  evening = parseInt(evening);
  morning_win = parseInt(morning_win);
  evening_win = parseInt(evening_win);
  commission = parseInt(commission);
  gameX = parseInt(gameX);

  console.table({
    morning,
    evening,
    morning_win,
    evening_win,
    commission,
    gameX,
  });

  const totalNetValue = morning + evening;
  const totalWinValue = morning_win + evening_win;
  const exceedCommission = totalNetValue * (commission / 100);
  const NetTotal = totalNetValue - exceedCommission;
  const WinTotal = totalWinValue * gameX;
  const total = NetTotal - WinTotal;
  return total;
};

module.exports = calculateTotal;
