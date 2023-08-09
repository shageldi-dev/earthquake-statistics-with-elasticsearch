import { Card, Statistic } from "antd";
import React from "react";
// import CountUp from "react-countup";

// const formatter = (value: number) => <CountUp end={value} separator="," />;

interface IProps {
  value: number;
  title: string;
}

const MetrixData: React.FC<IProps> = (props) => {
  return (
    <Card>
      <Statistic title={props.title} value={props.value} precision={2} />
    </Card>
  );
};

export default MetrixData;
