import React, { useEffect, useState } from "react";
import { useData } from "../../context/AppContext";

import Button from "@mui/material/Button";
import { message } from "antd";
import { BACK_END_URL } from "../../context/const";
import "./congthuc.css";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import {
  Avatar,
} from "antd";
const ViewRecipe = ({ recipeIdView, material, isOpenView, isCloseView }) => {
  const { user, monDo, fetchMonDo } = useData();
  const [congThuc, setCongThuc] = useState([]);
  const [recipeName, setRecipeName] = useState("");
  const [recipeDesc, setRecipeDesc] = useState("");
  const [materialsWithImages, setMaterialsWithImages] = useState([]);

  const fetchCongThuc = (recipeIdView) => {
    fetch(`${BACK_END_URL}recipe/material/${recipeIdView}`, {
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
    fetchCongThuc(recipeIdView);
  }, [recipeIdView]);

  const handleClose = () => {
    isCloseView();
    fetchMonDo();
  };
  return (
    <div>
      <Dialog fullWidth sx={{ m: 1 }} open={isOpenView} onClose={handleClose}>
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
                <p>Recipe Name</p>
              </div>
              <div className="course-title-body">
                <div>{recipeName}</div>
              </div>
            </div>
          </div>
          <div className="course-title">
            <div className="course-title-wrapper">
              <div className="course-title-header">
                <p>Recipe Desc</p>
              </div>
              <div className="course-title-body">
                <div>{recipeDesc}</div>
              </div>
            </div>
          </div>
          <div className="course-title">
            <div className="course-title-wrapper">
              <div className="course-title-header">
                <p>Recipe Material</p>
              </div>
              <div className="course-title-body">
                {material.map((item, id) => (
                  <div key={item.id} >
                    <Avatar src={item.image} style={{marginBottom: "10px"}} />
                    <span>{item.material}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default ViewRecipe;
