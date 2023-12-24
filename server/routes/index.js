const express = require("express");
const userController = require("../controllers/user.controller");
const groupController = require("../controllers/group.controller");
const foodController = require("../controllers/food.controller");
const recipeController = require("../controllers/recipe.controller");
const memberController = require("../controllers/member.controller");
const marketController = require("../controllers/market.controller");
const storeController = require("../controllers/store.controller");
const cookController = require("../controllers/cook.controller");
const adminController = require("../controllers/admin.controller");
const router = express.Router();

// user
router.get("/user", userController.getAll);
router.post("/login", userController.login);
router.post("/register", userController.register);

// group
router.get("/group/:idUser", groupController.getAll);
router.post("/group/add", groupController.add);
router.get("/group/market-share/:idGroup", groupController.getShareMarket);
router.post("/group/market-share/add", groupController.addShare);

// member
router.post("/member/add", memberController.add);
router.post("/member/delete", memberController.delete);

// food
router.post("/food", foodController.getAll);
router.post("/food/add", foodController.add);
router.get("/food/delete/:idFood", foodController.delete);

// market
router.get("/market/:idUser", marketController.getAll);
router.post("/market/add", marketController.add);
router.post("/market/buy", marketController.buy);

// recipe
router.get("/recipe", recipeController.getAll);
router.get("/recipe/:userId", recipeController.getByUser);
router.delete("/recipe/:idRecipe", recipeController.deleteRecipe);
router.get("/recipe/material/:idRecipe", recipeController.getRecipe);
router.put("/recipe/name/:idRecipe", recipeController.editNameRecipe);
router.put("/recipe/desc/:idRecipe", recipeController.editDescRecipe);
router.post("/recipe/material/:idRecipe", recipeController.addMaterialRecipe);
router.delete(
  "/recipe/material/:recipeFoodId",
  recipeController.deleteMaterialRecipe
);
router.post("/recipe/add", recipeController.add);
router.post("/recipe/search", recipeController.searchRecipe);
// store
router.get("/store/:idUser", storeController.getAll);
router.get("/store/delete/:id", storeController.delete);

// cook
router.get("/cook/:idUser", cookController.getAll);
router.post("/cook/add", cookController.add);
router.get("/cook/delete/:id", cookController.delete);

// admin
router.post("/admin/account/add", adminController.add);
router.get("/admin/account", adminController.getAll);
router.post("/admin/account/update/:id", adminController.update);
router.get("/admin/account/delete/:id", adminController.delete);

module.exports = router;
