import rp from "request-promise";
import { COMPOSER_REST_SERVER } from "../../config";

function getAllOrganizations() {
  let options = {
    url: `${COMPOSER_REST_SERVER}/org.azaadhealth.blockchain.Organisation`,
    json: true
  };
  return rp(options);
  // .then(success => {
  //   return success;
  // })
  // .catch(err => {
  //   console.log("err ", err);
  //   res.status(505).json({
  //     valid: false,
  //     err: err
  //   });
  // });
}

export { getAllOrganizations };
