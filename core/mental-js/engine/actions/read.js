const getOperations = require("../helpers/getOperations");
const runOperations = require("../helpers/runOperations");
const fillBelongsToOneResources = require("../helpers/fillBelongsToOneResources");
const runTransformationsForFilters = require("../helpers/runTransformationsForFilters");
const authorize = require("../helpers/authorize");
const executeSequence = require("../helpers/executeSequence");
const enhanceWithHooks = require("../helpers/enhanceWithHooks");
const cleanPayload = require("../helpers/cleanPayload");
const runTransformations = require("../helpers/runTransformations");

module.exports = async (context) => {
  const sequence = await enhanceWithHooks(context, {
    prepare: [cleanPayload],
    authorize: [authorize],
    validate: [],
    handle: [
      runTransformationsForFilters,
      getOperations,
      runOperations,
      fillBelongsToOneResources,
      runTransformations,
    ],
    respond: [],
  });

  context = await executeSequence(context, sequence);

  return { respondResult: context.mentalAction["opResult"] };
};
