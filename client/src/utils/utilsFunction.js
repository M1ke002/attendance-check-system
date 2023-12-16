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

export const validateTimeRange = (startTime, endTime) => {
  // Split the start and end times into hours and minutes
  const startParts = startTime.split(":");
  const endParts = endTime.split(":");

  // Convert the hours and minutes to numbers
  const startHour = parseInt(startParts[0], 10);
  const startMinute = parseInt(startParts[1], 10);
  const endHour = parseInt(endParts[0], 10);
  const endMinute = parseInt(endParts[1], 10);

  // Check if the start time is before the end time
  if (
    startHour < endHour ||
    (startHour === endHour && startMinute < endMinute)
  ) {
    return true;
  } else {
    return false;
  }
};

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
