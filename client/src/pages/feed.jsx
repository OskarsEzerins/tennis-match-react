import React, { useState, useEffect } from 'react'

import { FeedList, FeedListItem, FeedListItemDeny } from '../components/FeedList'
import Nav from '../components/Nav'

import { Grid, Container } from '@material-ui/core'

const Feed = () => {
  const [navValue, _setNavValue] = useState('tab-one')
  const [matches, setMatches] = useState([])
  const [updatedMatches, setUpdatedMatches] = useState([])
  const [_messageNotifications, setMessageNotifications] = useState(0)
  const [_matchNotifications, setMatchNotifications] = useState(0)
  const [_noNotifications, setNoNotifications] = useState(true)

  const getDates = () => {
    fetch('/api/confirmed')
      .then((res) => res.json())
      .then((dates) => {
        setMatches(dates)
      })
      .catch((err) => console.log(err))

    fetch('/api/updates')
      .then((res) => res.json())
      .then((dates) => {
        setUpdatedMatches(dates)
      })
      .catch((err) => console.log(err))
  }

  const getNotifications = () => {
    fetch('/api/notifications')
      .then((res) => res.json())
      .then((notifications) => {
        if (notifications.messages > 0 || notifications.matches > 0) {
          setMessageNotifications(notifications.messages)
          setMatchNotifications(notifications.matches)
          setNoNotifications(false)
        }
      })
  }
  useEffect(() => {
    getDates()
    getNotifications()
    localStorage.removeItem('selectedDate')
  }, [])

  const handleDeny = (event) => {
    fetch('api/event/delete/' + event.currentTarget.dataset.id, {
      method: 'DELETE'
    })
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
      })

    getDates()
  }

  return (
    <div>
      <Nav value={navValue} />
      <Container fixed>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {!matches.length && !updatedMatches.length ? (
              <Grid item xs={12} style={{ textAlign: 'center' }}>
                <h4 className='text-center'>No scheduled matches</h4>
              </Grid>
            ) : (
              <FeedList>
                {updatedMatches.map((match, idx) => (
                  <FeedListItemDeny
                    key={idx}
                    title={match.title}
                    matchStart={match.start}
                    okayDeny={handleDeny}
                    eventID={match.id}
                    confirmer={match.secondUser.username}
                  />
                ))}
                {matches.map((match, idx) => (
                  <FeedListItem
                    key={idx}
                    organizer={match.User.username}
                    confirmer={match.secondUser.username}
                    matchStart={match.start}
                  />
                ))}
              </FeedList>
            )}
          </Grid>
        </Grid>
      </Container>
    </div>
  )
}

export default Feed
