const connection = require("../db");

module.exports = {
  getAll: async (req, res) => {
    try {
      const idUser = req.params.userId;

      const results = await new Promise((resolve, reject) => {
        connection.query(
          `
              SELECT recipe_food.idRecipe , recipe_food.id_recipe_food, recipe.name AS recipeName, recipe.desc AS recipeDesc, GROUP_CONCAT(food.name) AS foodNames
              FROM recipe_food
              JOIN recipe ON recipe_food.idRecipe = recipe.id
              JOIN food ON recipe_food.idFood = food.id
              GROUP BY recipe_food.idRecipe
              `,
          (error, results, fields) => {
            if (error) {
              console.error("Error get food: ", error);
              reject(error);
            } else {
              resolve(results);
            }
          }
        );
      });
      return res.json({ success: true, results });
    } catch (error) {
      console.error("Error get food: ", error);
      return res
        .status(500)
        .json({ success: false, error: "Internal Server Error" });
    }
  },
  getByUser: async (req, res) => {
    try {
      const idUser = req.params.userId;

      const results = await new Promise((resolve, reject) => {
        connection.query(
          `
              SELECT recipe_food.idRecipe ,  recipe_food.id_recipe_food, recipe.name AS recipeName, recipe.desc AS recipeDesc, GROUP_CONCAT(food.name) AS foodNames
              FROM recipe_food
              JOIN recipe ON recipe_food.idRecipe = recipe.id
              JOIN food ON recipe_food.idFood = food.id
              WHERE recipe.idUser = ?
              GROUP BY recipe_food.idRecipe
              `,
          [idUser],
          (error, results, fields) => {
            if (error) {
              console.error("Error get food: ", error);
              reject(error);
            } else {
              resolve(results);
            }
          }
        );
      });
      return res.json({ success: true, results });
    } catch (error) {
      console.error("Error get food: ", error);
      return res
        .status(500)
        .json({ success: false, error: "Internal Server Error" });
    }
  },

  deleteRecipe: async (req, res) => {
    try {
      const idRecipe = req.params.idRecipe;

      const results = await new Promise((resolve, reject) => {
        connection.query(
          `
          DELETE FROM recipe WHERE id = ?
          `,
          [idRecipe],
          (error, results, fields) => {
            if (error) {
              console.error("Error deleting recipe: ", error);
              reject(error);
            } else {
              resolve(results);
            }
          }
        );
      });

      return res.json({ success: true });
    } catch (error) {
      console.error("Error deleting recipe: ", error);
      return res
        .status(500)
        .json({ success: false, error: "Internal Server Error" });
    }
  },
  getRecipe: async (req, res) => {
    try {
      const idRecipe = req.params.idRecipe;
      const results = await new Promise((resolve, reject) => {
        connection.query(
          `
          SELECT   recipe.name AS recipeName, recipe.desc AS recipeDesc,GROUP_CONCAT(recipe_food.id_recipe_food) AS id_recipe_food, GROUP_CONCAT(food.name) AS materials, GROUP_CONCAT(food.image) AS images
          FROM recipe_food
          JOIN food ON recipe_food.idFood = food.id
          JOIN recipe ON recipe_food.idRecipe = recipe.id
          WHERE recipe_food.idRecipe = ?
          GROUP BY recipe_food.idRecipe
          `,
          [idRecipe],
          (error, results, fields) => {
            if (error) {
              console.error("Error retrieving recipe: ", error);
              reject(error);
            } else {
              resolve(results);
            }
          }
        );
      });

      if (results.length === 0) {
        return res
          .status(404)
          .json({ success: false, error: "Recipe not found" });
      }

      const { recipeName, recipeDesc, materials, images, id_recipe_food } =
        results[0];

      // Tạo mảng đối tượng chứa thông tin materials và images
      const materialsWithImages = materials
        .split(",")
        .map((material, index) => ({
          material,
          image: images.split(",")[index],
          id: id_recipe_food.split(",")[index],
        }));

      return res.json({
        success: true,
        recipeName,
        recipeDesc,
        materialsWithImages,
      });
    } catch (error) {
      console.error("Error retrieving recipe: ", error);
      return res
        .status(500)
        .json({ success: false, error: "Internal Server Error" });
    }
  },

  editNameRecipe: async (req, res) => {
    try {
      const idRecipe = req.params.idRecipe;
      const { newName } = req.body; // Giả sử tên mới được gửi từ client qua body request

      const results = await new Promise((resolve, reject) => {
        connection.query(
          `
          UPDATE recipe SET name = ? WHERE id = ?
          `,
          [newName, idRecipe],
          (error, results, fields) => {
            if (error) {
              console.error("Error editing recipe name: ", error);
              reject(error);
            } else {
              resolve(results);
            }
          }
        );
      });

      return res.json({ success: true });
    } catch (error) {
      console.error("Error editing recipe: ", error);
      return res
        .status(500)
        .json({ success: false, error: "Internal Server Error" });
    }
  },
  editDescRecipe: async (req, res) => {
    try {
      const idRecipe = req.params.idRecipe;
      const { newDesc } = req.body; // Giả sử tên mới được gửi từ client qua body request

      const results = await new Promise((resolve, reject) => {
        connection.query(
          `
          UPDATE recipe SET \`desc\` = ? WHERE id = ?
          `,
          [newDesc, idRecipe],
          (error, results, fields) => {
            if (error) {
              console.error("Error editing recipe desc: ", error);
              reject(error);
            } else {
              resolve(results);
            }
          }
        );
      });

      return res.json({ success: true });
    } catch (error) {
      console.error("Error editing recipe: ", error);
      return res
        .status(500)
        .json({ success: false, error: "Internal Server Error" });
    }
  },

  searchRecipe: async (req, res) => {
    try {
      const searchTerm = req.body.searchTerm;

      const results = await new Promise((resolve, reject) => {
        connection.query(
          `
          SELECT recipe_food.id_recipe_food, recipe.name AS recipeName, recipe.desc AS recipeDesc, GROUP_CONCAT(food.name) AS foodNames
          FROM recipe_food
          JOIN recipe ON recipe_food.idRecipe = recipe.id
          JOIN food ON recipe_food.idFood = food.id
          WHERE recipe.name LIKE ? OR recipe.desc LIKE ? OR food.name LIKE ?
          GROUP BY recipe_food.idRecipe
          `,
          [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`],
          (error, results, fields) => {
            if (error) {
              console.error("Error searching recipes: ", error);
              reject(error);
            } else {
              resolve(results);
            }
          }
        );
      });

      return res.json({ success: true, results });
    } catch (error) {
      console.error("Error searching recipes: ", error);
      return res
        .status(500)
        .json({ success: false, error: "Internal Server Error" });
    }
  },
  add: async (req, res) => {
    const { name, desc, idUser, idFood, materials } = req.body;

    try {
      const recipeQuery = `INSERT INTO recipe (name, \`desc\`,  idUser) VALUES (?, ?, ?)`;
      const selectQuery = `
                SELECT MAX(ID) as id FROM recipe;
            `;
      const recipe = await new Promise((resolve, reject) => {
        connection.query(
          recipeQuery,
          [name, desc, idUser],
          (error, results, fields) => {
            if (error) {
              console.error(`Error inserting recipe: `, error);
              reject(error);
            } else {
              resolve(results);
            }
          }
        );
      });
      let recipeIdIs;
      const recipeId = await new Promise((resolve, reject) => {
        connection.query(selectQuery, (error, results, fields) => {
          if (error) {
            console.error(`Error get recipe id: `, error);
            reject(error);
          } else {
            recipeIdIs = results[0].id;
            resolve(results[0].id);
          }
        });
      });

      const recipeMaterialQuery = `INSERT INTO recipe_food ( idRecipe, idFood, count) VALUES (?, ?, ?)`;
      for (let i = 0; i < materials.length; ++i) {
        await new Promise((resolve, reject) => {
          connection.query(
            recipeMaterialQuery,
            [recipeIdIs, materials[i].id, materials[i].quantity],
            (error, results, fields) => {
              if (error) {
                console.error(`Error insert recipe material: `, error);
                reject(error);
              } else {
                resolve(results);
              }
            }
          );
        });
      }

      return res.json({ success: true });
    } catch (error) {
      console.error("Error", error.message);
      return res.json({ success: false, message: "Error" });
    }
  },
  addMaterialRecipe: async (req, res) => {
    try {
      const idRecipe = req.params.idRecipe;
      const { idMaterial } = req.body;
      // Thêm từng phần tử trong mảng idMaterial vào công thức
      for (const materialId of idMaterial) {
        const results = await new Promise((resolve, reject) => {
          connection.query(
            `
            INSERT INTO recipe_food (idFood, idRecipe) VALUES (?, ?)
            `,
            [materialId, idRecipe],
            (error, results, fields) => {
              if (error) {
                console.error("Error editing recipe name: ", error);
                reject(error);
              } else {
                resolve(results);
              }
            }
          );
        });
      }

      return res.json({ success: true });
    } catch (error) {
      console.error("Error editing recipe: ", error);
      return res
        .status(500)
        .json({ success: false, error: "Internal Server Error" });
    }
  },
  deleteMaterialRecipe: async (req, res) => {
    try {
      const recipeFoodId = req.params.recipeFoodId;

      const results = await new Promise((resolve, reject) => {
        connection.query(
          `
          DELETE FROM recipe_food WHERE id_recipe_food = ?
          `,
          [recipeFoodId],
          (error, results, fields) => {
            if (error) {
              console.error("Error deleting recipe: ", error);
              reject(error);
            } else {
              resolve(results);
            }
          }
        );
      });
      console.log("Xóa thành công");
      console.log(recipeFoodId);
      return res.json({ success: true });
    } catch (error) {
      console.error("Error deleting recipe: ", error);
      return res
        .status(500)
        .json({ success: false, error: "Internal Server Error" });
    }
  },
};
