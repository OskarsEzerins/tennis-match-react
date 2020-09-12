import React, { Component } from 'react';
import RequestDisplay from '../components/RequestDisplay';
import RequestCard from '../components/RequestCard';
import moment from 'moment';
import Nav from "../components/Nav";

class Requests extends Component {

    state = {
        searchResult: []
    }

    componentDidMount() {
        this.getRequests();
    }

    getRequests = () => {
        fetch("/api/calendar/requests")
            .then(res => res.json())
            .then(res => {
                console.log(res);
                this.setState({ searchResult: res });
            })
            .catch(err => console.log(err));
    }

    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    };

    handleConfirm = event => {
        event.preventDefault();
        let nestedID = event.target.dataset.eventid;
        let nestedStart = event.target.dataset.start;
        let nestedEnd = event.target.dataset.end;

        let eventTitle = event.target.dataset.eventtitle;
        console.log("EVENT TITLE: " + eventTitle);
        let titleArr = (eventTitle).split("-");
        let updateObj = {
            id: event.target.dataset.eventid,
            title: "Confirmed -" + titleArr[1]
        }
        fetch("/api/calendar/requests", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updateObj)
        })
            .then(res => {
                console.log(res);
                console.log("NESTED FETCH ID: " + nestedID);
                let confirmedEventInfo = {
                    id: nestedID,
                    start: nestedStart,
                    end: nestedEnd
                }
                fetch("/api/overlap/destroy", {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(confirmedEventInfo)
                })
                .then(response=> {
                    console.log(response);
                    this.getRequests();
                })
                .catch(err=>console.log(err))
                // this.getRequests();
            })
            .catch(err => console.log(err));

    }

    handleDeny = event => {
        event.preventDefault();

        let updateObj = {
            id: event.target.dataset.eventid
        }

        fetch("/api/event/deny", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updateObj)
        })
            .then(res => {
                console.log(res);
                this.getRequests();
            })
            .catch(err => console.log(err));

    }


    render() {
        return (
            <div>
                <Nav />
                <div className="container">
                    <RequestDisplay />
                    {this.state.searchResult.length !== 0 ?
                        this.state.searchResult.map((event, i) => (
                            <RequestCard
                                key={i}
                                title={event.title}
                                proposeUserid={event.UserId}
                                proposeUsername={event.User.username}
                                proposeUserFirstname={event.User.firstname}
                                proposeUserLastname={event.User.lastname}
                                eventLocation={event.location}
                                fullStarttime={event.start}
                                fullEndtime={event.end}
                                starttime={moment(event.start).format("hh:mm a")}
                                endtime={moment(event.end).format("hh:mm a")}
                                date={moment(event.start).format("L")}
                                eventId={event.id}
                                handleInputChange={this.handleInputChange}
                                handleConfirm={this.handleConfirm}
                                handleDeny={this.handleDeny}
                            />
                        ))
                        : <p>You currently have no requests.</p>
                    }
                </div>
            </div>
        )
    }
}

export default Requests;