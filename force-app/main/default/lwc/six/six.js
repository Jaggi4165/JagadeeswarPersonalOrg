import { LightningElement, api } from 'lwc';

import NAME_FIELD from '@salesforce/schema/Account.Name';
import REVENUE_FIELD from '@salesforce/schema/Account.AnnualRevenue';
import INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';

export default class Six extends LightningElement {
    @api recordId;
@api objectApiName;

fields = [NAME_FIELD, REVENUE_FIELD, INDUSTRY_FIELD];

handleSubmit(event){
    event.preventDefault();       // stop the form from submitting
    const fields = event.detail.fields;
    fields.LastName = 'My Custom Last Name'; // modify a field
    this.template.querySelector('lightning-record-form').submit(fields);
 }
}