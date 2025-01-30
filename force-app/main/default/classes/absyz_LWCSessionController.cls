public with sharing class absyz_LWCSessionController {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts() {
        return [SELECT Id, Name FROM Account with security_enforced];
    }

    @AuraEnabled
    public static Contact saveContact(Contact contact) {
        try {
            insert as user contact;
            return contact;
        } catch (Exception e) {
            throw new AuraHandledException('Error==> ' + e.getMessage());
        }
    }
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContactsByAccountId(Id accountId) {
        return [
            SELECT Id, Name, Title, Phone, Email, Owner.Name
            FROM Contact
            WHERE AccountId = :accountId with security_enforced
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts(){
        return [SELECT Id,Name from Contact LIMIT 10 with security_enforced];
    }

    @AuraEnabled(cacheable=true)
    public static List<Contact> findContacts(String searchKeyword){
        String key = '%'+searchKeyword+'%';
        return [SELECT Id,Name,Phone,Email FROM Contact WHERE Name LIKE : key LIMIT 10 with security_enforced];
    }
    
}