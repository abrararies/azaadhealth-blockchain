
/**
 * Create New User transaction processor function.
 * @param {org.azaadhealth.blockchain.CreateNewUser} tx The New User transaction instance.
 * @transaction
 */

async function CreateNewUser(user) {
	let participantRegistry = await getParticipantRegistry('org.azaadhealth.blockchain.User');
  
    let factory = getFactory();
  	let checkUserExists = await participantRegistry.exists(user.userId);
  		if(!checkUserExists){
          var participant = factory.newResource('org.azaadhealth.blockchain', 'User', user.userId);
          participant.firstName = user.firstName;
          participant.lastName = user.lastName;
          return participantRegistry.add(participant);
        }else{
          throw new Error('User Already Exists!');
        }
}


/**
 * Assign a User to Organisation transaction processor function.
 * @param {org.azaadhealth.blockchain.AssignUserOrganisation} tx The assign user transaction instance.
 * @transaction
 */
async function assignUserOrganisation(data){
  
  let participantRegistry = await getParticipantRegistry('org.azaadhealth.blockchain.User');
  let orgRegistry = await getParticipantRegistry('org.azaadhealth.blockchain.Organisation');
  let currentParticipant = getCurrentParticipant();
  let checkUserExists = await participantRegistry.exists(currentParticipant.userId);
 
  if(checkUserExists){
    let checkOrgExists = await orgRegistry.exists(data.orgId);
    if(checkOrgExists){
      let participant = await participantRegistry.get(currentParticipant.userId);
      let organisation = await orgRegistry.get(data.orgId);
    		participant.organisations = [];
    		participant.organisations.push(organisation);
    		return participantRegistry.update(participant);
       }
    else{
      throw new Error('Organisation Does Not Exists!');
    }
          
  }
  else{
     throw new Error('User Does Not Exists!');
  }
  
}

/**
 * Create Medical Record transaction processor function.
 * @param {org.azaadhealth.blockchain.CreateMedicalRecord} tx The medical record transaction instance.
 * @transaction
 */


async function createMedicalRecord(data){
  let assetRegistry = await getAssetRegistry('org.azaadhealth.blockchain.MedicalRecord');
  let participantRegistry = await getParticipantRegistry('org.azaadhealth.blockchain.User');
  let currentParticipant = getCurrentParticipant();
  let participant = await participantRegistry.get(currentParticipant.userId);
  let factory = getFactory();
  let medicalRecord = factory.newResource('org.azaadhealth.blockchain', 'MedicalRecord', data.mrId);
  medicalRecord.owner = currentParticipant;
  medicalRecord.url = data.url
  await assetRegistry.add(medicalRecord);
  
  
  participant.medicalRecords = [];
  participant.medicalRecords.push(medicalRecord);
  await participantRegistry.update(participant);
}

/**
 * Submit Insurance Claim transaction processor function.
 * @param {org.azaadhealth.blockchain.SubmitInsuranceClaim} tx The insurance transaction instance.
 * @transaction
 */


async function submitInsuranceClaim(data){
  let assetRegistry = await getAssetRegistry('org.azaadhealth.blockchain.InsuranceClaim');
  let participantRegistry = await getParticipantRegistry('org.azaadhealth.blockchain.User');
  let orgRegistry = await getParticipantRegistry('org.azaadhealth.blockchain.Organisation');
  let organisation = await participantRegistry.get(data.orgId);
  let currentParticipant = getCurrentParticipant();
  let participant = await participantRegistry.get(currentParticipant.userId);
  let factory = getFactory();
  
  let insuranceMR = [];
  if(data.medicalRecords && data.medicalRecords.length > 0){
  	let mrRegistry = await getAssetRegistry('org.azaadhealth.blockchain.MedicalRecord');
    for (let i = 0; i < data.medicalRecords.length; i++) {
 
    	let record = await mrRegistry.get(data.medicalRecords[i]);
      	insuranceMR.push(record);
   
    }
  }
  
  let insuranceClaim = factory.newResource('org.azaadhealth.blockchain', 'InsuranceClaim', data.claimId);
  insuranceClaim.claimOwner = currentParticipant;
  insuranceClaim.status = data.status;
  insuranceClaim.dateCreated = Date.Now;
  insuranceClaim.dateUpdated = Date.Now;
  insuranceClaim.medicalRecords = insuranceMR;
  await assetRegistry.add(insuranceClaim);
  
  
  participant.claims = [];
  participant.claims.push(insuranceClaim);
  await participantRegistry.update(participant);
  
  organisation.claims = [];
  organisation.claims.push(insuranceClaim);
  await orgRegistry.update(organisation);
}

