import { doBatchOperation } from '../controllers/batchController';
import validateBatchSchema from '../middleware/validateSchema';
import { batchInputValidator } from '../validations/batch';

export default function(app) {
  app.post('/batch', validateBatchSchema(batchInputValidator()), doBatchOperation);
}