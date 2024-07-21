import React, { useEffect, useRef, useState, useMemo } from 'react';

import { Table } from 'antd';
import { StopOutlined } from '@ant-design/icons';
import './App.css'
// import jsonData from './test.json'

// let array = []
// for (let i = 0; i < 20; i++) {
//   const temp = JSON.parse(JSON.stringify(jsonData[0]))
//   temp.time = new Date().valueOf() + Math.floor(Math.random() * 100000)
//   array.push(temp)
// }

function App() {

  const [count, setCount] = useState(0)
  const requestFinishedRef = useRef(null);
  const [recording, setRecording] = useState(true);
  const [tableData, setTableData] = useState([]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currRecord, setCurrRecord] = useState(null);



  const columns = useMemo(() => [
    {
      title: 'ID',
      width: 50,
      ellipsis: true,
      align: 'center',
      render: (value, record, index, realIndex) => index + 1,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      minWidth: 100,
      ellipsis: true,
      render: (value, record) => {
        const name = record.request.url.match('[^/]+(?!.*/)');
        const params = record.request.postData || {}
        let method = '';
        try {
          if (name.includes('RPC')) {
            method = params.method
          }
        } catch (error) {
          //
        }
        return <span className="font-bold"
          title={record.request.url}
        >
          {name && name[0]}
          {method ? <span className="text-blue-400"> {'>'}{method}</span> : null}
        </span>;
      }
    },

    {
      title: 'Method',
      dataIndex: 'method',
      minWidth: 40,
      ellipsis: true,
      align: 'center',
      render: (value, record) => record.request.method,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      ellipsis: true,
      minWidth: 30,
      align: 'center',
      render: (value, record) => record.response.status,
    },
    // {
    //   title: 'Type',
    //   dataIndex: 'type',
    //   minWidth: 30,
    //   ellipsis: true,
    //   align: 'center',
    //   render: (value, record) => record._resourceType,
    // },
    // { title: 'Initiator', dataIndex: 'initiator', width: 100 },
    {
      title: 'Size',
      dataIndex: 'size',
      ellipsis: true,
      // minWidth: 70,
      render: (value, record) => record.response.bodySize,
    },
    {
      title: 'Time', dataIndex: 'time',
      ellipsis: true,
      minWidth: 60,
      render: (value, record) => new Date(record.time).toLocaleString().split(' ')[1],
    },

  ]
    , [])

  const setRequestData = function (request) {
    console.log("🚀 ~ setRequestData ~ request:", request.request, request.response)
    if (['fetch', 'xhr'].includes(request._resourceType)) {
      // delete request._initiator
      tableData.push(request);
      setTableData([...tableData]);
    }
  };
  useEffect(() => {
    if (chrome.devtools) {
      if (recording) {
        requestFinishedRef.current = setRequestData;
        chrome.devtools.network.onRequestFinished.addListener(requestFinishedRef.current);
      } else {
        chrome.devtools.network.onRequestFinished.removeListener(requestFinishedRef.current);
      }
    }
  }, [recording]);
  useEffect(() => {
    if (chrome.devtools && recording && tableData.length < 1) {
      chrome.devtools.network.onRequestFinished.removeListener(requestFinishedRef.current);
      requestFinishedRef.current = setRequestData;
      chrome.devtools.network.onRequestFinished.addListener(requestFinishedRef.current);
    }
  }, [tableData]);

  return (
    <>
      <div className="p-2">
        <StopOutlined className='cursor-pointer'
        onClick={() => setTableData([])}/>
      </div>
      {/* TODO , height resize */}
      <Table
        virtual
        bordered
        columns={columns}
        scroll={{ x: 500, y: 700 }}
        rowKey="time"
        dataSource={tableData}
        pagination={false}

      />
    </>
  )
}

export default App
