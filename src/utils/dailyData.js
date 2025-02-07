const dailyData = (array, key) => {
  const data = array.reduce((acc, curr) => {
    const existingData = acc.find((d) => d.date === curr.date);

    if (existingData) {
      existingData.total += curr[key];
    } else {
      acc.push({ date: curr.date, total: curr[key] });
    }

    return acc;
  }, []);
  return data;
};

module.exports = dailyData;
