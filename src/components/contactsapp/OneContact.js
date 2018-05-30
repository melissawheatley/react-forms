import React, { Component } from 'react';
import { Grid, Image, Icon, Divider, Button } from 'semantic-ui-react';
import './main.css';
import { Link } from 'react-router-dom';
import EditForm from './EditForm';

export default class OneContact extends Component{

    state = {
        contact: {},
        edit: false
    }

    componentDidMount(){
        this.getContactDB();
    }

    getContactDB = () => {
        fetch(`http://localhost:4000/contacts?id=${this.props.id}`)
        .then((data)=>{
            return data.json();
        }).then((contactArray)=>{
            this.setState({
                contact: contactArray[0]
            })
            // console.log('contact from getContactDB', this.state.contact);
        })
    }

    editContact = () => {
        this.setState({
            edit: true
        })
    }

    saveUpdate = (userObject) =>{
        return fetch(`http://localhost:4000/contacts/${this.props.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userObject)
        }).then((data)=>{
            return data.json();
        }).then((result)=>{
            this.setState({
                contact: result, //you want to set this state so that the update will re-render on it's own without refresh.
                edit: false
            })
        })
    }

    cancelUpdate = () => {
        this.setState({
            edit: false
        })
    }

    openEditForm = () =>{
        if(this.state.edit){
            return(
                <div>
                    <Divider section />
                    <EditForm title='Edit This Contact' person={this.state.contact} saveUpdate={this.saveUpdate} cancelUpdate={this.cancelUpdate} />
                </div>
            )
        }
    }



    render(){
        return(
            <div className="userProfilePage">
             <Grid>
                <Grid.Column width={4}>
                <Image className="profileImage" src={this.state.contact.image} />
                <Divider section />
                <Button positive fluid
                onClick={this.editContact}
                >
                <Icon name='edit' />
                        Edit Contact
                </Button>
                <Divider hidden />
                <Button fluid
                color='orange'
                as={Link}
                to='/contactsapp'
                >
                <Icon name='backward' />
                    Go Back to List
                </Button>
                </Grid.Column>
                <Grid.Column width={8}>
                    <h1>{this.state.contact.name}</h1>
                    <p>{this.state.contact.company}, {this.state.contact.position}</p>
                    <p>{this.state.contact.phone}</p>
                    <p><a href={`mailto:${this.state.contact.email}`}>{this.state.contact.email}</a></p>
                    <p>{this.state.contact.notes}</p>
                    {/* <Rating maxRating={5} defaultRating={this.state.contact.rating} icon='star' size='massive' /> */}
                    {this.openEditForm()}
                </Grid.Column>
            </Grid>
            
            </div>
        )
    }
}