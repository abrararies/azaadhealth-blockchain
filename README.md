# AzaadHealth Blockchain for Insurance Providers

> This demo is intended for Trustworks Blockchain Capestone Project but will be expanded upon in the future to create a comprehensive digital health ecosystem powered by blockchain tech.

Project Structure:
This project is divided into 3 main components

`main.cto` this is the Model File which defines the entities and assets which are involved in the network.
`logic.js` this houses the main business logic. It is the ChainCode/Library which intracts with the blockchain. Issueing identities is not part of the business logic which is why we are handling it via our Node server.
`permission.acl` this is the Access Control List which defines the restrictions each participant has over it when access any resource in the network.


This business network defines:

**Participant**
`User`
`Organisation`

**Asset**
`MedicalRecords`
`InsuranceClaim`

**Transaction**
`CreateNewUser`
`AssignUserOrganisation`
`CreateMedicalRecord`
`SubmitInsuranceClaim`

**Concept (for future)**
`Visits`
`Allergies`
`Treatments`
`Medicines`
`Address`
`ContactDetails`

User can be a stand-alone entity and can also become part of multiple organisations. User can create MedicalRecord, attach that MedicalRecord to an InsuranceClaim and then submit that InsuranceClaim to the organisation.


How to run:
The easiest way to test this is to download the `azaadhealth-blockchain.bna` file. Now go to `https://composer-playground.mybluemix.net` and select **Deploy a new business network**.
Under **Choose a Business Network Definition to start with**, select the browse option and open the previously downloaded BNA file. Type `admin@azaadhealth-blockchain` in **Give the network admin card** field and hit **Deploy**. 

**Voila!!**

**We have also deployed it to our AWS instance which sits besides our REST API server. The React Native app communicates with the rest server which in turn intracts with the blockchain network via the chaincode**

To test this Network Definition go to **Test** tab:

1. Create a new `User` participant by clicking `Submit Transaction`

2. From the drop down menu, select `CreateNewUser` and fill in the following values as an example

```
{
  "$class": "org.azaadhealth.blockchain.User",
  "userId": "123",
  "firstName": "John",
  "lastName": "Doe"
}
```

3. Now select **admin** from the top right corner and click `ID Registry`

4. On the next page, click `Issue New ID` and give an ID alphanumeric value e.g. a1b2. Now type `123` in the Participant field and hit submit.
**Please note that this step is being handled by our NodeJS server**

5. Hover over the newly created User entry and select `Use Now`. You are now using the app as an user.

6. You can now go ahead and execute the rest of the transactions.


**UPDATE**
**Feel free to test out and evaluate currently deployed permissioned blockchain network on our AWS instances
http://ec2-34-254-183-181.eu-west-1.compute.amazonaws.com:8080/test**
