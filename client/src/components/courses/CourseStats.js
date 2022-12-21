import Card from "react-bootstrap/Card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// const data = [
//   {
//     name: "0",
//     students: 3,
//   },
//   {
//     name: "1-49",
//     students: 7,
//   },
//   {
//     name: "50-69",
//     students: 22,
//   },
//   {
//     name: "70-85",
//     students: 28,
//   },
//   {
//     name: "86-99",
//     students: 41,
//   },
//   {
//     name: "100",
//     students: 24,
//   },
// ];

const getAttendanceStats = (attendances) => {
  const data = [];
  const attendanceStats = {
    "0%": 0,
    "1-49%": 0,
    "50-69%": 0,
    "70-85%": 0,
    "86-99%": 0,
    "100%": 0,
  };
  const totalClasses = attendances.length;
  const map = new Map();

  attendances.forEach((attendance) => {
    const { records } = attendance;
    records.forEach((record) => {
      const studentId = record.student;
      const count = record.present ? 1 : 0;
      if (map.has(studentId)) {
        map.set(studentId, map.get(studentId) + count);
      } else {
        map.set(studentId, count);
      }
    });
  });

  map.forEach((count) => {
    const attendancePercent = (count / totalClasses) * 100;
    if (attendancePercent === 100) attendanceStats["100%"]++;
    else if (attendancePercent >= 86 && attendancePercent < 100)
      attendanceStats["86-99%"]++;
    else if (attendancePercent >= 70 && attendancePercent < 86)
      attendanceStats["70-85%"]++;
    else if (attendancePercent >= 50 && attendancePercent < 70)
      attendanceStats["50-69%"]++;
    else if (attendancePercent >= 1 && attendancePercent < 50)
      attendanceStats["1-49%"]++;
    else attendanceStats["0%"]++;
  });

  for (let i in attendanceStats) {
    if (attendanceStats.hasOwnProperty(i))
      data.push({
        name: i,
        students: attendanceStats[i],
      });
  }
  return data;
};

function CourseStats({ course }) {
  const { attendances, students } = course;
  const data = getAttendanceStats(attendances);
  // console.log(data);
  return (
    <>
      <Card border="0" className="mt-3 p-2 shadow-sm">
        <Card.Body style={{ height: "500px" }}>
          <p className="text-center" style={{ fontSize: "20px" }}>
            <strong>Overall attendance</strong>
          </p>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={150}
              height={40}
              data={data}
              margin={{
                bottom: 30,
              }}
            >
              <XAxis
                dataKey="name"
                label={{
                  value: "Attendance %",
                  offset: 0,
                  position: "bottom",
                }}
              />
              <YAxis
                domain={[0, students.length]}
                allowDataOverflow={true}
                label={{
                  value: "No. of students",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip />
              <Legend align="right" wrapperStyle={{ top: -40, left: 0 }} />
              <Bar
                dataKey="students"
                fill="#8884d8"
                label={students.length > 0 && { position: "top" }}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card.Body>
      </Card>
    </>
  );
}

export default CourseStats;
