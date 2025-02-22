@isTest(isParallel=true)
global class FilterRecordsWithFormulaTests {
    private final static String ACCOUNT_NAME = 'Sample account';
    private final static List<Account> SAMPLE_ACCOUNTS = new List<Account>{
        new Account(Name = ACCOUNT_NAME + 1, NumberOfEmployees = 20),
        new Account(Name = ACCOUNT_NAME + 2, NumberOfEmployees = 10)
    };

    private final static String FORMULA =
        '$Record.Name == "' +
        ACCOUNT_NAME +
        1 +
        '"';

    @isTest
    global static void bulkInvoke_works() {
        List<Account> sampleAccounts = SAMPLE_ACCOUNTS;
        insert sampleAccounts;

        FilterRecordsWithFormula.InputParameters input = new FilterRecordsWithFormula.InputParameters();
        input.collection = sampleAccounts;
        input.formula = FORMULA;
        List<FilterRecordsWithFormula.InputParameters> inputs = new List<FilterRecordsWithFormula.InputParameters>{
            input
        };

        List<FilterRecordsWithFormula.OutputParameters> outputs = FilterRecordsWithFormula.bulkInvoke(
            inputs
        );

        Assert.areEqual(inputs.size(), outputs.size());
        Assert.areEqual(1, outputs[0].collection.size());
        Account acc = (Account) outputs[0].collection[0];
        Assert.areEqual(ACCOUNT_NAME + 1, acc.Name);
        Assert.areEqual(1, outputs[0].filteredRecordCount);
        Assert.areEqual(2, outputs[0].totalRecordCount);
        Assert.areEqual(1, outputs[0].filteredRecordCount);
    }
}