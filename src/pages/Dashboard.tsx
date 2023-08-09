import { AutoComplete, Card, Col, Row } from "antd";
import { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";
import DataTable from "../components/dashboard/DataTable";
import MapboxData from "../components/dashboard/MapboxData";
import MetrixData from "../components/dashboard/MetrixData";
import useGetDashboard from "../hooks/dashboard/useGetDashboard";
import LeafletData from "../components/dashboard/openstreetmap/LeafletData";
import DateRange from "../components/dashboard/filter/DateRange";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);

  const [searchValue, setSearchValue] = useState("");

  const { data, isLoading, error, refetch } = useGetDashboard({
    st: startDate,
    en: endDate,
    search: searchValue,
  });

  useEffect(() => {
    refetch();
  }, [startDate, endDate, searchValue]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error...</div>;
  }

  const options: ApexOptions = {
    chart: {
      height: 350,
      width: "100%",
      type: "bar",
      events: {
        mounted: (chart) => {
          chart.windowResizeHandler();
        },
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        dataLabels: {
          position: "top", // top, center, bottom
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: string) {
        return val;
      },
      offsetY: -20,
      style: {
        fontSize: "12px",
        colors: ["#304758"],
      },
    },

    xaxis: {
      categories: [
        ...data?.data.aggregations.group_by_date.buckets.map(
          (it: any) => it.key_as_string
        ),
      ],
      position: "top",
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      crosshairs: {
        fill: {
          type: "gradient",
          gradient: {
            colorFrom: "#D8E3F0",
            colorTo: "#BED1E6",
            stops: [0, 100],
            opacityFrom: 0.4,
            opacityTo: 0.5,
          },
        },
      },
      tooltip: {
        enabled: true,
      },
    },
    yaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        formatter: function (val) {
          return val + "";
        },
      },
    },
    title: {
      text: "Daily earthquakes",
      floating: true,
      offsetY: 330,
      align: "center",
      style: {
        color: "#444",
      },
    },
  };

  const handleEnter = (key: string) => {
    if (key === "Enter") {
      refetch();
    }
  };

  return (
    <div>
      <Row>
        <Col span={8}>
          <DateRange
            onDateChange={(startDate, endDate) => {
              console.log(startDate, endDate, "ok");
              setStartDate(startDate);
              setEndDate(endDate);
            }}
          />
        </Col>
        <Col span={8}>
          <AutoComplete
            style={{ width: 200 }}
            options={[
              ...data?.data.aggregations.places.buckets.map((place: any) => {
                return {
                  value: place.key,
                };
              }),
            ]}
            onKeyDown={(e: any) => {
              if (e.key === "Enter") {
                setSearchValue(e.target.defaultValue);
              }
              // handleEnter(e.key);
            }}
            placeholder="Search..."
            filterOption={(inputValue, option: any) =>
              option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !==
              -1
            }
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <MapboxData
            state={{ st: startDate, en: endDate, search: searchValue }}
          />
        </Col>
        <Col span={12}>
          <DataTable data={data?.data.aggregations.typeAgg.buckets} />
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: "42px" }}>
        <Col span={16}>
          <Card>
            <LeafletData
              state={{ st: startDate, en: endDate, search: searchValue }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <ReactApexChart
            options={{
              chart: {
                width: "100%",
                type: "pie",
                events: {
                  mounted: (chart) => {
                    chart.windowResizeHandler();
                  },
                },
              },
              labels: [
                ...data?.data.aggregations.typeAgg.buckets.map(
                  (it: any) => it.key
                ),
              ],
              responsive: [
                {
                  breakpoint: 480,
                  options: {
                    chart: {
                      width: 200,
                    },
                    legend: {
                      position: "bottom",
                    },
                  },
                },
              ],
            }}
            series={data?.data.aggregations.typeAgg.buckets.map(
              (it: any) => it.doc_count
            )}
            type="pie"
            width={"100%"}
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: "42px" }}>
        <Col span={8}>
          <MetrixData
            title="Average of depth"
            value={data?.data.aggregations.average_of_depth.value}
          />
        </Col>
        <Col span={8}>
          <MetrixData
            title="Maximum of magnitude"
            value={data?.data.aggregations.max_of_magnitude.value}
          />
        </Col>
        <Col span={8}>
          <MetrixData
            title="Number of earthquakes"
            value={data?.data.aggregations.totalDocs.value}
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: "42px" }}>
        <Col span={24}>
          <div style={{ width: "100%" }}>
            <ReactApexChart
              options={options}
              series={[
                {
                  name: "Earthquakes",
                  data: data?.data.aggregations.group_by_date.buckets.map(
                    (it: any) => it.doc_count
                  ),
                },
              ]}
              type="bar"
              height={350}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
