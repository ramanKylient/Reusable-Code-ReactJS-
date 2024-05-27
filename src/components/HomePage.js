import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  Container,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Modal,
  Switch,
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
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  LocalizationProvider,
  DatePicker,
  DateTimePicker,
  TimePicker,
} from "@mui/x-date-pickers";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import the styles
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import dayjs from "dayjs";

// AddNewModal component for adding/editing a user
function AddNewModal({ open, onClose, selectedRow, fetchUserData }) {
  const userId = selectedRow?.id;
  const handleClose = () => {
    onClose();
  };

  const initialValues = {
    fullName: selectedRow?.fullName ?? "",
    email: selectedRow?.email ?? "",
    password: "",
    gender: selectedRow?.gender ?? "",
    contactNo: selectedRow?.contactNo ?? "",
    date: selectedRow?.date ? dayjs(selectedRow.date) : null,
    dateTime: selectedRow?.dateTime ? dayjs(selectedRow.dateTime) : null,
    time: selectedRow?.time ? dayjs(selectedRow.time, "HH:mm:ss") : null,
    address: selectedRow?.address ?? "",
    color: selectedRow?.color ?? "#000000",
    bio: selectedRow?.bio ?? "",
    isActive: selectedRow?.isActive === 1 ? true : false,
  };

  // Form validation schema using Yup
  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required("Full Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    contactNo: Yup.string()
      .matches(/^[0-9]{10}$/, "Invalid Contact No number")
      .required("Contact No number is required"),
    gender: Yup.string().required("Gender is required"),
    address: Yup.string().required("Address is required"),
    color: Yup.string().required("Color is required"),
    date: Yup.string().required("Date is required"),
    dateTime: Yup.string().required("Date Time is required"),
    time: Yup.string().required("Time is required"),
    ...(userId
      ? {}
      : {
          password: Yup.string()
            .required("Password is required")
            .min(8, "Password should be at least 8 characters long")
            .matches(
              /[a-z]/,
              "Password must contain at least one lowercase letter"
            )
            .matches(
              /[A-Z]/,
              "Password must contain at least one uppercase letter"
            )
            .matches(/[0-9]/, "Password must contain at least one number")
            .matches(
              /[!@#$%^&*(),.?":{}|<>]/,
              "Password must contain at least one special character"
            ),
        }),
  });

  // Form submission handler
  const handleSubmit = async (values, actions) => {
    try {
      const updatedValues = {
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        contactNo: values.contactNo,
        gender: values.gender,
        date: dayjs(values.date).format("YYYY-MM-DD"),
        dateTime: dayjs(values.dateTime).format("YYYY-MM-DDTHH:mm:ss"),
        time: dayjs(values.time).format("HH:mm:ss"),
        address: values.address,
        color: values.color,
        bio: values.bio,
        isActive: values.isActive ? 1 : 0,
      };

      if (userId) {
        // If id exists, it's an update operation
        delete updatedValues.password; // Remove password for update operation
        await updateUser(userId, updatedValues);
        toast.success("Record updated successfully!");
      } else {
        // If id doesn't exist, it's an add operation
        await userAdd(updatedValues);
        toast.success("New record added successfully!");
      }

      // console.log(values); // Log form values
      actions.setSubmitting(false); // Reset form submission state
      fetchUserData();
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
          maxHeight: "80vh",
          overflow: "auto",
        }}
      >
        <Typography variant="h6" align="left" gutterBottom>
          {userId ? "Edit" : "Add New"}
        </Typography>
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
                    name="fullName"
                    label="Full Name"
                    fullWidth
                    variant="outlined"
                    {...formik.getFieldProps("fullName")}
                    error={Boolean(
                      formik.touched.fullName && formik.errors.fullName
                    )}
                    helperText={
                      formik.touched.fullName && formik.errors.fullName
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

                {!userId && ( // Show password field only when adding new user
                  <Grid item xs={6}>
                    <TextField
                      name="password"
                      label="Password"
                      fullWidth
                      variant="outlined"
                      type="password"
                      {...formik.getFieldProps("password")}
                      error={Boolean(
                        formik.touched.password && formik.errors.password
                      )}
                      helperText={
                        formik.touched.password && formik.errors.password
                      }
                    />
                  </Grid>
                )}

                <Grid item xs={6}>
                  <TextField
                    name="contactNo"
                    label="Contact No"
                    fullWidth
                    variant="outlined"
                    type="number"
                    {...formik.getFieldProps("contactNo")}
                    error={Boolean(
                      formik.touched.contactNo && formik.errors.contactNo
                    )}
                    helperText={
                      formik.touched.contactNo && formik.errors.contactNo
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Date"
                      value={formik.values.date}
                      onChange={(value) => formik.setFieldValue("date", value)}
                      textField={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          variant="outlined"
                          error={Boolean(
                            formik.touched.date && formik.errors.date
                          )}
                          helperText={formik.touched.date && formik.errors.date}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      label="Date Time"
                      value={formik.values.dateTime}
                      onChange={(value) =>
                        formik.setFieldValue("dateTime", value)
                      }
                      textField={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          variant="outlined"
                          error={Boolean(
                            formik.touched.dateTime && formik.errors.dateTime
                          )}
                          helperText={
                            formik.touched.dateTime && formik.errors.dateTime
                          }
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                      label="Time"
                      value={formik.values.time}
                      onChange={(value) => formik.setFieldValue("time", value)}
                      textField={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          variant="outlined"
                          error={Boolean(
                            formik.touched.time && formik.errors.time
                          )}
                          helperText={formik.touched.time && formik.errors.time}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="gender"
                    label="Gender"
                    fullWidth
                    variant="outlined"
                    select
                    {...formik.getFieldProps("gender")}
                    error={Boolean(
                      formik.touched.gender && formik.errors.gender
                    )}
                    helperText={formik.touched.gender && formik.errors.gender}
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="color"
                    label="Color"
                    fullWidth
                    variant="outlined"
                    type="color"
                    {...formik.getFieldProps("color")}
                    error={Boolean(formik.touched.color && formik.errors.color)}
                    helperText={formik.touched.color && formik.errors.color}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formik.values.isActive}
                        onChange={(event) =>
                          formik.setFieldValue("isActive", event.target.checked)
                        }
                        color="primary"
                      />
                    }
                    label="Active"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="address"
                    label="Address"
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={2}
                    {...formik.getFieldProps("address")}
                    error={Boolean(
                      formik.touched.address && formik.errors.address
                    )}
                    helperText={formik.touched.address && formik.errors.address}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Bio
                  </Typography>
                  <ReactQuill
                    value={formik.values.bio}
                    onChange={(value) => formik.setFieldValue("bio", value)}
                  />
                </Grid>
              </Grid>
              {/* Submit and Cancel buttons */}
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Button onClick={handleClose}>Cancel</Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={formik.isSubmitting}
                  sx={{ ml: 2 }}
                >
                  {userId ? "Update" : "Submit"}
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

  // Function to fetch user data
  const fetchUserData = async () => {
    try {
      const userData = await getUser(); // Fetch user data from the server
      setUsers(userData.data); // Set user data in state
    } catch (error) {
      // Show error toast if fetching fails
      console.log("Failed to fetch user data");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

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
      fetchUserData();
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
      field: "fullName",
      headerName: "Full Name",
    },
    {
      field: "email",
      headerName: "Email",
    },
    {
      field: "contactNo",
      headerName: "Contact No",
      type: "number",
    },
    {
      field: "gender",
      headerName: "Gender",
    },
    {
      field: "date",
      headerName: "Date",
    },
    {
      field: "dateTime",
      headerName: "Date Time",
    },
    {
      field: "time",
      headerName: "Time",
    },
    {
      field: "address",
      headerName: "Address",
    },
    {
      field: "action",
      headerName: "Action",
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
            rows={users}
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
            selectedRow={selectedRow} // Initial values for form
            fetchUserData={fetchUserData}
          />
          <ToastContainer /> {/* Container for displaying toasts */}
        </Box>
      </Container>
    </div>
  );
}

export default HomePage;
