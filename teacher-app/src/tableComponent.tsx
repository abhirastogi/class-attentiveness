import React, { FC, useMemo, useEffect, useState } from 'react';
import {useTable, Column, Cell} from 'react-table'
import {DonutComponent} from './donutComponent'
import axios from 'axios'
import CssBaseline from '@material-ui/core/CssBaseline'
import MaUTable from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

type Props = {
}

interface State {
    data : any
}

function RenderDonoutCell(callObj : Cell) {
  return <DonutComponent data={callObj.value} />
}

const columns = 
// useMemo(() => [
  [
    {
      // first group - TV Show
      Header: "Name",
      // First group columns
      columns: [
        {
          Header: "First Name",
          accessor: "name"
        }
      ]
    },
    {
      // Second group - Details
      Header: "Emo",
      // Second group columns
      columns: [
        {
          Header: "Emotions",
          accessor: "emotions", 
          Cell:  RenderDonoutCell
        }
        // {
        //   Header: "Anger",
        //   accessor: "anger"
        // },
        // {
        //   Header: "Sadness",
        //   accessor: "sadness"
        // },
        // {
        //   Header: "Neutral",
        //   accessor: "neutral"
        // },
        // {
        //   Header: "Contempt",
        //   accessor: "contempt"
        // },
        // {
        //   Header: "Disgust",
        //   accessor: "disgust"
        // },
        // {
        //   Header: "Surprise",
        //   accessor: "surprise"
        // },
        // {
        //   Header: "Fear",
        //   accessor: "fear"
        // }
      ]
    }
  ];

interface IData{
  name: string;
  user: string;
  happiness: string;
  sadness: string;
  neutral: string;
  contempt: string;
  disgust: string;
  surprise: string;
  fear: string;
}

export default function Table() {
  const [data, setData] = useState([]);
  const {
    getTableProps, // table props from react-table
    getTableBodyProps, // table body props from react-table
    headerGroups, // headerGroups, if your table has groupings
    rows, // rows for the table based on the data passed
    prepareRow // Prepare the row (this function needs to be called for each row before getting the row props)
  } = useTable({
    columns,
    data
  });

  
  useEffect(() => {
    setInterval(()=>{
    axios
      .get(
        "https://faceemotionsfa.azurewebsites.net/api/faceEmotionFunction?code=Gs6t1UI8fYRzrBzsh3i2Gs2PfeDLw3VYvIQED31PVO/E558e1cdAHA=="
      )
      // .get(
      //   "http://localhost:7071/api/faceEmotionFunction"
      // )
      .then(({ data }) => {
        let changedData = data.map((row : any) => ({
          user : row["user"],
          name : row["name"],
          emotions : {
            happiness: row.happiness,
            anger: row.anger,
            sadness: row.sadness,
            neutral: row.neutral,
            contempt: row.contempt,
            disgust: row.disgust,
            surprise: row.surprise,
            fear: row.fear
          }
        }));
        setData(changedData);
      });
    }, 3000);
 }, []);
  return (
    <MaUTable {...getTableProps()}>
      <TableHead>
        {headerGroups.map(headerGroup => (
          <TableRow {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <TableCell {...column.getHeaderProps()}>{column.render("Header")}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableHead>
      <TableBody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <TableRow {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <TableCell {...cell.getCellProps()}>{cell.render("Cell")}</TableCell>;
              })}
            </TableRow>
          );
        })}
      </TableBody>
    </MaUTable>
  );
}