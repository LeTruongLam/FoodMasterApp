import React, { useEffect, useState } from "react";
import { useData } from "../../context/AppContext";

import TextField from "@mui/material/TextField";
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import { Avatar, Input, message } from "antd";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { BACK_END_URL } from "../../context/const";
import "./congthuc.css";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";

const { Option } = Select;
const { TextArea } = Input;

const EditRecipe = ({
  recipeId,
  material,
  fetchCongThucEdit,
  isOpen,
  isClose,
}) => {
  const { user, monDo, fetchMonDo } = useData();
  const [recipeName, setRecipeName] = useState("");
  const [recipeDesc, setRecipeDesc] = useState("");
  const [materialsWithImages, setMaterialsWithImages] = useState([]);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [isEditingMaterial, setIsEditingMaterial] = useState(false);
  const [personName, setPersonName] = React.useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  const handleIconNameClick = () => {
    setIsEditingName(!isEditingName);
  };

  const handleCancelNameClick = () => {
    setIsEditingName(false);
  };
  const handleIconDescClick = () => {
    setIsEditingDesc(!isEditingDesc);
  };

  const handleCancelDescClick = () => {
    setIsEditingDesc(false);
  };
  const handleIconMaterialClick = () => {
    setIsEditingMaterial(!isEditingMaterial);
  };

  const handleCancelMaterialClick = () => {
    setIsEditingMaterial(false);
  };
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${BACK_END_URL}recipe/material/${id}`, {
        method: "DELETE",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
      });

      if (!response.ok) {
        throw new Error("Something went wrong during the delete operation.");
      }
      message.success("Nguyên liệu đã được xóa thành công");
      fetchCongThucEdit();
      fetchCongThuc(recipeId);
      // Xử lý dữ liệu trả về (nếu cần)
    } catch (error) {
      message.error(error.message);
    }
  };
  const fetchCongThuc = async (key) => {
    await fetch(`${BACK_END_URL}recipe/material/${key}`, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
    })
      .then((response) => response.json())
      .then((data) => {
        setRecipeName(data.recipeName);
        setRecipeDesc(data.recipeDesc);
        setMaterialsWithImages(data.materialsWithImages);
      })
      .catch((error) => {
        message.error(error.message);
      });
  };
  useEffect(() => {
    fetchCongThuc(recipeId);
  }, [recipeId]);
  const handleSaveNameClick = async () => {
    try {
      const response = await fetch(`${BACK_END_URL}recipe/name/${recipeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newName: recipeName,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update recipe name");
      }

      // Xử lý phản hồi thành công (nếu cần)
    } catch (error) {
      message.error(error.message);
    }

    setIsEditingName(false);
    fetchCongThuc(recipeId);
  };
  const handleSaveDescClick = async () => {
    try {
      const response = await fetch(`${BACK_END_URL}recipe/desc/${recipeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newDesc: recipeDesc,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update recipe name");
      }
      message.success("Mô tả công thức đã được sửa thành công");

    } catch (error) {
      message.error(error.message);
    }
    fetchCongThucEdit();
    setIsEditingDesc(false);
    fetchCongThuc(recipeId);
  };
  const handleSaveMaterialClick = async (personName) => {
    const materialIds = materialsWithImages.map((item) => Number(item.id));
    // Loại bỏ các phần tử trùng lặp giữa personName và materialIds
    const uniquePersonName = personName.filter(
      (value) => !materialIds.includes(value)
    );

    try {
      const response = await fetch(
        `${BACK_END_URL}recipe/material/${recipeId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idMaterial: uniquePersonName,
          }),
        }
      );
      fetchCongThucEdit();
      setIsEditingMaterial(false);
      fetchCongThuc(recipeId);
      if (!response.ok) {
        throw new Error("Failed to update recipe ");
      }
    } catch (error) {
      message.error(error.message);
    }
  };
  const handleClose = () => {
    isClose();
    fetchMonDo();
  };

  return (
    <div>
      <Dialog fullWidth sx={{ m: 1 }} open={isOpen} onClose={handleClose}>
        <div className="form-wrapper scroll">
          <DialogTitle
            style={{ display: "flex", alignItems: "center", padding: 0 }}
          >
            Sửa công thức món ăn
            <Button style={{ marginLeft: "auto", justifyContent: "flex-end" }}>
              <CloseIcon onClick={handleClose} />
            </Button>
          </DialogTitle>
          <div className="course-title">
            <div className="course-title-wrapper">
              <div className="course-title-header">
                <p>Tên công thức</p>
                {!isEditingName ? (
                  <div
                    onClick={handleIconNameClick}
                    className="course-title-action"
                  >
                    <EditIcon fontSize="small" />
                    <span>Sửa</span>
                  </div>
                ) : (
                  <div
                    onClick={handleCancelNameClick}
                    className="course-title-action"
                  >
                    <span>Cancel</span>
                  </div>
                )}
              </div>
              <div className="course-title-body">
                {!isEditingName ? (
                  <div>{recipeName}</div>
                ) : (
                  <div className="grid">
                    <TextField
                      value={recipeName}
                      className="bg-main"
                      onChange={(e) => setRecipeName(e.target.value)}
                    />
                    <Button
                      sx={{ color: "white", backgroundColor: "black" }}
                      style={{
                        marginTop: "12px",
                        width: "max-content",
                      }}
                      variant="contained"
                      onClick={handleSaveNameClick}
                    >
                      Lưu
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="course-title">
            <div className="course-title-wrapper">
              <div className="course-title-header">
                <p>Mô tả công thức</p>
                {!isEditingDesc ? (
                  <div
                    onClick={handleIconDescClick}
                    className="course-title-action"
                  >
                    <EditIcon fontSize="small" />
                    <span>Sửa</span>
                  </div>
                ) : (
                  <div
                    onClick={handleCancelDescClick}
                    className="course-title-action"
                  >
                    <span>Hủy</span>
                  </div>
                )}
              </div>
              <div className="course-title-body">
                {!isEditingDesc ? (
                  <div>{recipeDesc}</div>
                ) : (
                  <div className="grid">
                    <TextField
                      value={recipeDesc}
                      className="bg-main"
                      onChange={(e) => setRecipeDesc(e.target.value)}
                    />
                    <Button
                      sx={{ color: "white", backgroundColor: "black" }}
                      style={{
                        marginTop: "12px",
                        width: "max-content",
                      }}
                      variant="contained"
                      onClick={handleSaveDescClick}
                    >
                      Lưu
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="course-title">
            <div className="course-title-wrapper">
              <div className="course-title-header">
                <p>Nguyên liệu</p>
                {!isEditingMaterial ? (
                  <div
                    onClick={handleIconMaterialClick}
                    className="course-title-action"
                  >
                    <EditIcon fontSize="small" />
                    <span>Thêm nguyên liệu</span>
                  </div>
                ) : (
                  <div
                    onClick={handleCancelMaterialClick}
                    className="course-title-action"
                  >
                    <span>Hủy</span>
                  </div>
                )}
              </div>
              <div className="course-title-body">
                {!isEditingMaterial ? (
                  <>
                    {material.map((item) => (
                      <div
                        key={item.id}
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <Avatar
                          src={item.image}
                          style={{ marginBottom: "10px" }}
                        />
                        <span>{item.material}</span>
                        <IconButton onClick={() => handleDelete(item.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </div>
                    ))}
                  </>
                ) : (
                  <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        multiple
                        value={personName}
                        onChange={handleChange}
                        renderValue={(selected) =>
                          selected.map((value) => (
                            <Chip
                              key={value}
                              label={
                                monDo.find((item) => item.id === value).name
                              }
                              avatar={
                                <Avatar
                                  src={
                                    monDo.find((item) => item.id === value)
                                      .image
                                  }
                                />
                              }
                            />
                          ))
                        }
                      >
                        {monDo.map((item) => (
                          <MenuItem key={item.id} value={item.id}>
                            <Avatar
                              src={item.image}
                              style={{ marginBottom: "10px" }}
                            />
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Button
                      sx={{ color: "white", backgroundColor: "black" }}
                      style={{
                        marginTop: "12px",
                        width: "max-content",
                      }}
                      variant="contained"
                      onClick={() => {
                        handleSaveMaterialClick(personName);
                      }}
                    >
                      Save
                    </Button>
                  </Box>
                )}
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default EditRecipe;
