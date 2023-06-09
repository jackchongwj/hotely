import React from 'react'
import FlexBetween from 'components/FlexBetween'
import Header from 'components/Header'
import {
  DownloadOutlined,
  Email,
  PointOfSale,
  PersonAdd,
  Traffic,
} from '@mui/icons-material'
import { Box, Button, Typography, useTheme, useMediaQuery } from '@mui/material'
import Charts from "components/Charts"
import StatBox from 'components/StatBox'
import Report from "components/Report"

const Dashboard = () => {
  const theme = useTheme()
  const isNonMediumScreens = useMediaQuery('(min-width: 1200px)')

    // Dummy data for the charts
    const occupancyData = [
      { channel: 'Direct', count: 12 },
      { channel: 'OTA', count: 6 },
    ];
    const reservationsData = [
      { roomType: 'Single', count: 8 },
      { roomType: 'Double', count: 12 },
    ];
    const roomsData = [
      { status: 'Occupied', count: 10 },
      { status: 'Vacant', count: 8 },
      { status: 'Dirty', count: 4 },
    ];


    const revenueData = [
      { date: "2023-05-01", revenue: 1200 },
      { date: "2023-05-02", revenue: 1500 },
      { date: "2023-05-03", revenue: 1800 },
      { date: "2023-05-04", revenue: 2000 },
      { date: "2023-05-05", revenue: 2200 },
      { date: "2023-05-06", revenue: 2500 },
      { date: "2023-05-07", revenue: 2800 },
      { date: "2023-05-08", revenue: 3000 },
      { date: "2023-05-09", revenue: 3200 },
      { date: "2023-05-10", revenue: 3500 },
      { date: "2023-05-11", revenue: 3800 },
      { date: "2023-05-12", revenue: 4000 },
      { date: "2023-05-13", revenue: 4200 },
      { date: "2023-05-14", revenue: 4500 },
      { date: "2023-05-15", revenue: 4800 },
      { date: "2023-05-16", revenue: 5000 },
      { date: "2023-05-17", revenue: 5200 },
    ]

  const token = localStorage.getItem('token')
  return (
    <>
      {token && token !== 'null' && (
        <Box m='1.5rem 2.5rem'>
          <FlexBetween>
            <Header title='CASA HOTEL' />

            <Box>
              <Button
                sx={{
                  backgroundColor: theme.palette.secondary.light,
                  color: theme.palette.background.alt,
                  fontSize: '14px',
                  fontWeight: 'bold',
                  padding: '10px 20px',
                }}
              >
                <DownloadOutlined sx={{ mr: '10px' }} />
                Download Reports
              </Button>
            </Box>
          </FlexBetween>

          <Box
            mt='20px'
            display='grid'
            gridTemplateColumns='repeat(12, 1fr)'
            gridAutoRows='160px'
            gap='20px'
            sx={{
              '& > div': {
                gridColumn: isNonMediumScreens ? undefined : 'span 12',
              },
            }}
          >
            
            {/* ROW 1 */}
            <StatBox
              title='Current Occupancy'
              value=''
            />
            <StatBox
              title='Current Guests'
              value=''
            />

            <StatBox
              title='Expected Arrival'
              value=''
            />
            <StatBox
              title='Expected Departure'
              value=''
            />
            <Box sx={{ gridColumn: 'span 4'}}>
            
              <Charts
                occupancyData={occupancyData}
                reservationsData={reservationsData}
                roomsData={roomsData}
              />
            </Box>
            
            <Box sx={{ gridColumn: 'span 8' }}>
              <Report revenueData={revenueData} />
            </Box>
            
          </Box>
          
        </Box>
      )}
    </>
  )
}

export default Dashboard
