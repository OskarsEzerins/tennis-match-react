import React from 'react'

import { TextField, Button, Grid, Box } from '@material-ui/core'

const SearchForm = ({ state, handleInputChange, handleSearchMatches }) => {
  const { searchStartDate, searchEndDate } = state

  return (
    <Grid item xs={12}>
      <Grid item xs={12} style={{ textAlign: 'center' }}>
        <h3>Search Date For Players</h3>
      </Grid>
      <form>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box display='flex' style={{ gap: '10px' }}>
              <TextField
                label='Start Date'
                name='searchStartDate'
                type='date'
                value={searchStartDate}
                onChange={handleInputChange}
                margin='normal'
                variant='outlined'
                InputLabelProps={{ shrink: true }}
                fullWidth
              />

              <TextField
                label='End Date'
                name='searchEndDate'
                type='date'
                value={searchEndDate}
                onChange={handleInputChange}
                margin='normal'
                variant='outlined'
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Button variant='contained' color='primary' onClick={handleSearchMatches}>
              Search
            </Button>
          </Grid>
        </Grid>
      </form>
    </Grid>
  )
}

export default SearchForm
