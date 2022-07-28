const generate = require("../helpers/generate");
const validateRequired = require("../helpers/validateRequired");

module.exports = async (
  mentalAction,
  resourceModels,
  mentalConfig,
  checkBack
) => {
  const resourceSpec = resourceModels[mentalAction.resource];
  const attributes = resourceSpec.attributes;
  let forIndex = 0;

  // Start Prepare
  {
    mentalAction = await checkBack(mentalAction, "before_prepare");
    // We have to first perform the "generate" operations
    mentalAction = await generate(attributes, mentalAction);
    mentalAction = await checkBack(mentalAction, "after_prepare");
  }
  // --------------- End Prepare

  // Start Authorization
  {
    mentalAction = await checkBack(mentalAction, "before_authorization");

    const requiredBasicPermission = `${mentalAction.action}_${mentalAction.resource}`;

    if (
      mentalAction.permissions !== "*" &&
      !mentalAction.permissions.includes(requiredBasicPermission)
    ) {
      throw {
        statusCode: 403,
        message: "Forbidden",
      };
    }

    mentalAction = await checkBack(mentalAction, "after_authorization");
  }
  // --------------- End Authorization

  // Start Validation
  {
    mentalAction = await checkBack(mentalAction, "before_validation");
    mentalAction = await validateRequired(attributes, mentalAction);
    mentalAction = await checkBack(mentalAction, "after_validation");
  }
  // --------------- End Validation

  // Start Handling

  mentalAction = await checkBack(mentalAction, "before_handling");

  mentalAction = await checkBack(mentalAction, "after_handling");

  // --------------- End Handling

  // Start Respond

  mentalAction = await checkBack(mentalAction, "before_respond");

  mentalAction = await checkBack(mentalAction, "after_respond");

  // --------------- End Respond

  // console.log("mentalAction", mentalAction);

  return mentalAction;
};
