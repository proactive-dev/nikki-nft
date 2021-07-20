import React from 'react'
import { Redirect, Route, Switch, withRouter } from 'react-router-dom'
import { injectIntl } from 'react-intl'
import { CERTIFICATE, DRAFT, EDIT, HOME, LIST, VIEW } from '../../constants/AppConfigs'
import Home from '../../routes/main/Home'
import CertEdit from '../../routes/main/CertEdit'
import CertView from '../../routes/main/CertView'
import CertList from '../../routes/main/CertList'

const MainRoute = (props) => {
  const {match} = props

  return (
    <Switch>
      <Route exact path={`${match.url}${HOME}`}
             component={Home}/>
      <Route exact path={`${match.url}${CERTIFICATE}/${EDIT}`}
             component={CertEdit}/>
      <Route exact path={`${match.url}${CERTIFICATE}/${LIST}`}
             component={CertList}/>
      <Route exact path={`${match.url}${CERTIFICATE}/${VIEW}/:id`}
             component={CertView}/>
      <Route exact path={`${match.url}${DRAFT}/${EDIT}`}
             component={CertEdit}/>
      <Route exact path={`${match.url}${DRAFT}/${LIST}`}
             component={CertList}/>
      <Route exact path={`${match.url}${DRAFT}/${VIEW}/:id`}
             component={CertView}/>
      <Redirect exact from="/" to={`/${HOME}`}/>
      <Redirect from="*" to="/404"/>
    </Switch>
  )
}

export default withRouter(injectIntl(MainRoute))
