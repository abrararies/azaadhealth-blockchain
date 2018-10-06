import { Router } from "express";
import { schema } from "./model";
import { token } from "../../services/passport";
import { createNewMedicalDoc, getAllMedicalRecordsOfThisUser } from "./controller";
import { middleware as body } from "bodymen";
const router = new Router();
const { userDetails, URL, meta, Description } = schema.tree;

/**
 * @api {get} /medicalRecord Retrieve users
 * @apiName uploadMedicalRecord
 * @apiGroup medicalRecord
 * @apiParam {String} access_token User access_token.
 * @apiSuccess {Object} status | true or false.
 * @apiError {Object} 503 Any error occurred.
 */
router.post(
  "/",
  token({ required: true }),
  body({
    File: String,
    Name: String,
    userDetails,
    URL,
    meta,
    Description
  }),
  createNewMedicalDoc
);

router.get("/", token({ required: true }), getAllMedicalRecordsOfThisUser);
export default router;
