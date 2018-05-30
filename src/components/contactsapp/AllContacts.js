import React, { Component } from 'react';
import { Card, Image, Button, Divider, Icon } from 'semantic-ui-react';
import AddForm from './AddForm';
import { Link } from 'react-router-dom';

export default class AllContacts extends Component{
    state={
        contacts:[], 
        addContact: false
    }

    componentDidMount(){
        const storedUser = sessionStorage.getItem('user');
        if(storedUser){
            const storedUserObj = JSON.parse(storedUser);
            this.loadContacts(storedUserObj.id);
        }else{
            this.loadContacts(this.props.user.id);
        }
    }

    loadContacts = (id) => {
        fetch(`http://localhost:4000/contacts?ownerID=${id}`)
        .then((data)=>{
            return data.json();
        }).then((userContacts)=>{
            this.setState({
                contacts: userContacts
            })
        })
    }

    saveContact = (userObject) =>{
        userObject.ownerID = this.props.user.id
        return fetch(`http://localhost:4000/contacts/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userObject)
        }).then((data)=>{
            return data.json();
        }).then((result)=>{
            this.setState({
                //contact: result you want to set this state so that the update will re-render on it's own without refresh.
                addContact: false
            })
            this.loadContacts(this.props.user.id)
        })
    }

    addContact = () => {
        this.setState({
            addContact: true
        })
    }

    cancelContactAdd = () => {
        this.setState({
            addContact: false
        })
    }

    deleteContact = (id) => {
       return fetch(`http://localhost:4000/contacts/${id}`, {
           method: 'DELETE',
           headers: {
               'Content-Type': 'application/json'
           }
       }).then((response)=>{
           const storedUser = sessionStorage.getItem('user');
           const storedUserObj = JSON.parse(storedUser);
           this.loadContacts(storedUserObj.id)
       })
    }

    openForm = () => {
        if(this.state.addContact){
            return(
                <div>
                    <Divider section />
                        <AddForm title="Add Contact" saveContact={this.saveContact} cancelContactAdd={this.cancelContactAdd} />
                    <Divider section />
                </div>
            )
        }else{
            return(
                <div>
                    <Button 
                        color='green' 
                        onClick={this.addContact}
                    >
                    <Icon name='add user' />
                        Add Contact
                    </Button>
                    <Divider section />
                </div>
            )
        }
    }

    render(){
        return( 
                <div>
                    {this.openForm()}
                    <h2>All Contacts</h2>
                    <ContactsList contacts={this.state.contacts} deleteContact={this.deleteContact} />
                </div>
        )
    }
}

class ContactsList extends Component{
    render(){
        const contacts = this.props.contacts.map((contact)=>(
            <CardExampleHeaderCard
                key={contact.id}
                id={contact.id}
                name={contact.name}
                company={contact.company}
                notes={contact.notes}
                image={contact.image}
                rating={contact.rating}
                phone={contact.phone}
                email={contact.email}
                deleteContact={this.props.deleteContact}
            />
        ));
        return(
            <div>
                <Card.Group>
                    {contacts}
                </Card.Group>
            </div>
        )
    }

}


class CardExampleHeaderCard extends Component{
    render(){
        return(
            <Card>
                <Card.Content>
                    <Image floated='right' size='mini' src={this.props.image} />
                    <Card.Header>
                    <Link to={`/contactsapp/${this.props.id}`}>{this.props.name} ({this.props.company}) </Link>
                    </Card.Header>
                    <Card.Meta>  
                    <Button 
                        size='mini' 
                        color='red'
                        onClick={()=>{this.props.deleteContact(this.props.id)}}
                    >
                        Delete Contact                       
                    </Button>
                    </Card.Meta>
                    <Card.Description>
                    <strong>{this.props.notes}</strong>
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <div className='ui four buttons'>
                    <Button basic color='teal' icon="call" href={`tel:${this.props.phone}`}></Button>
                    <Button basic color='green' icon="talk" href={`sms:${this.props.phone}`}></Button>
                    <Button basic color='blue' icon="mail" href={`mailto:${this.props.email}`}></Button>
                    <Button basic color='orange' as={Link} to={`/contactsapp/${this.props.id}`}>Edit</Button>
                    </div>
                </Card.Content>
            </Card>
        )
    }
}