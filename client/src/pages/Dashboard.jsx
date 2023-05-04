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
import { DataGrid } from '@mui/x-data-grid'
import StatBox from 'components/StatBox'

const Dashboard = () => {
  const theme = useTheme()
  const isNonMediumScreens = useMediaQuery('(min-width: 1200px)')

  const columns = []
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
              increase='+14%'
              description='Since last month'
              icon={
                <Email
                  sx={{ color: theme.palette.secondary[300], fontSize: '26px' }}
                />
              }
            />
            <StatBox
              title='Current Guests'
              value=''
              increase='+21%'
              description='Since last month'
              icon={
                <PointOfSale
                  sx={{ color: theme.palette.secondary[300], fontSize: '26px' }}
                />
              }
            />

            <StatBox
              title='Expected Arrival'
              value=''
              increase='+5%'
              description='Since last month'
              icon={
                <PersonAdd
                  sx={{ color: theme.palette.secondary[300], fontSize: '26px' }}
                />
              }
            />
            <StatBox
              title='Expected Departure'
              value=''
              increase='+43%'
              description='Since last month'
              icon={
                <Traffic
                  sx={{ color: theme.palette.secondary[300], fontSize: '26px' }}
                />
              }
            />
            <Box></Box>

            {/* ROW 2 */}
            <Box></Box>
          </Box>
        </Box>
      )}
    </>
  )
}

export default Dashboard
