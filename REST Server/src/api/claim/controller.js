import { success, notFound } from "../../services/response/";
import Claim from "./model";
import rp from "request-promise";
import { COMPOSER_REST_SERVER } from "../../config";

export const create = (req, res, next) => {
  req.body.UserID = req.user._id;
  Claim.create(req.body)
    .then(claimObj => {
      let medicalRecordsArr = [];
      if (req.body.Files) {
        req.body.Files.forEach(file => {
          medicalRecordsArr.push(file.ObjectID);
        });
      }
      return new Promise((resolve, reject) => {
        let options = {
          method: "POST",
          uri: `${COMPOSER_REST_SERVER}/org.azaadhealth.blockchain.InsuranceClaim`,
          body: {
            $class: "org.azaadhealth.blockchain.InsuranceClaim",
            claimId: claimObj._id.toString(),
            status: "Open",
            dateCreated: new Date(),
            dateUpdated: new Date(),
            claimOwner: req.user.email,
            organisations: [req.user.organization.orgId],
            medicalRecords: medicalRecordsArr
          },
          json: true
        };
        rp(options)
          .then(body => {
            resolve(claimObj);
          })
          .catch(reject);
      });
    })
    .then(claim => claim.view(true))
    .then(success(res, 201))
    .catch(next);
};

export const index = (req, res, next) => {
  let query = req.body.query || { UserID: req.user._id };
  Claim.count(query)
    .then(count =>
      Claim.find(query).then(claims => ({
        count,
        rows: claims.map(claim => claim.view())
      }))
    )
    .then(success(res))
    .catch(next);
};
export const show = ({ params }, res, next) =>
  Claim.findById(params.id)
    .then(notFound(res))
    .then(claim => (claim ? claim.view() : null))
    .then(success(res))
    .catch(next);

export const update = ({ bodymen: { body }, params }, res, next) =>
  Claim.findById(params.id)
    .then(notFound(res))
    .then(claim => (claim ? Object.assign(claim, body).save() : null))
    .then(claim => (claim ? claim.view(true) : null))
    .then(success(res))
    .catch(next);

export const destroy = ({ params }, res, next) =>
  Claim.findById(params.id)
    .then(notFound(res))
    .then(claim => (claim ? claim.remove() : null))
    .then(success(res, 204))
    .catch(next);
