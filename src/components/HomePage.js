import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  Container,
  Grid,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify"; // Import toast from react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import the CSS
import {
  deleteUser,
  getUser,
  updateUser,
  userAdd,
} from "../utilities/service/User";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";

// Sample data
const rows = [
  {
    id: 1,
    lastName: "Snow",
    firstName: "Jon",
    age: 14,
    email: "jon.snow@example.com",
  },
  {
    id: 2,
    lastName: "Lannister",
    firstName: "Cersei",
    age: 31,
    email: "cersei.lannister@example.com",
  },
  {
    id: 3,
    lastName: "Lannister",
    firstName: "Jaime",
    age: 31,
    email: "jaime.lannister@example.com",
  },
  {
    id: 4,
    lastName: "Stark",
    firstName: "Arya",
    age: 11,
    email: "arya.stark@example.com",
  },
  {
    id: 5,
    lastName: "Targaryen",
    firstName: "Daenerys",
    age: null,
    email: "daenerys.targaryen@example.com",
  },
  {
    id: 6,
    lastName: "Melisandre",
    firstName: null,
    age: 150,
    email: "melisandre@example.com",
  },
  {
    id: 7,
    lastName: "Clifford",
    firstName: "Ferrara",
    age: 44,
    email: "ferrara.clifford@example.com",
  },
  {
    id: 8,
    lastName: "Frances",
    firstName: "Rossini",
    age: 36,
    email: "rossini.frances@example.com",
  },
  {
    id: 9,
    lastName: "Roxie",
    firstName: "Harvey",
    age: 65,
    email: "harvey.roxie@example.com",
  },
  {
    id: 10,
    lastName: "Doe",
    firstName: "John",
    age: 30,
    email: "john.doe@example.com",
  },
  {
    id: 11,
    lastName: "Smith",
    firstName: "Jane",
    age: 25,
    email: "jane.smith@example.com",
  },
  {
    id: 12,
    lastName: "Johnson",
    firstName: "Michael",
    age: 40,
    email: "michael.johnson@example.com",
  },
  {
    id: 13,
    lastName: "Williams",
    firstName: "Emily",
    age: 28,
    email: "emily.williams@example.com",
  },
  {
    id: 14,
    lastName: "Brown",
    firstName: "David",
    age: 35,
    email: "david.brown@example.com",
  },
  {
    id: 15,
    lastName: "Jones",
    firstName: "Emma",
    age: 22,
    email: "emma.jones@example.com",
  },
];

// AddNewModal component for adding/editing a user
function AddNewModal({ open, onClose, initialValues }) {
  const handleClose = () => {
    onClose();
  };

  // Form validation schema using Yup
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    age: Yup.number()
      .typeError("Age must be a number")
      .positive("Age must be a positive number")
      .integer("Age must be an integer")
      .required("Age is required"),
  });

  // Form submission handler
  const handleSubmit = async (values, actions) => {
    try {
      if (values.id) {
        // If id exists, it's an update operation
        await updateUser(values.id, values);
        toast.success("Record updated successfully!");
      } else {
        // If id doesn't exist, it's an add operation
        await userAdd(values);
        toast.success("New record added successfully!");
      }

      console.log(values); // Log form values
      actions.setSubmitting(false); // Reset form submission state
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error:", error); // Log error
      toast.error("Failed to add/update record. Please try again."); // Show error toast
      actions.setSubmitting(false); // Reset form submission state
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 3,
          minWidth: 300,
        }}
      >
        <Typography variant="h6" align="left" gutterBottom>
          {initialValues.id ? "Edit" : "Add New"}{" "}
          {/* Display modal title based on whether it's an add or edit operation */}
        </Typography>
        {/* Formik form for user input */}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {(formik) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    name="firstName"
                    label="First Name"
                    fullWidth
                    variant="outlined"
                    {...formik.getFieldProps("firstName")}
                    error={Boolean(
                      formik.touched.firstName && formik.errors.firstName
                    )}
                    helperText={
                      formik.touched.firstName && formik.errors.firstName
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="lastName"
                    label="Last Name"
                    fullWidth
                    variant="outlined"
                    {...formik.getFieldProps("lastName")}
                    error={Boolean(
                      formik.touched.lastName && formik.errors.lastName
                    )}
                    helperText={
                      formik.touched.lastName && formik.errors.lastName
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="email"
                    label="Email"
                    fullWidth
                    variant="outlined"
                    {...formik.getFieldProps("email")}
                    error={Boolean(formik.touched.email && formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="age"
                    label="Age"
                    fullWidth
                    variant="outlined"
                    type="number"
                    {...formik.getFieldProps("age")}
                    error={Boolean(formik.touched.age && formik.errors.age)}
                    helperText={formik.touched.age && formik.errors.age}
                  />
                </Grid>
              </Grid>

              {/* Submit and Cancel buttons */}
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Button size="small" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  size="small"
                  disabled={formik.isSubmitting}
                  sx={{ ml: 2 }}
                >
                  Submit
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
}

// HomePage component
function HomePage() {
  const [open, setOpen] = useState(false); // State for modal open/close
  const [users, setUsers] = useState([]); // State to hold user data
  const [selectedRow, setSelectedRow] = useState(null); // State for selected row data

  useEffect(() => {
    // Fetch user data when component mounts
    fetchUserData();
  }, []);

  // Function to fetch user data
  const fetchUserData = async () => {
    try {
      const userData = await getUser(); // Fetch user data from the server
      setUsers(userData); // Set user data in state
    } catch (error) {
      // Show error toast if fetching fails
      console.log("Failed to fetch user data");
    }
  };

  // Function to open modal for adding/editing user
  const handleOpenModal = (row) => {
    setSelectedRow(row); // Set selected row data
    setOpen(true); // Open modal
  };

  // Function to close modal
  const handleCloseModal = () => {
    setOpen(false); // Close modal
    setSelectedRow(null); // Reset selected row data
  };

  // Function to handle Add New button click
  const handleAddNew = () => {
    setSelectedRow(null); // Clear any selected row
    setOpen(true); // Open modal
  };

  // Function to handle delete button click
  const handleDelete = async (row) => {
    try {
      // Show confirmation dialog before proceeding with deletion
      const confirmed = window.confirm(
        "Are you sure you want to delete this user?"
      );
      if (!confirmed) {
        return; // If user cancels, do nothing
      }

      // Call deleteUser function with userId to delete the user
      await deleteUser(row.id);
      // Show success toast
      toast.success("User deleted successfully");
      // You may want to update your data source after deletion
      // For example, if you have a list of users, you can filter out the deleted user
    } catch (error) {
      // Show error toast if deletion fails
      toast.error("Failed to delete user");
    }
  };

  // Columns definition for DataGrid
  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    {
      field: "firstName",
      headerName: "First name",
      width: 150,
      editable: true,
    },
    {
      field: "lastName",
      headerName: "Last name",
      width: 150,
      editable: true,
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
      editable: true,
    },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      width: 100,
      editable: true,
    },
    {
      field: "action",
      headerName: "Action",
      width: 110,
      renderCell: (params) => (
        <div>
          <IconButton
            aria-label="edit"
            onClick={() => handleOpenModal(params.row)} // Open modal for editing on button click
          >
            <EditIcon />
          </IconButton>{" "}
          <IconButton
            aria-label="delete"
            onClick={() => handleDelete(params.row)} // Delete user on button click
          >
            <DeleteIcon />
          </IconButton>{" "}
        </div>
      ),
    },
  ];

  return (
    <div className="App">
      <Container maxWidth="md" sx={{ mt: 5 }}>
        <Box sx={{ height: 400, width: "100%" }}>
          {/* Add New button */}
          <Box
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "10px",
            }}
          >
            <Button variant="contained" onClick={handleAddNew}>
              Add New
            </Button>
          </Box>
          {/* DataGrid for displaying users */}
          <DataGrid
            rows={rows || users}
            columns={columns}
            initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
            pageSizeOptions={[5, 10, 15, 20]}
            checkboxSelection
            disableRowSelectionOnClick
          />
          {/* Modal for adding/editing user */}
          <AddNewModal
            open={open}
            onClose={handleCloseModal}
            initialValues={
              selectedRow || { firstName: "", lastName: "", email: "", age: "" }
            } // Initial values for form
          />
          <ToastContainer /> {/* Container for displaying toasts */}
        </Box>
      </Container>
    </div>
  );
}

export default HomePage;
