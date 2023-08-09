import React, { useEffect, useState } from "react";
import { Button, Popconfirm, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import Coordinates from "../types/coordinates";
import { useGetPlaces } from "../hooks/place/useGetPlaces";
import { Input } from "antd";
import { useDeletePlace } from "../hooks/place/useDeletePlace";

const { Search } = Input;

interface Source {
  key: string;
  place: string;
  mag: number;
  url: string;
  coordinates: Coordinates;
  depth: number;
  sig: number;
  "@timestamp": string;
  type: string;
}

interface DataType {
  _id: string;
  _source: Source;
}

// const data: DataType[] = [
//   {
//     key: "1",
//     name: "John Brown",
//     age: 32,
//     address: "New York No. 1 Lake Park",
//     tags: ["nice", "developer"],
//   },
//   {
//     key: "2",
//     name: "Jim Green",
//     age: 42,
//     address: "London No. 1 Lake Park",
//     tags: ["loser"],
//   },
//   {
//     key: "3",
//     name: "Joe Black",
//     age: 32,
//     address: "Sydney No. 1 Lake Park",
//     tags: ["cool", "teacher"],
//   },
// ];

const Places: React.FC = () => {
  const deleteItem = useDeletePlace();
  const [open, setOpen] = useState("");

  const handleOk = async (id: string) => {
    await deleteItem.mutateAsync(id);
    setOpen("");
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen("");
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "PLace",
      dataIndex: "_source",
      key: "place",
      render: (_, data) => <a>{data._source.place}</a>,
    },
    {
      title: "Magnitude",
      dataIndex: "_source",
      key: "mag",
      render: (_, data) => data._source.mag,
    },
    {
      title: "Date",
      dataIndex: "_source",
      key: "@timestamp",
      render: (_, data) =>
        data._source["@timestamp"].split("T").join(",").split(".")[0],
    },
    {
      title: "Type",
      key: "type",
      dataIndex: "_source",
      render: (_, data) => data._source.type,
    },
    {
      title: "On map",
      key: "onMap",
      dataIndex: "_source",
      render: (_, data) => (
        <img
          src={`https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-s-l+000(${data._source.coordinates.lon},${data._source.coordinates.lat})/${data._source.coordinates.lon},${data._source.coordinates.lat},0/500x300?access_token=pk.eyJ1Ijoic2hhZ2VsZGkiLCJhIjoiY2xoOHlyMDJhMDJiZzNlbnV1cTF6ZTV0OCJ9.m7LDf5BCVbkcKesIk2cFGg`}
          alt="onMap"
          style={{
            width: "300px",
          }}
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="Do you want to delete?"
            description={record._source.place}
            open={record._id === open}
            onConfirm={() => handleOk(record._id)}
            okButtonProps={{ loading: deleteItem.isLoading }}
            onCancel={handleCancel}
          >
            <Button danger onClick={() => setOpen(record._id)}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const { isLoading, data, error, refetch } = useGetPlaces({
    limit,
    page,
    search,
  });

  const onSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  useEffect(() => {
    refetch();
  }, [page, limit, search]);

  return (
    <Space size={"middle"} direction="vertical" style={{ width: "100%" }}>
      <Search
        placeholder="Enter place name..."
        allowClear
        enterButton="Search"
        size="large"
        onSearch={onSearch}
      />
      <Table
        columns={columns}
        dataSource={data ? data.hits.hits : []}
        loading={isLoading}
        pagination={{
          defaultPageSize: data ? Number(data.pageCount) : 0,
          total: data ? Number(data.hits.total.value) : 0,
          pageSize: limit,
          onChange(p, size) {
            setPage(p);
            setLimit(size);
          },
          showSizeChanger: true,
          pageSizeOptions: [
            ...new Array(100).fill(0).map((_, i) => (i + 1) * 10),
          ],
        }}
      />
    </Space>
  );
};

export default Places;
