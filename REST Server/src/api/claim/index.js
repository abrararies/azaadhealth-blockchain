import { Router } from "express";
import { middleware as query } from "querymen";
import { middleware as body } from "bodymen";
import { token } from "../../services/passport";
import { create, index, show, update, destroy } from "./controller";
import { schema } from "./model";

const router = new Router();
const {
  Files,
  UserID,
  Title,
  Description,
  Status,
  SubmissionDate,
  InsuranceCompany,
  Employer
} = schema.tree;

/**
 * @api {post} /claims Create claim
 * @apiName CreateClaim
 * @apiGroup Claim
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiParam Files Claim's Files.
 * @apiParam UserID Claim's UserID.
 * @apiParam Title Claim's Title.
 * @apiParam Description Claim's Description.
 * @apiParam Status Claim's Status.
 * @apiParam SubmissionDate Claim's SubmissionDate.
 * @apiParam InsuranceCompany Claim's InsuranceCompany.
 * @apiParam Employer Claim's Employer.
 * @apiSuccess {Object} claim Claim's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Claim not found.
 * @apiError 401 admin access only.
 */

router.post(
  "/",
  token({ required: true }),
  create
);

/**
 * @api {get} /claims Retrieve claims
 * @apiName RetrieveClaims
 * @apiGroup Claim
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of claims.
 * @apiSuccess {Object[]} rows List of claims.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 admin access only.
 */
router.get("/", token({ required: true }), index);

/**
 * @api {get} /claims/:id Retrieve claim
 * @apiName RetrieveClaim
 * @apiGroup Claim
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiSuccess {Object} claim Claim's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Claim not found.
 * @apiError 401 admin access only.
 */
router.get("/:id", token({ required: true }), show);

/**
 * @api {put} /claims/:id Update claim
 * @apiName UpdateClaim
 * @apiGroup Claim
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiParam Files Claim's Files.
 * @apiParam UserID Claim's UserID.
 * @apiParam Title Claim's Title.
 * @apiParam Description Claim's Description.
 * @apiParam Status Claim's Status.
 * @apiParam SubmissionDate Claim's SubmissionDate.
 * @apiParam InsuranceCompany Claim's InsuranceCompany.
 * @apiParam Employer Claim's Employer.
 * @apiSuccess {Object} claim Claim's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Claim not found.
 * @apiError 401 admin access only.
 */
router.put(
  "/:id",
  token({ required: true }),
  body({
    Files,
    UserID,
    Title,
    Description,
    Status,
    SubmissionDate,
    InsuranceCompany,
    Employer
  }),
  update
);

/**
 * @api {delete} /claims/:id Delete claim
 * @apiName DeleteClaim
 * @apiGroup Claim
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Claim not found.
 * @apiError 401 admin access only.

 router.delete("/:id", token({ required: true }), destroy);

 */

export default router;
