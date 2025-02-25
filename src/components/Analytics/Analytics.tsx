import {
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  LineChart,
  Line,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Grid, Typography } from "@mui/material";
import { useUser } from "../../hooks/useUser.ts";
import { Book, Genre } from "../../type/type.ts";

const streakData = [
  { day: "2023-02-01", streak: 1 },
  { day: "2023-02-02", streak: 2 },
  { day: "2023-02-03", streak: 3 },
  { day: "2023-02-04", streak: 4 },
];

const Analytics = () => {
  const { data: userData } = useUser();

  const pagesReadData1 = userData?.bookList
    ?.map((book: Book) => {
      const lastSession =
        book?.pagesReadHistory?.[book.pagesReadHistory.length - 1];

      if (lastSession) {
        const sessionDate = new Date(lastSession.sessionDate);

        const formattedDate = sessionDate.toISOString().split("T")[0];
        const formattedDateTime = sessionDate.toISOString().split("T");
        const time = formattedDateTime[1].split(".")[0];

        return {
          sessionDate: `${formattedDate} - ${time}`,
          pagesRead: lastSession.pagesRead,
        };
      } else {
        return null;
      }
    })
    .filter(
      (session: { sessionDate: string; pagesRead: number }) => session !== null,
    );

  console.log(pagesReadData1);

  const booksData =
    userData?.bookList &&
    userData.bookList
      .filter((book: Book) => !!book?.finishedDate)
      .reduce((result: [{ month: string; book: number }], book: Book) => {
        const finishedMonth = new Date(book.finishedDate as number).getMonth();
        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        const monthName = monthNames[finishedMonth];

        const existingMonthIndex = result.findIndex(
          (item: { month: string; book: number }) => item.month === monthName,
        );

        if (existingMonthIndex !== -1) {
          result[existingMonthIndex].book += 1;
        } else {
          result.push({ month: monthName, book: 1 });
        }

        return result;
      }, []);

  console.log(booksData);

  const genresData =
    userData?.favoriteGenres &&
    userData.favoriteGenres.reduce(
      (result: [{ genre: string; count: number }], genre: Genre) => {
        const existingGenreIndex = result.findIndex(
          (item) => item.genre === genre.name,
        );

        if (existingGenreIndex !== -1) {
          result[existingGenreIndex].count += 1;
        } else {
          const count =
            userData?.bookList &&
            userData?.bookList.reduce((count: number, book: Book) => {
              if (book.genreId === genre.id) {
                count += 1;
              }
              return count;
            }, 0);

          result.push({ genre: genre.name, count: count || 0 });
        }

        return result;
      },
      [],
    );

  const colorPalette = [
    "#5ba7ef",
    "#74d5c5",
    "#dcb56a",
    "#cd8c6b",
    "#ad5c6b",
    "#ff7f50",
    "#1e90ff",
    "#32cd32",
    "#8a2be2",
    "#ff1493",
  ];

  return (
    <div style={{ padding: "2em" }}>
      <Typography variant="h4" gutterBottom>
        Analytics & Insights
      </Typography>

      <Grid container spacing={4} style={{ marginTop: "2em" }}>
        <Grid item xs={12} md={5}>
          <Typography variant="h6">Books Read per Month</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={booksData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="book" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Grid>

        <Grid item xs={12} md={5}>
          <Typography variant="h6">Pages Read per Session</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={pagesReadData1}>
              <CartesianGrid strokeDasharray="6 7" />
              <XAxis dataKey="sessionDate" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="pagesRead" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </Grid>

        {userData?.bookList && userData?.favoriteGenres?.length > 0 && (
          <Grid item xs={12} md={5}>
            <Typography variant="h6">Favorite Genres Over Time</Typography>
            <ResponsiveContainer width="100%" height={370}>
              <PieChart>
                <Tooltip />
                <Legend />
                <Pie
                  data={genresData}
                  dataKey="count"
                  nameKey="genre"
                  outerRadius={150}
                >
                  {genresData.map(
                    (
                      _entry: { genre: string; count: number },
                      index: number,
                    ) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={colorPalette[index % colorPalette.length]}
                      />
                    ),
                  )}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Grid>
        )}

        <Grid item xs={12} md={5}>
          <Typography variant="h6">Progress Streaks</Typography>
          <ResponsiveContainer width="100%" height={370}>
            <AreaChart data={streakData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="streak"
                stroke="#8884d8"
                fill="#8884d8"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    </div>
  );
};

export default Analytics;
