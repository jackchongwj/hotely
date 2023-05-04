import { useState } from "react";
import { DataGridPro } from "@mui/x-data-grid-pro";
import { Box, Button, Typography } from "@mui/material";

const inventoryData = [
  { id: 1, code: "SC001", name: "Soap", description: "Bar of soap", type: "Toiletries", amount: 1, price: 1.99 },
  { id: 2, code: "SC002", name: "Shampoo", description: "Bottle of shampoo", type: "Toiletries", amount: 1, price: 3.99 },
  { id: 3, code: "SC003", name: "Blanket", description: "Warm blanket", type: "Bedding", amount: 1, price: 25.99 },
  { id: 4, code: "SC004", name: "Towel", description: "Soft towel", type: "Bathroom", amount: 1, price: 5.99 },
  { id: 5, code: "SC005", name: "Floor cleaner", description: "Cleaning solution for floors", type: "Cleaning", amount: 1, price: 8.99 },
];

const columns = [
  { field: "id", headerName: "#", width: 80 },
  { field: "code", headerName: "Stock Code", width: 150 },
  { field: "name", headerName: "Stock Name", width: 200 },
  { field: "description", headerName: "Stock Description", width: 250 },
  { field: "type", headerName: "Stock Type", width: 150 },
  { field: "amount", headerName: "Stock Amount", width: 150},
  { field: "price", headerName: "Price", width: 120, valueFormatter: ({ value }) => `$${value.toFixed(2)}` },
];

const Inventory = () => {
  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowClick = (params) => {
    setSelectedRows(params.rowIds);
  };

  return (
    <Box m="1.5rem 2.5rem" >
      <Typography variant="h3" sx={{ marginTop: "1rem", marginBottom: "1rem" }}>Inventory</Typography>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Box display="flex">
          <Button variant="contained" color="primary" sx={{ mr: 2 }}>
            Add Item
          </Button>
          <Button variant="contained" color="primary">
            Edit Item
          </Button>
        </Box>
        <Box display="flex">
          <Button variant="contained" color="secondary" disabled={selectedRows.length === 0}>
            Delete Selected
          </Button>
        </Box>
      </Box>
      <Box style={{ height: "100%", width: "100%" }}>
        <DataGridPro
          rows={inventoryData}
          columns={columns}
          pageSize={5}
          onRowClick={handleRowClick}
          selectionModel={selectedRows}
          checkboxSelection
        />
      </Box>
    </Box>
  );
};

export default Inventory;