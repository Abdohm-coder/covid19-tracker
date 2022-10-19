import { Hidden } from "@material-ui/core";
import { useEffect, useState } from "react";
import { LineChart, Line, ResponsiveContainer } from 'recharts';

function LineGraph({ casesType = "cases", ...props }) {

  const [data, setData] = useState({});
  
  const buildChartData = (data, casesType = "cases") => {
      const chartData = [];
      let lastDataPoint;

      for (let date in data.cases) {
          if (lastDataPoint) {
              const newDataPoint = {
                  x: date,
                  y: data[casesType][date] - lastDataPoint
              }
              chartData.push(newDataPoint);
            }
        lastDataPoint = data[casesType][date];
      }
      return chartData;
  }

      const Data = Object.keys(data).map(d => {
        const name = data[d].x;  
        const uv = data[d].y / 100;
        return {name: name, uv: uv, pv: 0, amt: 0};
      })


  useEffect(() => {
        const fetchData = async () => {
            await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=7")
            .then(response => response.json())
            .then(data => {
                const chartData = buildChartData(data, casesType);
                setData(chartData);
              });

            };
            fetchData();
        }, [casesType]);
  return <div className={props.className}>
      { data?.length > 0 && (
        <ResponsiveContainer width="100%" height="100%">
          <div style={{overflow: Hidden, display: "flex", alignItems: "center", justifyContent: "center"}}>
            <LineChart className="linegraph" width={350} height={400} data={Data}>
                <Line type="monotone" dataKey="uv" stroke={casesType === "cases" ? `#8884d8` : `#F47272`} strokeWidth={2} />
            </LineChart>
          </div>
        </ResponsiveContainer>
      ) }
  </div>;
}

export default LineGraph;
