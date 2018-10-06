/**
 * Created by Inam on 2/5/2017.
 */
var q = require("q");
var s3 = require("s3");
import { DEFAULT_BUCKET, AWS_REGION } from "../../config";

export function saveTextAsFile(text, imageName) {
  var deferred = q.defer();

  var AWS = require("aws-sdk");
  AWS.config.region = AWS_REGION;

  var s3bucket = new AWS.S3({
    params: { Bucket: DEFAULT_BUCKET, ACL: "public-read" }
  });
  var params = {
    Key: imageName,
    Body: text,
    ContentEncoding: "base64",
    ContentType: "image/jpeg"
  };
  s3bucket.upload(params, function(err, data) {
    if (err) {
      console.log("Error uploading data: ", err);
      deferred.reject(err);
    } else {
      deferred.resolve(data);
    }
  });
  return deferred.promise;
}
