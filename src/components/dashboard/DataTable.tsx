import React from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";

interface DataType {
  key: string;
  doc_count: number;
}

const columns: ColumnsType<DataType> = [
  {
    title: "Place",
    dataIndex: "key",
    key: "key",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Count",
    dataIndex: "doc_count",
    key: "doc_count",
  },
];

interface IProps {
  data: any;
}

const DataTable: React.FC<IProps> = ({ data }) => (
  <Table columns={columns} dataSource={data} pagination={false} />
);

export default DataTable;
