import React, { useEffect } from "react";
import {
  Image,
  Tag,
  Row,
  Col,
  Card,
  Space,
  Table,
  Button,
  Avatar,
  message,
} from "antd";
import { useData } from "../../context/AppContext";
import moment from "moment";
import { BACK_END_URL } from "../../context/const";

const Kho = () => {
  const { kho, user, fetchKho } = useData();
  useEffect(() => {
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
      title: "Ngày hết hạn",
      dataIndex: "expire",
      key: "expire",
      render: (item) => {
        const expireDate = moment(item).add(1, "day");
        if (expireDate.diff(moment(), "days") < 3) {
          if (expireDate.diff(moment(), "days") < 0) {
            return (
              <>
                <Tag color="yellow">
                  {"Hết hạn " + expireDate.diff(moment(), "days") + " ngày"}
                </Tag>
                💀

              </>
            );
          }
          return (
            <>
              <Tag color="red">
                {"Còn " + expireDate.diff(moment(), "days") + " ngày"}
              </Tag>
              🔥
            </>
          );
        }
        return "Còn " + expireDate.diff(moment(), "days") + " ngày";
      },
      sorter: (a, b) => moment(b.expire) - moment(a.expire),
    },
    {
      title: "Thao tác",
      render: (text, record) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Button
            size="small"
            onClick={() => handleDelete(record.id)}
            style={{ marginLeft: 5 }}
            type="danger"
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${BACK_END_URL}store/delete/${id}`);
      const data = await res.json();
      if (data.success === true) {
        fetchKho(user[0]?.id);
        message.success("Xóa thành công");
      }
    } catch (error) {
      message.warning("Thất bại", error.message);
    }
  };

  return (
    <div className="tabled">
      <Row gutter={[24, 0]}>
        <Col xs="24" xl={24}>
          <Card
            bordered={false}
            className="criclebox tablespace mb-24"
            title="Danh sách món đồ trong kho"
            extra={
              <Space>
                <Space>
                  {/* <Button type="primary" onClick={() => {}}>Thêm</Button> */}
                </Space>
              </Space>
            }
          >
            <Table
              pagination={false}
              columns={columns}
              dataSource={kho}
              className="ant-border-space"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Kho;
