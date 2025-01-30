import { LightningElement,track,api,wire } from 'lwc';

import fetchContacts from '@salesforce/apex/QuoteWizardApexClass.fetchContacts';
import fetchAccountDetails from '@salesforce/apex/QuoteWizardApexClass.fetchAccountDetails';
import fetchAccount from '@salesforce/apex/QuoteWizardApexClass.fetchAccount';

import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { getFieldValue, getRecord } from 'lightning/uiRecordApi';
// Account Fields  Importing
import ACCOUNT_OBJECT from "@salesforce/schema/Account";
import NAME_FIELD from '@salesforce/schema/Account.Name';
import PHONE_FIELD from '@salesforce/schema/Account.Phone';
import ADDRESS_FIELD from '@salesforce/schema/Account.BillingAddress';
import INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';
import OWNER_FIELD from '@salesforce/schema/Account.Owner.Name';
import AccNumber_FIELD from '@salesforce/schema/Account.AccountNumber';
const accFields = [NAME_FIELD,OWNER_FIELD,AccNumber_FIELD];


//Contact Fiels Importing
import CONTACT_OBJECT from "@salesforce/schema/Contact";
import CONTACT_FNAME_FIELD from '@salesforce/schema/Contact.FirstName';
import CONTACT_LNAME_FIELD from '@salesforce/schema/Contact.LastName';
import CONTACT_PHONE_FIELD from '@salesforce/schema/Contact.Phone';
import CONTACT_EMAIL_FIELD from '@salesforce/schema/Contact.Email';
import CONTACT_ADDRESS_FIELD from '@salesforce/schema/Contact.MailingAddress';
import CONTACT_ACCOUNT_FIELD from '@salesforce/schema/Contact.accountId';
const conFields=[CONTACT_FNAME_FIELD,CONTACT_LNAME_FIELD,CONTACT_PHONE_FIELD,CONTACT_EMAIL_FIELD];

//Opportunity Fields
import OPP_OBJECT from "@salesforce/schema/Opportunity";
import OPP_NAME_FIELD from '@salesforce/schema/Opportunity.Name';
import OPP_STAGE_FIELD from '@salesforce/schema/Opportunity.StageName';
import OPP_CLOSEDATE_FIELD from '@salesforce/schema/Opportunity.CloseDate';
const oppFields=[OPP_NAME_FIELD,OPP_CLOSEDATE_FIELD,OPP_STAGE_FIELD];


export default class QuoteWizardCreation extends LightningElement {
finalAccountId;
finalContactId;
finalOppId;
    
// Pages
newContactPage=false;
existingContactPage=false;
newAccountPage=false;
existingAccountPage=false;
existingOppPage=false;
newOppPage=false;

//Options
get optionsForContact() {
    return [
        { label: 'Existing Contact', value: 'Existing Contact' },
        { label: 'New Contact', value: 'New Contact' },
    ];
}
get optionsForAccount() {
    return [ 
        { label: 'Existing Account', value: 'Existing Account' },
        { label: 'New Account', value: 'New Account' },
    ];
}
get optionsForOpp() {
    return [ 
        { label: 'Existing Opportunity', value: 'Existing Opportunity' },
        { label: 'New Opportunity', value: 'New Opportunity' },
    ];
}
    

@track currentStep = '1';
 
handleOnStepClick(event) {  this.currentStep = event.target.value; }
 
get isStepOne() { return this.currentStep === "1";  }
get isStepTwo() { return this.currentStep === "2"; }
get isStepThree() { return this.currentStep === "3"; }
get isEnableNext() { return this.currentStep != "3"; }
get isEnablePrev() {return this.currentStep != "1"; }
get isEnableFinish() {return this.currentStep === "3"; }
 
handleNext()
{
    if(this.currentStep == "1"){ this.currentStep = "2"; }
    //else if(this.currentStep = "2"){ this.currentStep = "3";}
    else if(this.currentStep == "2"){ this.currentStep = "3"; }
    else{ alert("Create Account & Opportunity"); }
}
  
handlePrev()
{
    if(this.currentStep == "3"){ this.currentStep = "2"; }
    else if(this.currentStep = "2"){ this.currentStep = "1"; }
}
 
handleFinish(){
    alert("Quote Created...");
}

handleRadioChange(event)
{
    const selectedContactOption = event.detail.value;
    if (selectedContactOption == 'New Contact'){ this.newContactPage = true;  }
    else{ this.newContactPage = false; }
    if (selectedContactOption == 'Existing Contact'){ this.existingContactPage = true; }
    else{ this.existingContactPage = false; } 
}

handleRadioChange2(event)
{
    const selectedAccountOption = event.detail.value;
    if (selectedAccountOption == 'New Account'){ this.newAccountPage = true; }
    else{ this.newAccountPage = false; }  
    if (selectedAccountOption == 'Existing Account'){ this.existingAccountPage = true; }
    else{ this.existingAccountPage = false; } 
}

handleRadioChange3(event)
{
    const selectedAccountOption = event.detail.value;
    if (selectedAccountOption == 'New Opportunity'){ this.newOppPage = true; }
    else{ this.newOppPage = false; }
    if (selectedAccountOption == 'Existing Opportunity'){ this.existingOppPage = true; }
    else{ this.existingOppPage = false; } 
}

//=====================================================================================================
//=====================================================================================================
//=====================================================================================================

handleContactSuccess(event2)
{
    console.log("Contact Created Successfully :"+event2.detail.id);
    const eventSuccess = new ShowToastEvent({
            title: 'Success',
            variant: 'success',
            message: 'Contact Created Successfully : '+event2.detail.id,
        });
        this.dispatchEvent(eventSuccess);
}
handleContactSubmit(event) 
{
    event.preventDefault();
    const fields = event.detail.fields;
    fields.AccountId = this.finalAccountId.toString();
    this.template.querySelector('.conForm').submit(fields);
    const eventSuccess = new ShowToastEvent({
        title: 'Success',
        variant: 'success',
        message: 'Contact Created Successfully along with account: '+event.detail.id,
    });
    this.dispatchEvent(eventSuccess);
}

handleAccountSuccess(event) {
    this.finalAccountId=event.detail.id;
    const eventSuccess = new ShowToastEvent({
        title: 'Success',
        variant: 'success',
        message: 'Account Created Successfully : '+event.detail.id,
    });
    this.dispatchEvent(eventSuccess);
    console.log("Account Created Successfully :"+event.detail.id);
    
}
accountRecord1;
handleValueSelcted(event) {
    this.finalAccountId = event.detail; 
    console.log("final account id ===--=> "+this.finalAccountId);
    fetchAccount({
        //accId: this.finalAccountId
        accId:event.detail[0]
    })
    .then(result2 => { 
        this.accountRecord1 = result2;
    })
    .catch(error => {
        const event1 = new ShowToastEvent({
            title: 'Error',
            variant: 'error',
            message: 'No Such Account Data Found !',
        });
        this.dispatchEvent(event1);
    });
} 
validateLookupField()
{
    this.template.querySelector('c-custom-lookup').isValid();
}


ContactSearchKey=''; 
contactRecords;
contactRecords2;
presentContact='';
searchelement='';

handleGetContactSearch(event) {
        this.ContactSearchKey=event.target.value;
        fetchContacts({
            searchkey: this.ContactSearchKey
        })
        .then(result => { 
            // this.finalContactId=result.Id;
            // this.finalAccountId=result.AccountId;
            // alert("final account id : "+this.finalAccountId);
            // alert("final account Accountid : "+result.AccountId);
            this.contactRecords = result; 

        })
        .catch(error => {
            const event = new ShowToastEvent({
                title: 'Error',
                variant: 'error',
                message: 'No Such Contact Data Found !',
            });
            this.dispatchEvent(event);
        });
    }
    accountRecord;
    getTheData(event){
        this.ContactSearchKey = event.currentTarget.dataset.id;
        this.contactRecords='';
        
            alert("final  Contact searh key Contact : "+this.ContactSearchKey); //contact ID
    

        fetchAccountDetails({
            conId: this.ContactSearchKey
        })
        .then(result => { 
            this.accountRecord = result;
            this.finalAccountId =result.AccountId;
         alert("account Result Id: "+result.Name);
         alert("account Id: "+result.Id);
        })
        .catch(error => {
            const event = new ShowToastEvent({
                title: 'Error',
                variant: 'error',
                message: 'No Such Account Data Found !',
            });
            this.dispatchEvent(event);
        });
        
     }

     handlePrevStep1(event){
        // const forms=this.template.querySelectorAll('lightning-record-edit-form');
       
        // for(const form of forms)
        // {
        //     alert("event form : "+form);
        //    form.submit();
        // }
        const accforms=this.template.querySelector('.accForm');
        accforms.submit();
        const conforms=this.template.querySelector('.conForm');
        conforms.submit();
        alert("Account , Contact Created");
    }








     
     //=================================Opportunity
     handleOppSubmit(event)
     {
        event.preventDefault();
        const fieldsOpp = event.detail.fields;
        fieldsOpp.AccountId = this.finalAccountId.toString();
        this.template
            .querySelector('.oppForm').submit(fieldsOpp);
     }
     handleOppSuccess(event)
     {
         this.finalOppId=event.detail.id;
        const eventOppSuccess = new ShowToastEvent({
            title: 'Success',
            variant: 'success',
            message: 'Opportunity Created Successfully : '+event.detail.id,
        });
        this.dispatchEvent(eventOppSuccess);
     }





     //=========================================== STEP : 3 ======================
     @wire(getRecord, { recordId: '$this.finalAccountId',  accFields })
    accInfowire;
     get accountName(){ return getFieldValue(this.accInfowire.data,NAME_FIELD)}
     get accountName(){ return getFieldValue(this.accInfowire.data,NAME_FIELD)}
     get accountName(){ return getFieldValue(this.accInfowire.data,NAME_FIELD)}


    @wire(getRecord, { recordId: '$this.finalContactId', conFields })
    conInfowire;


    @wire(getRecord, { recordId: '$this.finalOppId', oppFields })
    oppInfowire;
    
}