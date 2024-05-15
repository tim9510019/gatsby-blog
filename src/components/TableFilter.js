import React, { useEffect, useState } from "react";

const TableFilter = ({ columnFilters, setColumnFilters }) => {
  const symbolValue = columnFilters.find((f) => f.id === "symbol")?.value || "";
  const handleChange = (id, value) => {
    setColumnFilters((prev) =>
      prev.filter((f) => f.id !== id).concat({ id, value })
    );
  };
  return (
    <div>
      <input
        type="text"
        placeholder="篩選值"
        value={symbolValue}
        onChange={(e) => handleChange("symbol", e.target.value)}
      />
    </div>
  );
};

export default TableFilter;
