export const convertDateFormat = (date) => {
  //convert from yyyy-mm-dd to dd/mm/yyyy
  const dateArr = date.split("-");
  return `${dateArr[2]}/${dateArr[1]}/${dateArr[0]}`;
};

export const getDayOfWeek = (date) => {
  //convert from dd/mm/yyyy to yyyy-mm-dd
  const dateArr = date.split("/");
  const newDate = `${dateArr[2]}-${dateArr[1]}-${dateArr[0]}`;
  const dayOfWeek = new Date(newDate).getDay();
  return isNaN(dayOfWeek)
    ? null
    : [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ][dayOfWeek];
};

export const getYearRange = (year) => {
  const arr = [];
  for (let i = year - 2; i <= year + 2; i++) arr.push(i);
  return arr;
};
