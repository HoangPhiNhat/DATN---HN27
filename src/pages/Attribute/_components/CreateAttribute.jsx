import {
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  InputNumber,
  Modal,
  Row,
  Select,
  Table,
  Upload,
  message,
} from "antd";
import { useState } from "react";
import { useParams } from "react-router-dom";
import useAttributeMutation from "../../../hooks/Attribute/useAttributeMutation";
import useColorQuery from "../../../hooks/Color/useColorQuery";
import useSizeQuery from "../../../hooks/Size/useSizeQuery";
import {
  deleteFileCloudinary,
  extractPublicId,
  uploadFileCloudinary,
} from "../../../services/cloudinary";

const CreateAttribute = () => {
  const [isPending, setIsPending] = useState(false);
  const [form] = Form.useForm();
  const [publicIds, setPublicIds] = useState([]);
  const [open, setOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const { id } = useParams();
  const { data: sizes } = useSizeQuery("GET_ALL_SIZE");
  const { data: colors } = useColorQuery("GET_ALL_COLOR");

  const { mutate: createAttribute } = useAttributeMutation({
    action: "CREATE",
    onSuccess: (data) => {
      messageApi.success(data.message);
      form.resetFields();
    },
    onError: (error) => {
      messageApi.error(
        `Lỗi khi thêm thuộc tính: ${error.response.data.message}`
      );
      publicIds.map((publicId) => {
        deleteFileCloudinary(publicId);
      });
      setPublicIds([]);
    },
    config: {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  });

  const onFinish = async (values) => {
    try {
      setIsPending(true); // Bắt đầu quá trình, disable modal và hiển thị loading
  
      // Xử lý upload hình ảnh
      const attributesWithImages = await Promise.all(
        values.attributes.map(async (attribute) => {
          if (attribute?.image?.fileList[0]?.thumbUrl) {
            const imageUrl = await uploadFileCloudinary(
              attribute.image.fileList[0].thumbUrl
            );
            const publicId = extractPublicId(imageUrl);
            setPublicIds((prev) => [...prev, publicId]);
  
            return {
              ...attribute,
              image: imageUrl,
            };
          } else {
            return attribute;
          }
        })
      );
  
      const finalData = { productId: id, attributes: attributesWithImages };
  
      // Gọi mutation để tạo attribute
      await createAttribute(finalData);
  
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsPending(false); // Hoàn thành quá trình, kích hoạt lại modal
    }
  };
  

  const columns = (remove, fields) => [
    {
      title: "Hình ảnh",
      dataIndex: "image",
      width: 150,
      render: (_, field) => (
        <Form.Item name={[field.name, "image"]}>
          <Upload
            maxCount={1}
            listType="picture-card"
            beforeUpload={() => false}
            className="avatar-uploader"
          >
            <div>
              <UploadOutlined className="text-2xl" />
              <div className="mt-2">Tải lên</div>
            </div>
          </Upload>
        </Form.Item>
      ),
    },
    {
      title: "Màu sắc",
      dataIndex: "color_id",
      width: 200,
      render: (_, field) => (
        <Form.Item
          name={[field.name, "color_id"]}
          rules={[{ required: true, message: "Vui lòng chọn màu sắc" }]}
        >
          <Select
            showSearch
            placeholder="Chọn màu sắc"
            optionFilterProp="label"
            className="w-full"
            options={colors?.map((color) => ({
              value: color.id,
              label: (
                <div className="flex items-center">
                  <div
                    className="w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: color.hex }}
                  ></div>
                  {color.name}
                </div>
              ),
            }))}
          />
        </Form.Item>
      ),
    },
    {
      title: "Kích thước",
      dataIndex: "size_id",
      width: 200,
      render: (_, field) => (
        <Form.Item
          name={[field.name, "size_id"]}
          rules={[{ required: true, message: "Vui lòng chọn kích thước" }]}
        >
          <Select
            placeholder="Kích thước"
            options={sizes?.map((size) => ({
              value: size.id,
              label: size.name,
            }))}
            className="w-full"
          />
        </Form.Item>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "stock_quantity",
      width: 150,
      render: (_, field) => (
        <Form.Item
          name={[field.name, "stock_quantity"]}
          rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
        >
          <InputNumber
            type="number"
            placeholder="Số lượng"
            min={0}
            className="w-full"
          />
        </Form.Item>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: 100,
      render: (_, field) =>
        fields.length > 1 ? (
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => remove(field.name)}
            className="flex items-center justify-center mb-6"
          >
            Xóa
          </Button>
        ) : null,
    },
  ];

  return (
    <>
      {contextHolder}
      <Button type="primary" onClick={() => setOpen(true)}>
        Thêm thuộc tính
      </Button>
      <Modal
        width={1400}
        open={open}
        title="Thêm thuộc tính"
        okText="Thêm thuộc tính"
        cancelText="Huỷ"
        style={{ top: 0 }}
        okButtonProps={{
          autoFocus: true,
          htmlType: "submit",
          disabled: isPending,
          loading: isPending,
        }}
        onCancel={() => setOpen(false)}
        destroyOnClose
        modalRender={(dom) => (
          <Row gutter={16} className="mt-8">
            <Col span={24}>
              <Form
                layout="vertical"
                form={form}
                name="form_in_modal"
                initialValues={{
                  modifier: "public",
                }}
                clearOnDestroy
                onFinish={(values) => onFinish(values)}
              >
                {dom}
              </Form>
            </Col>
          </Row>
        )}
      >
        <Form.List name="attributes" initialValue={[{}]}>
          {(fields, { add, remove }) => (
            <>
              <Table
                className="mb-4"
                columns={columns(remove, fields)}
                dataSource={fields}
                pagination={false}
                rowKey="key"
                scroll={{ x: "max-content" }}
                bordered
                size="middle"
              />
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                  className="h-12 text-lg"
                >
                  Thêm biến thể mới
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Modal>
    </>
  );
};

export default CreateAttribute;
