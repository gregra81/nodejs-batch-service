import { validate } from 'jsonschema';
import { hasCurlies } from '../utils/helper';

const _generateErrorObj = (errors) => {

  const errArr = Array.from(errors).map((val) => {
    return {
      'field': val.argument,
      'error': val.stack
    }
  });

  return {
    'msg': 'Bad Input',
    'errors': errArr
  }
};

/**
 * If user has passed body with bad structure, we need to catch that
 * @param reqBody
 * @returns {Array}
 * @private
 */
const _runSpecificBatchValidations = (reqBody) => {
  const requiredIdVerbs = ['GET', 'DELETE', 'PATCH', 'PUT'];
  const requiredBodyVerbs = ['POST'];

  const errors = [];

  if (requiredIdVerbs.includes(reqBody.endpoint.verb)) {
    if (!hasCurlies(reqBody.endpoint.url)) {
      const error = {
        argument: `url`,
        stack: `The field "url" must have a parameter placeholder (like {userId}) when http verb ${reqBody.endpoint.verb} is being used`
      };
      errors.push(error);
    }

    reqBody.payload.forEach((val, index) => {
      if (!val.id) {
        const error = {
          argument: `payload[${index}]`,
          stack: `The field "payload[${index}].id" is missing from the payload. It is required when http verb ${reqBody.endpoint.verb} is being used`
        };
        errors.push(error);
      }
    });
  }

  if (requiredBodyVerbs.includes(reqBody.endpoint.verb)) {
    if (hasCurlies(reqBody.endpoint.url)) {
      const error = {
        argument: `url`,
        stack: `The field "url" should not have a parameter placeholder (like {userId}) when http verb ${reqBody.endpoint.verb} is being used`
      };
      errors.push(error);
    }

    reqBody.payload.forEach((val, index) => {
      if (!val.body) {
        const error = {
          argument: `payload[${index}]`,
          stack: `The field "payload[${index}].body" is missing from the payload. It is required when http verb ${reqBody.endpoint.verb} is being used`
        };
        errors.push(error);
      }

      if (val.id) {
        const error = {
          argument: `payload[${index}]`,
          stack: `The field "payload[${index}].id" shouldn't be in the payload items when http verb ${reqBody.endpoint.verb} is being used`
        };
        errors.push(error);
      }
    });
  }

  return errors;
};

export default function validateBatchSchema(validator) {
  return function(req, res, next) {

    // Start by validating schema
    const validatorRes = validate(req.body, validator);
    if (validatorRes.errors.length > 0) {
      console.log('User had input errors:', validatorRes.errors);
      res.status(400).json(_generateErrorObj(validatorRes.errors));
      return;
    }

    // if schema ok, we should also validate special cases
    const batchValidationErrors = _runSpecificBatchValidations(req.body);
    if (batchValidationErrors.length > 0) {
      console.log('User had input errors:', batchValidationErrors);
      res.status(400).json(_generateErrorObj(batchValidationErrors));
      return;
    }
    next();
  }
}