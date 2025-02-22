@isTest(isParallel=true)
global class IsRecordLockedTests {
    @isTest
    global static void bulkInvoke_works() {
        Account acc = new Account(Name = 'Sample Account');
        insert acc;
        Approval.lock(acc.Id);

        IsRecordLocked.InputParameters input = new IsRecordLocked.InputParameters();
        input.recordId = acc.Id;
        List<IsRecordLocked.InputParameters> inputs = new List<IsRecordLocked.InputParameters>{
            input
        };

        List<IsRecordLocked.OutputParameters> outputs = IsRecordLocked.bulkInvoke(
            inputs
        );

        Assert.areEqual(inputs.size(), outputs.size());
        Assert.isTrue(outputs[0].isLocked);
    }
}