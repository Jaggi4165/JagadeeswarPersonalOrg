@isTest
public class AddPrimaryContactTest { 
    static testmethod void testQueueable(){ 
        List<Account> testAccounts = new List<Account>();
        for (Integer i=0;i<50;i++){ 
            testAccounts.add(new Account(Name= 'Account' +i, BillingState='CA' )); 
        } 
        for(Integer j=0;j<50;j++){ 
            testAccounts.add(new Account(Name= 'Accounts'+j,BillingState='NY'));
        } 
        
        insert testAccounts; 
        Contact testContact = new Contact(Title='test',FirstName = 'John', LastName = 'Doe'); 
        insert testContact;
        AddPrimaryContact addit = new addPrimaryContact(testContact, 'CA');
        Test.startTest();
        system.enqueueJob(addit);
        Test.stopTest();
    }
}