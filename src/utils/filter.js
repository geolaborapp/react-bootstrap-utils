export const defaultFilter = (_searchValue) => (item) => {
  const itemValue = JSON.stringify(item.label).toLowerCase();
  const searchValue = _searchValue.toLowerCase();

  return itemValue.includes(searchValue);
};
