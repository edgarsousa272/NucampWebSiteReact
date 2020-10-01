import React, { Component } from 'react';
import Directory from './DirectoryComponent';
import CampsiteInfo from './CampsiteInfoComponent';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import Home from './HomeComponent';
import Contact from './ContactComponent';
import About from './AboutComponent';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { addComment, fetchCampsites } from '../redux/ActionCreators';

//Getting the state from Redux.
const mapStateToProps = state => {
// inside {} are props.
    return {
        campsites: state.campsites,
        comments: state.comments,
        partners: state.partners,
        promotions: state.promotions
    };
};

//Dispatching the ActionCreators.js
const mapDispatchToProps = {
    addComment: (campsiteId, rating, author, text) => (addComment(campsiteId, rating, author, text)),
    fetchCampsites: () => (fetchCampsites())
};

class Main extends Component {

//lifecycle methods
    componentDidMount() {
        this.props.fetchCampsites();
    }

  render() {
// locally scoped component "homepage". Only access by the main page.
    const HomePage = ()=>{
        return(
            <Home
// getting campsites array out of campsites object.
                campsite={this.props.campsites.campsites.filter(campsite => campsite.featured)[0]}
                campsitesLoading={this.props.campsites.isLoading}
                campsitesErrMess={this.props.campsites.errMess}
                promotion={this.props.promotions.filter(promotion => promotion.featured)[0]}
                partner={this.props.partners.filter(partner => partner.featured)[0]}
            />
        );
    }

// + turn string to a number.
    const CampsiteWithId = ({match}) => {
        return (
            <CampsiteInfo 
                campsite={this.props.campsites.campsites.filter(campsite => campsite.id === +match.params.campsiteId)[0]} 
                isLoading={this.props.campsites.isLoading}
                errMess={this.props.campsites.errMess}
                comments={this.props.comments.filter(comment => comment.campsiteId === +match.params.campsiteId)}
                addComment={this.props.addComment}
            />
        );
    }; 

//passing data. by directory
// : very important. Tell the router whats follow will be a parameter and put inside the property.
      return (
          <div>
                <Header />
                <Switch>
                    <Route path='/home' component={HomePage} />
                    <Route exact path='/directory' render={() => <Directory campsites={this.props.campsites} />} />
                    <Route path='/directory/:campsiteId' component={CampsiteWithId} />
                    <Route exact path='/aboutus' render={() => <About partners={this.props.partners} />} />
                    <Route exact path='/contactus' component={Contact} />
                    <Redirect to='/home' />
                </Switch>
                <Footer />
          </div>
      );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));