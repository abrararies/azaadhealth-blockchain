import MedicalRecord from "./model";
import { saveTextAsFile } from "../../services/s3/s3handler";
import { COMPOSER_REST_SERVER } from "../../config";
import rp from "request-promise";

export const createNewMedicalDoc = (
  {
    bodymen: {
      body: { File, Name, userDetails, URL, meta, Description }
    },
    user
  },
  res,
  next
) => {
  File = File.replace(/^data:image\/\w+;base64,/, "");
  saveTextAsFile(new Buffer(File, "base64"), Name)
    .then(success => {
      return MedicalRecord.create({
        userDetails: {
          firstName: user.firstName,
          lastName: user.lastName,
          userID: user._id,
          email: user.email
        },
        Description,
        Name,
        URL: success.Location
      });
    })
    .then(createdMedicalRecord => {
      let options = {
        uri: `${COMPOSER_REST_SERVER}/org.azaadhealth.blockchain.MedicalRecord`,
        method: "POST",
        body: {
          $class: "org.azaadhealth.blockchain.MedicalRecord",
          mrId: createdMedicalRecord._id.toString(),
          owner: user.email,
          value: Description,
          url: createdMedicalRecord.URL
        },
        json: true
      };
      rp(options)
        .then(body => {
          console.log("Medical rec updated in Block chain ", body);
          res.send({ status: true, createdMedicalRecord });
        })
        .catch(err => {
          console.log("err ", err);
          res.status(505).json({
            valid: false,
            err: err
          });
        });
    })
    .catch(err => {
      console.log("Error in uploading file");
      console.log(err);
    });
};
export const getAllMedicalRecordsOfThisUser = ({ user }, res, next) => {
  MedicalRecord.find({ "userDetails.userID": user._id }).exec((err, data) => {
    if (err) {
      res.send({ status: false, err });
    } else {
      res.send({ status: true, data });
    }
  });
};
