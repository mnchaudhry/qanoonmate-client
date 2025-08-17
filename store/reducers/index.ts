import { combineReducers } from 'redux';
import auth from './authSlice';
import act from './actSlice'
import lawyer from './lawyerSlice'
import aiSession from './aiSessionSlice'
import consultation from './consultationSlice'
import caseLaw from './caseLawSlice'
import dictionary from './dictionarySlice'
import faq from './faqSlice'
import guide from './guideSlice'
import draft from './draftSlice'
import summary from './summarySlice'
import chat from './chatSlice';
import client from './clientSlice';
import blog from './blogSlice'
import notification from './notificationSlice'
import document from './documentSlice';
import clientSettings from './clientSettingsSlice';
import lawyerSettings from './lawyerSettingsSlice';
import user from './userSlice';
import waitlist from './waitlistSlice';
import betaRequest from './betaRequestSlice';
import email from './emailSlice';
import communication from './communicationSlice';
import newsletter from './newsletterSlice';

const rootReducer = combineReducers({
    auth,
    act,
    lawyer,
    aiSession,
    consultation,
    caseLaw,
    dictionary,
    faq,
    guide,
    draft,
    summary,
    chat,
    client,
    blog,
    notification,
    document,
    clientSettings,
    lawyerSettings,
    user,
    waitlist,
    betaRequest,
    email,
    communication,
    newsletter,
});

export default rootReducer;