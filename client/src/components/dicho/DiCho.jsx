import React, { useEffect, useState } from "react";
import {
  Image,
  Tag,
  Row,
  Col,
  Card,
  Space,
  message,
  Table,
  Button,
  Avatar,
  Input,
  DatePicker,
} from "antd";
import { useData } from "../../context/AppContext";
import moment from "moment";
import ThemDiChoModal from "./ThemDiChoModal";
import MuaDiChoModal from "./MuaDiChoModal";
// import ShareModal from "./ShareModal";

const DiCho = () => {
  const { user, diCho, mondo, fetchDiCho, fetchMonDo, kho, fetchKho } =
    useData();
  const [idFood, setIdFood] = useState();
  const handleIdFood = (idFood) => {
    setIdFood(idFood);
  };
  useEffect(() => {
    fetchDiCho(user[0]?.id);
    fetchMonDo(user[0]?.id);
    fetchKho(user[0]?.id);
  }, []);

  const columns = [
    {
      title: "Món đồ",
      dataIndex: "food",
      key: "food",
      render: (item) => {
        return (
          <Space direction="horizontal">
            <Avatar src={item.image}></Avatar>
            <span>{item.name}</span>
          </Space>
        );
      },
    },
    {
      title: "Loại",
      dataIndex: "food",
      key: "food",
      render: (item) => {
        if (item.type === 0) return <Tag color="purple">Thực phẩm</Tag>;
        return <Tag color="orange">Món ăn</Tag>;
      },
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Ngày  mua",
      dataIndex: "dateToBuy",
      key: "dateToBuy",
      render: (item) => moment(item).format("YYYY-MM-DD"),
    },
    // {
    //   title: "Ngày mua",
    //   dataIndex: "dateBought",
    //   key: "dateBought",
    //   render: (item) =>
    //     item ? (
    //       moment(item).format("YYYY-MM-DD")
    //     ) : (
    //       <Tag color="default">Chưa có</Tag>
    //     ),
    // },
    // {
    //   title: "Trạng thái",
    //   dataIndex: "state",
    //   key: "state",
    //   render: (item) => {
    //     if (item === 0) return <Tag color="orange">Chưa mua</Tag>;
    //     if (item === 1) return <Tag color="green">Đã mua</Tag>;
    //     return "";
    //   },
    // },
    {
      title: "Thao tác",
      render: (text, record) => (
        <div onClick={(e) => e.stopPropagation()}>
          {record.state === 1 ? (
            <Button
              disabled
              onClick={() => handleMua(record.id)}
              size="small"
              style={{ marginRight: 5 }}
              type="primary"
            >
              Mua
            </Button>
          ) : (
            <Button
              onClick={() => handleMua(record.id)}
              size="small"
              style={{ marginRight: 5 }}
              type="primary"
            >
              Mua
            </Button>
          )}
        </div>
      ),
    },
  ];

  const [selectedDate, setSelectedDate] = useState(moment());
  const filteredData = diCho.filter((item) => {
    const itemDate = moment(item.dateToBuy);
    return selectedDate ? itemDate.isSame(selectedDate, "day") : true;
  });

  const [addModalVisible, setAddModalVisible] = useState(false);
  const handleAdd = () => {
    setAddModalVisible(true);
  };

  const [muaModalVisible, setMuaModalVisible] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState(null);
  const handleMua = (idMarket) => {
    console.log("idMarket:");
    console.log(idMarket);
    const foundMarket = kho.find((item) => item.food.id == idFood);

    if (foundMarket) {
      message.error("Thực phẩm này đã có trong tủ lạnh");
    } else {
      setSelectedMarket(idMarket);
      setMuaModalVisible(true);
    }
  };

  return (
    <div className="tabled">
      <Row gutter={[24, 0]}>
        <Col xs="24" xl={24}>
          <Card
            bordered={false}
            className="criclebox tablespace mb-24"
            title={
              <>
                Danh sách các món đồ cần mua{" "}
                <DatePicker
                  value={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                />
              </>
            }
            extra={
              <Space>
                <Space>
                  <Button type="primary" onClick={handleAdd}>
                    Thêm
                  </Button>
                </Space>
              </Space>
            }
          >
            <Table
              pagination={false}
              columns={columns}
              dataSource={filteredData}
              className="ant-border-space"
            />
          </Card>
        </Col>
        {addModalVisible && (
          <ThemDiChoModal
            editModalVisible={addModalVisible}
            setEditModalVisible={setAddModalVisible}
            handleIdFood={handleIdFood}
          />
        )}
        {muaModalVisible && (
          <MuaDiChoModal
            editModalVisible={muaModalVisible}
            setEditModalVisible={setMuaModalVisible}
            selectedMarket={selectedMarket}
          />
        )}
      </Row>
    </div>
  );
};

export default DiCho;
