import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const OrderChart = ({ barChartData }) => {
  return (
    <div>
      <BarChart width={730} height={250} data={barChartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="dailyOrder" fill="#8884d8" />
        <Bar dataKey="dailyRevenue" fill="#82ca9d" />
      </BarChart>
    </div>
  );
};

export default OrderChart;
