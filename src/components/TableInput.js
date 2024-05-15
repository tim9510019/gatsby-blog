import React, { useState, useEffect } from "react";

const TableInput = ({ getValue, row, column, table }) => {
  const [value, setValue] = useState(getValue());

  // useEffect(() => {
  //   const handleChangeData = () => {
  //     table.options.meta?.updateData(row.index, column.id, value);
  //   };
  //   handleChangeData();
  // }, [value]);
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export default TableInput;
