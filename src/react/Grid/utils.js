/**
 * Checks if the current row value(name) is empty
 * @param {*} rowData
 */
export const checkIfRowValueIsEmpty = (rowData) => !(rowData.hasOwnProperty('name') && rowData.name.toString().trim() !== '');

/**
 * Generate new grid row id
 */
export const getNewRowId = () => {
  return window.treeGrid.GenerateId();
};
