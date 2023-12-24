import React, { useEffect, useState } from "react";
import { useData } from "../../context/AppContext";
import { SearchOutlined } from "@ant-design/icons";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Row,
  Col,
  Card,
  Space,
  Table,
  Button,
  Avatar,
  Modal,
  Select,
  Input,
  InputNumber,
  Form,
  message,
} from "antd";
import ViewRecipe from "./ViewRecipe";

import "./congthuc.css";
import { BACK_END_URL } from "../../context/const";
import EditRecipe from "./EditRecipe";
const { Option } = Select;
const { TextArea } = Input;
const CongThuc = () => {
  const { user, monDo, fetchMonDo } = useData();
  const [congThuc, setCongThuc] = useState([]);
  const [type, setType] = useState("chung");
  const [searchTerm, setSearchTerm] = useState("");
  const [recipeId, setRecipeId] = useState();
  const [recipeIdView, setRecipeIdView] = useState();
  const [openForm, setOpenForm] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [material, setMaterial] = useState([]);
  const onShowForm = () => {
    setOpenForm(true);
  };
  const onCloseForm = () => {
    setOpenForm(false);
  };
  const onShowView = () => {
    setOpenView(true);
  };
  const onCloseView = () => {
    setOpenView(false);
  };
  const fetchCongThuc = async () => {
    try {
      const options = {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
      };
      let url = `${BACK_END_URL}recipe`;
      if (type === "rieng") {
        // Nếu lựa chọn là "rieng", sử dụng API khác
        url = `${BACK_END_URL}recipe/${user[0]?.id}`;
      }
      const res = await fetch(url, options);
      if (!res.ok) {
        throw new Error("Failed to fetch recipes");
      }
      const data = await res.json();
      setCongThuc(data.results);
    } catch (error) {
      console.log(error.message);
      message.error(error.message);
    }
  };

  useEffect(() => {
    fetchCongThuc();
    fetchMonDo();
  }, [type]);
  const handleTypeChange = (selectedType) => {
    setType(selectedType);
  };
  const handleSearch = async () => {
    try {
      const options = {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ searchTerm }),
      };
      const url = `${BACK_END_URL}recipe/search`;
      const res = await fetch(url, options);
      if (!res.ok) {
        throw new Error("Failed to fetch recipes");
      }
      const data = await res.json();

      setCongThuc(data.results);
    } catch (error) {
      console.log(error.message);
      message.error(error.message);
    }
    console.log("Search term:", searchTerm);
  };

  const handleChangeSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  const thucPham = monDo.filter((item) => item.type === 0);

  const [modalVisible, setModalVisible] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    desc: "",
    food: "",
    materials: "",
  });
  const [materialValues, setMaterialValues] = useState([]);

  const handleOk = async () => {
    // Handle submit form here
    const values = {};
    try {
      values.name = formValues.name;
      values.desc = formValues.desc;
      values.idUser = user[0]?.id;
      values.idFood = formValues.food;
      values.materials = materialValues;
      const res = await fetch(`${BACK_END_URL}recipe/add`, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (data.success === true) {
        await fetchCongThuc(user[0]?.id);
        message.success("Tạo thành công!");
        setModalVisible(false);

        setFormValues({
          name: "",
          desc: "",
          food: "",
          materials: [],
        });
        setMaterialValues([]);
      }
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleFoodChange = (value) => {
    setFormValues({ ...formValues, food: value });
  };

  const handleMaterialChange = (value, index) => {
    const newMaterialValues = [...materialValues];
    newMaterialValues[index] = { ...newMaterialValues[index], id: value };
    setMaterialValues(newMaterialValues);
  };

  const handleQuantityChange = (value, index) => {
    const newMaterialValues = [...materialValues];
    newMaterialValues[index] = { ...newMaterialValues[index], quantity: value };
    setMaterialValues(newMaterialValues);
  };

  const handleAddMaterial = () => {
    setMaterialValues([...materialValues, { quantity: 0 }]);
  };

  const handleRemoveMaterial = (index) => {
    const newMaterialValues = [...materialValues];
    newMaterialValues.splice(index, 1);
    setMaterialValues(newMaterialValues);
  };

  const columns = [
    {
      title: "Tên công thức",
      dataIndex: "recipeName",
      key: "recipeName",
      width: "20%",
    },
    {
      title: "Mô tả",
      dataIndex: "recipeDesc",
      key: "recipeDesc",
      width: "50%",
      ellipsis: true,
    },
    {
      title: "Nguyên liệu",
      dataIndex: "foodNames",
      key: "foodNames",
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      key: "action",
    },
  ];

  const data = congThuc.map((item) => {
    const isRieng = type === "rieng";
    const action = isRieng ? (
      <Space>
        <Button type="primary" onClick={() => handleEdit(item.idRecipe)}>
          Sửa
        </Button>
        <Button type="danger" onClick={() => handleDelete(item.idRecipe)}>
          Xóa
        </Button>
      </Space>
    ) : (
      <Space>
        <Button
          type="primary"
          onClick={() => {
            handleView(item.idRecipe);
          }}
        >
          Xem
        </Button>
      </Space>
    );
    return {
      key: item.idRecipe,
      recipeName: item.recipeName,
      recipeDesc: item.recipeDesc,
      foodNames: item.foodNames,
      action: action,
    };
  });
  const handleEdit = (key) => {
    setRecipeId(key);
    onShowForm();
    fetch(`${BACK_END_URL}recipe/material/${key}`, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
    })
      .then((response) => response.json())
      .then((data) => {
        setMaterial(data.materialsWithImages);
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        message.error(error.message);
      });
  };

  const handleView = (idRecipe) => {
    setRecipeIdView(idRecipe);
    onShowView();
    fetch(`${BACK_END_URL}recipe/material/${idRecipe}`, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
    })
      .then((response) => response.json())
      .then((data) => {
        setMaterial(data.materialsWithImages);
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        message.error(error.message);
      });
  };

  const handleDelete = (key) => {
    // Xử lý logic khi người dùng nhấp vào nút xóa
    // Ví dụ: Gửi yêu cầu xóa công thức với khóa là 'key' đến server
    fetch(`${BACK_END_URL}recipe/${key}`, {
      method: "DELETE",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        fetchCongThuc();
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        message.error(error.message);
      });
  };
  return (
    <div>
      <Row gutter={[24, 0]}>
        <Col xs={24} xl={24}>
          <Card
            bordered={false}
            className="criclebox tablespace mb-24"
            title="Danh sách các công thức"
            extra={
              <Space>
                <Input
                  placeholder="Nhập nguyên liệu tìm kiếm"
                  style={{ width: "300px" }}
                  suffix={<SearchOutlined />}
                  value={searchTerm}
                  onChange={handleChangeSearch}
                  onPressEnter={handleSearch}
                />
                <Space>
                  <Button type="primary" onClick={() => setModalVisible(true)}>
                    Thêm
                  </Button>
                </Space>
              </Space>
            }
          >
            <Space style={{ margin: "20px" }}>
              <Button
                type={type === "chung" ? "primary" : "default"}
                onClick={() => handleTypeChange("chung")}
              >
                Công thức chung
              </Button>
              <Button
                type={type === "rieng" ? "primary" : "default"}
                onClick={() => handleTypeChange("rieng")}
              >
                Công thức của tôi
              </Button>
            </Space>

            <div className="tabled" style={{ height: "100%" }}>
              <Table columns={columns} dataSource={data} />
            </div>
          </Card>
        </Col>

        <Modal
          visible={modalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          closable={false}
        >
          <Form>
            <Form.Item label="Tên công thức">
              <Input
                name="name"
                value={formValues.name}
                onChange={handleChange}
              />
            </Form.Item>
            <Form.Item label="Mô tả">
              <TextArea
                name="desc"
                value={formValues.desc}
                onChange={handleChange}
              />
            </Form.Item>
            <Form.Item label="Nguyên liệu">
              {materialValues.map((material, index) => (
                <Row key={index} gutter={8} align="middle">
                  <Col span={16}>
                    <Select
                      value={material.id}
                      onChange={(value) => handleMaterialChange(value, index)}
                    >
                      {thucPham.map((item) => (
                        <Option key={item.id} value={item.id}>
                          <Avatar src={item.image} />
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                  </Col>
                  {/* <Col span={6}>
                    <InputNumber
                      value={material.quantity}
                      onChange={(value) => handleQuantityChange(value, index)}
                    />
                  </Col> */}
                  <Col span={2}>
                    <div
                      className="btn-delete"
                      onClick={() => {
                        handleRemoveMaterial(index);
                      }}
                    >
                      <DeleteOutlined />
                    </div>
                  </Col>
                </Row>
              ))}
              <div
                className="btn-add"
                onClick={() => {
                  handleAddMaterial();
                }}
              >
                <PlusOutlined />
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </Row>
      {openForm && (
        <EditRecipe
          isOpen={openForm}
          isClose={onCloseForm}
          recipeId={recipeId}
          material={material}
          fetchCongThucEdit={fetchCongThuc}
        ></EditRecipe>
      )}
      {openView && (
        <ViewRecipe
          isOpenView={openView}
          isCloseView={onCloseView}
          recipeIdView={recipeIdView}
          material={material}
        ></ViewRecipe>
      )}
    </div>
  );
};

export default CongThuc;
