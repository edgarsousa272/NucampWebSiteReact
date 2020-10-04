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
import { actions } from 'react-redux-form';
import { postComment, postFeedback, fetchCampsites, fetchComments, fetchPromotions, fetchPartners } from '../redux/ActionCreators';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

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
    postComment: (campsiteId, rating, author, text) => (postComment(campsiteId, rating, author, text)),
    fetchCampsites: () => (fetchCampsites()),
    resetFeedbackForm: () => (actions.reset('feedbackForm')),
    fetchComments: () => (fetchComments()),
    fetchPromotions: () => (fetchPromotions()),
    fetchPartners: () => (fetchPartners()),
    postFeedback: feedback => (postFeedback(feedback)),
};


class Main extends Component {

//lifecycle methods
    componentDidMount() {
        this.props.fetchCampsites();
        this.props.fetchComments();
        this.props.fetchPromotions();
        this.props.fetchPartners();
    }

  render() {
// locally scoped component "homepage". Only access by the main page.
    const HomePage = () => {
        return(
            <Home
// getting campsites array out of campsites object.
                campsite={this.props.campsites.campsites.filter(campsite => campsite.featured)[0]}
                campsitesLoading={this.props.campsites.isLoading}
                campsitesErrMess={this.props.campsites.errMess}
                promotion={this.props.promotions.promotions.filter(promotion => promotion.featured)[0]}
                promotionLoading={this.props.promotions.isLoading}
                promotionErrMess={this.props.promotions.errMess}
                partner={this.props.partners.partners.filter(partner => partner.featured)[0]}
                partnerLoading={this.props.partners.isLoading}
                partnerErrMess={this.props.partners.errMess}
                
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
                comments={this.props.comments.comments.filter(comment => comment.campsiteId === +match.params.campsiteId)}
                commentsErrMess={this.props.comments.errMess}
                postComment={this.props.postComment}
            />
        );
    }; 

//passing data. by directory
// : very important. Tell the router whats follow will be a parameter and put inside the property.
      return (
          <div>
                <Header />
                <TransitionGroup>
                    <CSSTransition key={this.props.location.key} classNames="page" timeout={300}>
                        <Switch>
                            <Route path='/home' component={HomePage} />
                            <Route exact path='/directory' render={() => <Directory campsites={this.props.campsites} />} />
                            <Route path='/directory/:campsiteId' component={CampsiteWithId} />
                            <Route exact path='/contactus' render={() => <Contact postFeedback={this.props.postFeedback} resetFeedbackForm={this.props.resetFeedbackForm} /> } />
                            <Route exact path='/aboutus' render={() => <About partners={this.props.partners} /> } />
                            <Redirect to='/home' />
                        </Switch>
                    </CSSTransition>
                </TransitionGroup>
                <Footer />
          </div>
      );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));