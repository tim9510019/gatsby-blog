import React, { useState, useEffect } from "react";

const TableSelect = ({ getValue, row, column, table }) => {
  const [value, setValue] = useState(getValue());
  const handleChange = (e) => {
    console.log(e.target.value);
    setValue(e.target.value);
  };
  const handleChangeData = () => {
    console.log(getValue(), row.index, column.id, table.options.meta);
    table.options.meta.updateData(row.index, column.id, value);
  };
  // useEffect(() => {
  //   handleChangeData();
  // }, [value]);
  return (
    <select value={value} onChange={handleChange}>
      <option value={getValue()}>{getValue()}</option>
      <option value="下載">下載</option>
      <option value="上傳">上傳</option>
      <option value="等待中">等待中</option>
    </select>
  );
};

export default TableSelect;
