export const parseNestedContentData = (parsedData) => {
  const resultArray = [];
  for (const key in parsedData) {
    if (parsedData.hasOwnProperty(key)) {
      const appointments = parsedData[key];

      for (const childKey in appointments) {
        if (appointments.hasOwnProperty(childKey)) {
          resultArray.push({ child_key: childKey, ...appointments[childKey] });
        }
      }
    }
  }

  return resultArray;
};
