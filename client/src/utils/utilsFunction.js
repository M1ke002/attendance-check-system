export const convertDateFormat = (date, type) => {
  if (type === "dd/mm/yyyy") {
    if (!date.includes("-")) return date;
    //convert from yyyy-mm-dd to dd/mm/yyyy
    const dateArr = date.split("-");
    return `${dateArr[2]}/${dateArr[1]}/${dateArr[0]}`;
  } else if (type === "yyyy-mm-dd") {
    if (!date.includes("/")) return date;
    //convert from dd/mm/yyyy to yyyy-mm-dd
    const dateArr = date.split("/");
    return `${dateArr[2]}-${dateArr[1]}-${dateArr[0]}`;
  } else {
    console.log("invalid date format");
  }
};

export const getDayOfWeek = (date) => {
  //convert from dd/mm/yyyy to yyyy-mm-dd
  const newDate = convertDateFormat(date, "yyyy-mm-dd");
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

export const isValidTime = (time) => {
  if (time.length >= 6) return false;
  if (time.length >= 3 && !time.includes(":")) return false;
  //case 30:00 -> invalid
  if (time.length === 1 && !isNaN(time)) return parseInt(time.charAt(0)) < 3;
  //case 24:00 -> invalid
  if (time.length === 2 && !isNaN(time)) {
    if (parseInt(time.charAt(0)) === 2) return parseInt(time.charAt(1)) < 4;
    else return true;
  }
  if (time.length === 3) return true;
  //case 21:60 -> invalid
  if (time.length === 4 && !isNaN(time.charAt(3)))
    return parseInt(time.charAt(3)) < 6;
  if (time.length === 5) return !isNaN(time.charAt(4));
  return false;
};
