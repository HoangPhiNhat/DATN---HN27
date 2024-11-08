import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { Button, Pagination, Popconfirm, Space, Table, message } from "antd";
import { useState } from "react";
import useCategoryMutation from "../../hooks/Category/useCategoryMutation";
import useCategoryQuery from "../../hooks/Category/useCategoryQuery";
import CreateCategory from "./_components/CreateCategory";
import UpdateCategory from "./_components/UpdateCategory";
import Loading from "../../components/base/Loading/Loading";

const Category = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [modalCreateOpen, setModalCreateOpen] = useState(false);
  const [modalUpdateOpen, setModalUpdateOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [pageCategory, setPageCategory] = useState(1);
  const [deletingCategoryId, setDeletingCategoryId] = useState(null);

  const {
    data: categories,
    isLoading,
    isError,
  } = useCategoryQuery("GET_ALL_CATEGORY", null, pageCategory);

  const { mutate: deleteCategory, isPending } = useCategoryMutation({
    action: "DELETE",
    onSuccess: () => messageApi.success("Xóa danh mục thành công."),
    onError: (error) => message.error("Xóa danh mục thất bại. " + error),
  });

  const columns = [
    {
      title: "Mã danh mục",
      dataIndex: "category_code",
    },
    {
      title: "Tên danh mục",
      dataIndex: "name",
      onFilter: (value, record) => record.name.indexOf(value) === 0,
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ["ascend", "descend"],
      width: "40%",
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      render: (_, categories) => categories.created_at,
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
      sortDirections: ["ascend", "descend"],
      width: "20%",
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updated_at",
      render: (_, categories) => categories.updated_at,
      sorter: (a, b) => new Date(a.updated_at) - new Date(b.updated_at),
      sortDirections: ["ascend", "descend"],
      width: "20%",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, category) => (
        <Space size="small">
          <Button
            disabled={deletingCategoryId === category.id}
            onClick={() => handleModalUpdate(category)}
          >
            <EditOutlined />
          </Button>

          <Popconfirm
            title="Xóa danh mục"
            description="Bạn có muốn xóa danh mục này không?"
            okText={deletingCategoryId === category.id ? `Đang xóa` : `Có`}
            cancelText="Không"
            onConfirm={() => {
              setDeletingCategoryId(category.id);
              deleteCategory(category);
            }}
          >
            <Button
              type="primary"
              danger
              loading={deletingCategoryId === category.id}
            >
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const dataSource = (categories?.data.data || []).map((category, index) => ({
    key: category.id,
    index: index + 1,
    ...category,
  }));

  const handleModalUpdate = (category) => {
    setSelectedCategory(category);
    setModalUpdateOpen(true);
  };

  if (isError) {
    return <div>Error: {isError.message}</div>;
  }
  if (isLoading) return <Loading />;

  return (
    <>
      {contextHolder}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl">Quản lý danh mục</h1>
        <Button type="primary" onClick={() => setModalCreateOpen(true)}>
          <PlusCircleOutlined disabled={isPending} />
          Thêm
        </Button>
      </div>
      <Table columns={columns} dataSource={dataSource} pagination={false} />
      <Pagination
        disabled={isPending}
        className="mt-5"
        align="end"
        defaultCurrent={1}
        total={categories?.data.total}
        pageSize={5}
        onChange={(page) => setPageCategory(page)}
      />
      <CreateCategory
        open={modalCreateOpen}
        onCancel={() => setModalCreateOpen(false)}
      />
      <UpdateCategory
        open={modalUpdateOpen}
        onCancel={() => setModalUpdateOpen(false)}
        category={selectedCategory}
      />
    </>
  );
};

export default Category;
